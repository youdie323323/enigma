import Template, { TemplateVariables } from "./Templates/Template";
import VariableGenerator from "./InterpreterVariableGenerator";
import generate from "@babel/generator";
import * as t from '@babel/types';
import { transformSync } from "@babel/core";
import regeneratorRuntimeTemplate from "./Templates/RegeneratorRuntime";
import { compileASTInstructionHandlers } from "../../Instruction";
import BytecodeTranscoderProvider, { shuffle } from "./Bytecode/BytecodeTranscoderProvider";
import unraw from "unraw";
import { type Bytecode } from "./Bytecode/Bytecode";
import { OperatorCode, FUNCTION_RESULT_REG } from "../../Compiler/CompilerOperatorCode";
import { InterpreterDefaultVariableEnvironment } from "./InterpreterDefaultVariableEnvironment";
import { InstructionAccesibleVariableEnvironment, InstructionVariableEnvironment } from "../../Instruction/InstructionAccesibleVariableEnvironment";

const LICENSE_PATTERN = /(?:^[!@]|^@(?:preserve|license|copyright)|^\s*(?:MIT|MPL|GPL|LGPL|BSD|ISC|Apache|UNLICENSED)\b|\([Cc]\)|[Ll]icen[cs]e|[Cc]opyright|\u00A9)/m;

/**
 * Class responsible for building a JavaScript interpreter from bytecode.
 */
export default class InterpreterBuilder {
    private variableGenerator: VariableGenerator = new VariableGenerator();

    /**
     * Build the javascript interpreter from bytecode.
     * 
     * @param bytecode - The compiled bytecode
     * @returns The interpreter code in javascript
     */
    public async build(bytecode: Bytecode): Promise<string> {
        this.variableGenerator.reset();

        const programNodes: Array<t.Statement> = [];

        const { variableGenerator } = this;

        const defaultVariableEnvironment = {
            decoder: variableGenerator.generateIdentifier(),
            decodedBytecode: variableGenerator.generateIdentifier(),
            stringObject: variableGenerator.generateIdentifier(),
            vmStateFunction: variableGenerator.generateIdentifier(),
            vmStateObject: variableGenerator.generateIdentifier(),
            literalIdsArray: variableGenerator.generateIdentifier(),
            popFunction: variableGenerator.generateIdentifier(),
            pushFunction: variableGenerator.generateIdentifier(),
            instructionSet: variableGenerator.generateIdentifier(),
            dispatcherFunction: variableGenerator.generateIdentifier(),

            stringSlicerProp: variableGenerator.generateIdentifier(),
            finallyAddressProp: variableGenerator.generateIdentifier(),
            currentThisProp: variableGenerator.generateIdentifier(),
            stateArrProp: variableGenerator.generateIdentifier(),
            errorObjectProp: variableGenerator.generateIdentifier(),
            anyObjectPropSubprop: variableGenerator.generateIdentifier(),
            parentMemoryStorerProp: variableGenerator.generateIdentifier(),
            randomFuncPropAddr: variableGenerator.generateIdentifier(),
            funcResultStorerProp: variableGenerator.generateIdentifier(),
            randomFuncProp: variableGenerator.generateIdentifier(),
            stringDumpProp: variableGenerator.generateIdentifier(),
            catchAddrProp: variableGenerator.generateIdentifier(),
            memoryProp: variableGenerator.generateIdentifier(),
            randomFuncPropFunc: variableGenerator.generateIdentifier(),
            callerProp: variableGenerator.generateIdentifier(),

            literalLoaderAliasFunction: variableGenerator.generateIdentifier(),
            literalLoaderFunction: variableGenerator.generateIdentifier(),
            exceptionHandlerFunction: variableGenerator.generateIdentifier(),
            stateIndex1GetterFunction: variableGenerator.generateIdentifier(),
            globalObject: variableGenerator.generateIdentifier(),
            bytecode: variableGenerator.generateIdentifier(),
            bytecodeLength: variableGenerator.generateIdentifier(),
            bytecodeReturnFunction: variableGenerator.generateIdentifier(),
            promise: variableGenerator.generateIdentifier(),
            regeneratorRuntime: variableGenerator.generateIdentifier(),
            bytecodeLengthAndTrueLength: variableGenerator.generateIdentifier(),
            literalLength: variableGenerator.generateIdentifier(),
            loadRegFunction: variableGenerator.generateIdentifier(),
        } as const satisfies InterpreterDefaultVariableEnvironment;

        const randomizedLiteralOpcodes: Array<OperatorCode> = shuffle([
            OperatorCode.Null,
            OperatorCode.StoreOrLoadStr,
            OperatorCode.Num,
            OperatorCode.True,
            OperatorCode.False,
            OperatorCode.FakePlaceholder,
        ]);

        const randomizedLiteralBranches = shuffle([
            `if (result !== literalOps[${randomizedLiteralOpcodes.indexOf(OperatorCode.FakePlaceholder)}]) {`,
            `
                if (result === literalOps[${randomizedLiteralOpcodes.indexOf(OperatorCode.Num)}]) {
                    var high = bytecode[vmState[0]++],
                        low = bytecode[vmState[0]++],
                        sign = high & 2147483648 ? -1 : 1,
                        exponent = (high & 2146435072) >> 20,
                        mantissa = (high & 1048575) * Math.pow(2, 32) + (low < 0 ? low + Math.pow(2, 32) : low);
                    return exponent === 2047 ? mantissa ? NaN : sign * (1 / 0) : (exponent !== 0 ? mantissa += Math.pow(2, 52) : exponent++, sign * mantissa * Math.pow(2, exponent - 1075));
                }
            `,
            `   if (result === literalOps[${randomizedLiteralOpcodes.indexOf(OperatorCode.Null)}]) return null;`,
            `
                if (result === literalOps[${randomizedLiteralOpcodes.indexOf(OperatorCode.StoreOrLoadStr)}]) {
                    if (stringObject != null && stringObject.{stringSlicerProp}) return stringObject.{stringSlicerProp}(bytecode[vmState[0]++], bytecode[vmState[0]++]);
                    for (var str = '', length = bytecode[vmState[0]++], index = 0; index < length; index++) {
                        var charCode = bytecode[vmState[0]++];
                        str += String.fromCharCode(charCode & 0xFFFFFFC0 | charCode * 39 & 0x3F);
                    }
                    return str;
                }
            `,
            `   if (result === literalOps[${randomizedLiteralOpcodes.indexOf(OperatorCode.True)}]) return !0;`,
            `   if (result === literalOps[${randomizedLiteralOpcodes.indexOf(OperatorCode.False)}]) return !1;`,
        ]).concat(
            "   return vmState[result >> 5]",
            "}"
        );

        const encodingTable = BytecodeTranscoderProvider.table,
            encodingRadix = BytecodeTranscoderProvider.radix;

        programNodes.push(
            ...BytecodeTranscoderProvider.decoder.compile(defaultVariableEnvironment),
            ...new Template(`
            var {bytecode} = "{encoded}",
                {literalLength} = "length",
                {decodedBytecode} = {decoder}({bytecode}, "{table}", {radix}),
                {bytecodeLength} = {decodedBytecode}[{literalLength}];
            `).compile(
                {
                    ...defaultVariableEnvironment,

                    encoded: BytecodeTranscoderProvider.encode(bytecode, encodingTable, encodingRadix),
                    table: encodingTable,
                    radix: encodingRadix,
                }
            ),
            ...new Template(`
            function {stateIndex1GetterFunction}(state) {
                return state.{stateArrProp}[1]
            }
            `).compile(defaultVariableEnvironment),
            ...new Template(`
            for (var {randomFuncProp} = "", {bytecodeLengthAndTrueLength} = {bytecodeLength} + ({randomFuncProp} + !0)[{literalLength}], {stringObject} = {
                {stringDumpProp}: ""
            }, {temp} = 0; {temp} < 28; {temp}++) {randomFuncProp} += String.fromCharCode(97 + Math.floor(26 * Math.random()));
            `).compile({
                ...defaultVariableEnvironment,

                temp: variableGenerator.generateIdentifier(),
            }),
        );

        programNodes.push(
            ...new Template(`
            var {globalObject} = window,
                {promise} = {globalObject}.Promise;
            `).compile(defaultVariableEnvironment),
        );

        programNodes.push(
            ...new Template(`
            function {loadRegFunction}(state) {
                return {decodedBytecode}[state.{stateArrProp}[0]++] >> 5
            }
            
            function {vmStateFunction}() {
                // One for instruction pointer
                var mainState = [1, {
                    {currentThisProp}: {globalObject},
                    {callerProp}: null,
                    {memoryProp}: [],
                    {stateArrProp}: [0],
                    {parentMemoryStorerProp}: void 0,
                }, void 0];
                return {
                    {stateArrProp}: mainState,
                    {errorObjectProp}: void 0,
                }
            }
            
            function {exceptionHandlerFunction}(state, err) {
                for (;;) {
                    var nextState = state.{stateArrProp}[1];

                    // Throw err if context is nullish (theres no valid try-catch)
                    if (!nextState) throw err;

                    // Found try-catch, set error then jump to catch address
                    if (nextState.{catchAddrProp}) {
                        state.{errorObjectProp} = {
                          {anyObjectPropSubprop}: err,
                        }, state.{stateArrProp}[0] = nextState.{catchAddrProp};
                        return;
                    }
                    
                    // Traverse state and find try-catch
                    state.{stateArrProp} = nextState.{stateArrProp};
                }
            }
            
            // Global vm state, which represents "Program"
            var {vmStateObject} = {vmStateFunction}();

            function {pushFunction}(state, elem) {
                state.{stateArrProp}[{loadRegFunction}(state)] = elem
            }
            
            // Literal loader section
            var {literalLoaderFunction} = function (bytecode, vmState, literalOps, stringObject) {
                    var result = bytecode[vmState[0]++];
                    if (result & 1) return result >> 1;
                    ${randomizedLiteralBranches.join("\n")}
                }, 
                {literalIdsArray} = ${JSON.stringify(randomizedLiteralOpcodes)};

            // Load string section
            {
                {stringObject}.{stringSlicerProp} = function(start, length) {
                    return {stringObject}.{stringDumpProp}.slice(start, start + length)
                }
                var {temp} = {decodedBytecode}[{bytecodeLength} + {randomFuncProp}.indexOf(".")] ^ {bytecodeLengthAndTrueLength},
                    {temp2} = {decodedBytecode}.splice({temp}, {decodedBytecode}[{temp} + {vmStateObject}.{stateArrProp}[0]] + 2);
                {stringObject}.{stringDumpProp} = {literalLoaderFunction}({temp2}, {vmStateObject}.{stateArrProp}[1].{stateArrProp}, {literalIdsArray});
            }

            function {literalLoaderAliasFunction}(state) {
                return {literalLoaderFunction}({decodedBytecode}, state.{stateArrProp}, {literalIdsArray}, {stringObject})
            }

            function {bytecodeReturnFunction}(state, returnValue) {
                var $state = {stateIndex1GetterFunction}(state);
                return $state.{funcResultStorerProp} = {
                    {anyObjectPropSubprop}: returnValue,
                }, 
                    $state.{finallyAddressProp} ? state.{stateArrProp}[0] = $state.{finallyAddressProp} : 
                        ($state.{stateArrProp}.length == 1 ? (state.{stateArrProp}[${FUNCTION_RESULT_REG}] = returnValue, null) : 
                            (state.{stateArrProp} = $state.{stateArrProp}, state.{stateArrProp}[${FUNCTION_RESULT_REG}] = returnValue, void 0));
            }
            `).compile({
                ...defaultVariableEnvironment,

                temp: variableGenerator.generateIdentifier(),
                temp2: variableGenerator.generateIdentifier(),
            })
        );

        const stateArgument = variableGenerator.generateIdentifier();
        const popArgument = variableGenerator.generateIdentifier();
        const pushArgument = variableGenerator.generateIdentifier();
        const stateIndex1GetterArgument = variableGenerator.generateIdentifier();
        const bigObjectLikeInstancesArgument = variableGenerator.generateIdentifier();
        const stateRelatedFunctionsArgument = variableGenerator.generateIdentifier();

        const callerArguments = [
            "state",                                              // stateArgument
            defaultVariableEnvironment.literalLoaderAliasFunction,        // popArgument
            defaultVariableEnvironment.pushFunction,              // pushArgument
            defaultVariableEnvironment.stateIndex1GetterFunction, // stateIndex1GetterArgument
            "bigObjectLikeInstances",                             // bigObjectLikeInstancesArgument
            "stateRelatedFunctions",                              // stateRelatedFunctionsArgument
        ];

        const instructionAccesibleVariableEnvironment = Object.assign(
            defaultVariableEnvironment,
            {
                stateArgument,
                popArgument,
                pushArgument,
                stateIndex1GetterArgument,
                bigObjectLikeInstancesArgument,
                stateRelatedFunctionsArgument,
            } satisfies InstructionVariableEnvironment,
        ) satisfies InstructionAccesibleVariableEnvironment;

        const handlers = compileASTInstructionHandlers(
            instructionAccesibleVariableEnvironment,
            [
                t.identifier(stateArgument),
                t.identifier(popArgument),
                t.identifier(pushArgument),
                t.identifier(stateIndex1GetterArgument),
                t.identifier(bigObjectLikeInstancesArgument),
                t.identifier(stateRelatedFunctionsArgument),
            ] satisfies Array<t.Identifier>,
        );

        programNodes.push(
            t.variableDeclaration(
                "var",
                [
                    t.variableDeclarator(
                        t.identifier(defaultVariableEnvironment.instructionSet),
                        t.arrayExpression(handlers),
                    ),
                ],
            ),
        );

        programNodes.push(
            ...new Template(`
            function {popFunction}(state) {
                return state.{stateArrProp}[{decodedBytecode}[state.{stateArrProp}[0]++] >> 5];
            }
            `).compile(defaultVariableEnvironment),
        );

        // Dispatcher
        programNodes.push(
            ...regeneratorRuntimeTemplate.compile(defaultVariableEnvironment),
            ...this.compileDispatcherAST({
                ...defaultVariableEnvironment,

                callerArgumentsString: callerArguments.join(","),
            }),
            ...new Template(`
            // Run program
            {dispatcherFunction}({vmStateObject})
            `).compile(defaultVariableEnvironment),
        );

        const { code } = generate(t.program(
            [
                t.expressionStatement(
                    t.callExpression(
                        t.functionExpression(
                            null,
                            [],
                            t.blockStatement(programNodes),
                        ),
                        [],
                    ),
                ),
            ],
            [
                // Add use strict directive
                t.directive(t.directiveLiteral("use strict")),
            ],
        ));

        const { code: transformedCode } = transformSync(code, {
            // Ignore babel.config.js
            configFile: false,
            presets: [
                ["minify", {
                    builtIns: false,
                    simplify: false,
                    flipComparisons: false,
                    propertyLiterals: false,
                    evaluate: false,
                    deadcode: false,
                    mangle: {
                        eval: true,
                    },
                }],
            ],

            comments: false,

            // Dont remove license
            shouldPrintComment: (val) => LICENSE_PATTERN.test(val),
        });

        return unraw(transformedCode);
    }

    private compileDispatcherAST(env: TemplateVariables): Array<t.Statement> {
        return new Template(`
            function {dispatcherFunction}(state) {
                for (var bigObjectLikeInstances = [
                    {globalObject}, 
                    [
                        {promise}, 
                        {regeneratorRuntime}
                    ], 
                    {decodedBytecode}
                ], 
                stateRelatedFunctions = [
                    {bytecodeReturnFunction}, 
                    {exceptionHandlerFunction}, 
                    {vmStateFunction}, 
                    {dispatcherFunction}, 
                    {randomFuncProp}, 
                    {popFunction}
                ] ; ;) {
                    var instructionHandler = {instructionSet}[{decodedBytecode}[state.{stateArrProp}[0]++]];
                    try {
                        var returnSignal = instructionHandler({callerArgumentsString});
                        if (returnSignal === null) break;
                    } catch (err) {
                        {exceptionHandlerFunction}(state, err);
                    }
                }
            }
        `).compile(env);
    }
}