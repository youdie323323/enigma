import Template from "../Templates/Template";
import VariableGenerator from "./ProgramBuilderVariableGenerator";
import { shuffle } from "../Utils/Random";
import generate from "@babel/generator";
import * as t from '@babel/types';
import { transformSync } from "@babel/core";
import regeneratorRuntimeTemplate from "../Templates/Regenerator";
import { OperatorCode, FUNCTION_RESULT_REG, generateASTInstructionHandlers } from "../Instruction";
import BytecodeTranscoderProvider from "./Bytecode/BytecodeTranscoderProvider";
import unraw from "unraw";
import { type Bytecode } from "./Bytecode/Bytecode";

const LICENSE_PATTERN = /(?:^[!@]|^@(?:preserve|license|copyright)|^\s*(?:MIT|MPL|GPL|LGPL|BSD|ISC|Apache|UNLICENSED)\b|\([Cc]\)|[Ll]icen[cs]e|[Cc]opyright|\u00A9)/m;

/**
 * Builder that constructs intepreter.
 */
export default class ProgramBuilder {
    private variableGenerator: VariableGenerator = new VariableGenerator();

    private compileDispatcherAST(env: Record<string, string>): Array<t.Statement> {
        return new Template(`
            function {dispatcherFunctionName}(state) {
                for (var oneLocUseVariables = [
                    {globalObjectName}, 
                    [
                        {promiseName}, 
                        {regeneratorRuntimeName}
                    ], 
                    {decodedBytecodeName}
                ], 
                commonFunctions = [
                    {bytecodeReturnFunctionName}, 
                    {exceptionHandlerFunctionName}, 
                    {vmStateFunctionName}, 
                    {dispatcherFunctionName}, 
                    {randomFuncPropName}, 
                    {popFunctionName}
                ] ; ;) {
                    var instructionHandler = {instructionSetName}[{decodedBytecodeName}[state.{stateArrPropName}[0]++]];
                    try {
                        var returnSignal = instructionHandler({callerArgumentsString});
                        if (returnSignal === null) break;
                    } catch (err) {
                        {exceptionHandlerFunctionName}(state, err);
                    }
                }
            }
        `).compile(env);
    }

    /**
     * Build the javascript intepreter from bytecode.
     * 
     * @param bytecode - The compiled bytecode
     * @returns The intepreter code in javascript
     */
    public async build(bytecode: Bytecode): Promise<string> {
        this.variableGenerator.reset();

        const programNodes: Array<t.Statement> = [];

        const { variableGenerator } = this;

        const defaultVariableEnvironment: Record<string, string> = {
            decoderName: variableGenerator.generateIdentifier(),
            decodedBytecodeName: variableGenerator.generateIdentifier(),
            stringObjectName: variableGenerator.generateIdentifier(),
            vmStateFunctionName: variableGenerator.generateIdentifier(),
            vmStateObjectName: variableGenerator.generateIdentifier(),
            literalIdsArrayName: variableGenerator.generateIdentifier(),
            popFunctionName: variableGenerator.generateIdentifier(),
            pushFunctionName: variableGenerator.generateIdentifier(),
            instructionSetName: variableGenerator.generateIdentifier(),
            dispatcherFunctionName: variableGenerator.generateIdentifier(),

            stringSlicerPropName: variableGenerator.generateIdentifier(),
            finallyAddressPropName: variableGenerator.generateIdentifier(),
            currentThisPropName: variableGenerator.generateIdentifier(),
            stateArrPropName: variableGenerator.generateIdentifier(),
            errorObjectPropName: variableGenerator.generateIdentifier(),
            parentMemoryStorerPropName: variableGenerator.generateIdentifier(),
            randomFuncPropAddrName: variableGenerator.generateIdentifier(),
            funcResultStorerPropName: variableGenerator.generateIdentifier(),
            objectSubpropName: variableGenerator.generateIdentifier(),
            randomFuncPropName: variableGenerator.generateIdentifier(),
            stringDumpPropName: variableGenerator.generateIdentifier(),
            catchAddrPropName: variableGenerator.generateIdentifier(),
            memoryPropName: variableGenerator.generateIdentifier(),
            randomFuncPropFuncName: variableGenerator.generateIdentifier(),
            callerPropName: variableGenerator.generateIdentifier(),

            literalLoaderAliasFunctionName: variableGenerator.generateIdentifier(),
            literalLoaderFunctionName: variableGenerator.generateIdentifier(),
            exceptionHandlerFunctionName: variableGenerator.generateIdentifier(),
            stateIndex1GetterFunctionName: variableGenerator.generateIdentifier(),
            globalObjectName: variableGenerator.generateIdentifier(),
            bytecodeName: variableGenerator.generateIdentifier(),
            bytecodeLengthName: variableGenerator.generateIdentifier(),
            bytecodeReturnFunctionName: variableGenerator.generateIdentifier(),
            promiseName: variableGenerator.generateIdentifier(),
            regeneratorRuntimeName: variableGenerator.generateIdentifier(),
            bytecodeLengthAndTrueLength: variableGenerator.generateIdentifier(),
            literalLengthName: variableGenerator.generateIdentifier(),
            loadRegFunctionName: variableGenerator.generateIdentifier(),
        } as const;

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
                    if (stringObject != null && stringObject.{stringSlicerPropName}) return stringObject.{stringSlicerPropName}(bytecode[vmState[0]++], bytecode[vmState[0]++]);
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
            var {bytecodeName} = "{encoded}",
                {literalLengthName} = "length",
                {decodedBytecodeName} = {decoderName}({bytecodeName}, "{table}", {radix}),
                {bytecodeLengthName} = {decodedBytecodeName}[{literalLengthName}];
            `).compile(
                {
                    ...defaultVariableEnvironment,

                    encoded: BytecodeTranscoderProvider.encode(bytecode, encodingTable, encodingRadix),
                    table: encodingTable,
                    radix: encodingRadix,
                }
            ),
            ...new Template(`
            function {stateIndex1GetterFunctionName}(state) {
                return state.{stateArrPropName}[1]
            }
            `).compile(defaultVariableEnvironment),
            ...new Template(`
            for (var {randomFuncPropName} = "", {bytecodeLengthAndTrueLength} = {bytecodeLengthName} + ({randomFuncPropName} + !0)[{literalLengthName}], {stringObjectName} = {
                {stringDumpPropName}: ""
            }, {temp} = 0; {temp} < 28; {temp}++) {randomFuncPropName} += String.fromCharCode(97 + Math.floor(26 * Math.random()));
            `).compile({
                ...defaultVariableEnvironment,

                temp: variableGenerator.generateIdentifier(),
            }),
        );

        programNodes.push(
            ...new Template(`
            var {globalObjectName} = window,
                {promiseName} = {globalObjectName}.Promise;
            `).compile(defaultVariableEnvironment),
        );

        programNodes.push(
            ...new Template(`
            function {loadRegFunctionName}(state) {
                return {decodedBytecodeName}[state.{stateArrPropName}[0]++] >> 5
            }
            
            function {vmStateFunctionName}() {
                // One for instruction pointer
                var mainState = [1, {
                    {currentThisPropName}: {globalObjectName},
                    {callerPropName}: null,
                    {memoryPropName}: [],
                    {stateArrPropName}: [0],
                    {parentMemoryStorerPropName}: void 0,
                }, void 0];
                return {
                    {stateArrPropName}: mainState,
                    {errorObjectPropName}: void 0,
                }
            }
            
            function {exceptionHandlerFunctionName}(state, err) {
                for (;;) {
                    var nextState = state.{stateArrPropName}[1];

                    // Throw err if context is nullish (theres no valid try-catch)
                    if (!nextState) throw err;

                    // Found try-catch, set error then jump to catch address
                    if (nextState.{catchAddrPropName}) {
                        state.{errorObjectPropName} = {
                          {objectSubpropName}: err,
                        }, state.{stateArrPropName}[0] = nextState.{catchAddrPropName};
                        return;
                    }
                    
                    // Traverse state and find try-catch
                    state.{stateArrPropName} = nextState.{stateArrPropName};
                }
            }
            
            // Global vm state, which represents "Program"
            var {vmStateObjectName} = {vmStateFunctionName}();

            function {pushFunctionName}(state, elem) {
                state.{stateArrPropName}[{loadRegFunctionName}(state)] = elem
            }
            
            // Literal loader section
            var {literalLoaderFunctionName} = function (bytecode, vmState, literalOps, stringObject) {
                    var result = bytecode[vmState[0]++];
                    if (result & 1) return result >> 1;
                    ${randomizedLiteralBranches.join("\n")}
                }, 
                {literalIdsArrayName} = ${JSON.stringify(randomizedLiteralOpcodes)};

            // Load string section
            {
                {stringObjectName}.{stringSlicerPropName} = function(start, length) {
                    return {stringObjectName}.{stringDumpPropName}.slice(start, start + length)
                }
                var {temp} = {decodedBytecodeName}[{bytecodeLengthName} + {randomFuncPropName}.indexOf(".")] ^ {bytecodeLengthAndTrueLength},
                    {temp2} = {decodedBytecodeName}.splice({temp}, {decodedBytecodeName}[{temp} + {vmStateObjectName}.{stateArrPropName}[0]] + 2);
                {stringObjectName}.{stringDumpPropName} = {literalLoaderFunctionName}({temp2}, {vmStateObjectName}.{stateArrPropName}[1].{stateArrPropName}, {literalIdsArrayName});
            }

            function {literalLoaderAliasFunctionName}(state) {
                return {literalLoaderFunctionName}({decodedBytecodeName}, state.{stateArrPropName}, {literalIdsArrayName}, {stringObjectName})
            }

            function {bytecodeReturnFunctionName}(state, returnValue) {
                var $state = {stateIndex1GetterFunctionName}(state);
                return $state.{funcResultStorerPropName} = {
                    {objectSubpropName}: returnValue,
                }, 
                    $state.{finallyAddressPropName} ? state.{stateArrPropName}[0] = $state.{finallyAddressPropName} : 
                        ($state.{stateArrPropName}.length == 1 ? (state.{stateArrPropName}[${FUNCTION_RESULT_REG}] = returnValue, null) : 
                            (state.{stateArrPropName} = $state.{stateArrPropName}, state.{stateArrPropName}[${FUNCTION_RESULT_REG}] = returnValue, void 0));
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
        const stateArrayGetterArgument = variableGenerator.generateIdentifier();
        const oneLocUseArgument = variableGenerator.generateIdentifier();
        const commonFunctionsArgument = variableGenerator.generateIdentifier();

        const instructionAccesibleVariableNames: Map<string, string> = new Map<string, string>([
            ["STATE", stateArgument],
            ["POP", popArgument],
            ["PUSH", pushArgument],
            ["STATE_ARRAY_GETTER", stateArrayGetterArgument],
            ["ONE_LOC_USE", oneLocUseArgument],
            ["COMMON_FUNCTIONS", commonFunctionsArgument],

            ["BYTECODE", defaultVariableEnvironment["decodedBytecodeName"]],
            ["STATE_ARR", defaultVariableEnvironment["stateArrPropName"]],
            ["STATE_STORER", defaultVariableEnvironment["stateArrPropName"]],
            ["ERROR_ADDR", defaultVariableEnvironment["catchAddrPropName"]],
            ["FINALLY_ADDR", defaultVariableEnvironment["finallyAddressPropName"]],
            ["PARENT_MEMORY_KEEPER", defaultVariableEnvironment["parentMemoryStorerPropName"]],
            ["MEMORY", defaultVariableEnvironment["memoryPropName"]],
            ["RAND_FUNC_PROP_ADDR", defaultVariableEnvironment["randomFuncPropAddrName"]],
            ["RAND_FUNC_PROP_FUNC", defaultVariableEnvironment["randomFuncPropFuncName"]],
            ["RAND_FUNC_PROP_PARENT", defaultVariableEnvironment["parentMemoryStorerPropName"]],
            ["CURRENT_THIS", defaultVariableEnvironment["currentThisPropName"]],
            ["CALLER", defaultVariableEnvironment["callerPropName"]],
            ["FUNC_RESULT_STORER", defaultVariableEnvironment["funcResultStorerPropName"]],
            ["FUNC_RESULT_STORER_VALUE", defaultVariableEnvironment["objectSubpropName"]],
            ["ERROR_OBJECT", defaultVariableEnvironment["errorObjectPropName"]],
            ["ERROR_OBJECT_VALUE", defaultVariableEnvironment["objectSubpropName"]],
        ]);

        const callerArguments = [
            "state",
            defaultVariableEnvironment["literalLoaderAliasFunctionName"],
            defaultVariableEnvironment["pushFunctionName"],
            defaultVariableEnvironment["stateIndex1GetterFunctionName"],
            "oneLocUseVariables",
            "commonFunctions",
        ];

        const handlers = generateASTInstructionHandlers(
            instructionAccesibleVariableNames,
            [
                t.identifier(stateArgument),
                t.identifier(popArgument),
                t.identifier(pushArgument),
                t.identifier(stateArrayGetterArgument),
                t.identifier(oneLocUseArgument),
                t.identifier(commonFunctionsArgument),
            ] satisfies Array<t.Identifier>,
        );

        programNodes.push(
            t.variableDeclaration(
                "var",
                [
                    t.variableDeclarator(
                        t.identifier(defaultVariableEnvironment["instructionSetName"]),
                        t.arrayExpression(handlers),
                    )
                ],
            ),
        );

        programNodes.push(
            ...new Template(`
            function {popFunctionName}(state) {
                return state.{stateArrPropName}[{decodedBytecodeName}[state.{stateArrPropName}[0]++] >> 5];
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
            {dispatcherFunctionName}({vmStateObjectName})
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
}