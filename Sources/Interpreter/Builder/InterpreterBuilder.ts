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
import { FUNCTION_RESULT_REG } from "../../Compiler/CompilerOperatorCode";
import { ArrayVariableEnvironment, FunctionVariableEnvironment, InterpreterDefaultEnvironment, NumberVariableEnvironment, ObjectVariableEnvironment, PropertyKeyEnvironment, StringVariableEnvironment } from "./InterpreterDefaultEnvironment";
import { InstructionAccesibleEnvironment, InstructionArgumentEnvironment } from "../../Instruction/InstructionAccesibleEnvironment";
import { LiteralId } from "../../Compiler/CompilerLiteralId";

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

        const generateIdentifier = this.variableGenerator.generateIdentifier.bind(this.variableGenerator);

        const defaultEnvironment = {
            ...{
                stringSlicerPropKey: generateIdentifier(),
                finallyAddressPropKey: generateIdentifier(),
                currentThisPropKey: generateIdentifier(),
                stateArrayPropKey: generateIdentifier(),
                errorObjectPropKey: generateIdentifier(),
                anyObjectPropSubPropKey: generateIdentifier(),
                parentMemoryPropKey: generateIdentifier(),
                funcResultObjectPropKey: generateIdentifier(),
                stringDumpPropKey: generateIdentifier(),
                catchAddressPropKey: generateIdentifier(),
                memoryPropKey: generateIdentifier(),
                callerPropKey: generateIdentifier(),

                randomFuncPropKey: generateIdentifier(),
                randomFuncPropAddrPropKey: generateIdentifier(),
                randomFuncPropFuncPropKey: generateIdentifier(),
            } satisfies PropertyKeyEnvironment,

            ...{
                literalIdsArray: generateIdentifier(),
                decodedBytecodeArray: generateIdentifier(),
                instructionSetArray: generateIdentifier(),
            } satisfies ArrayVariableEnvironment,

            ...{
                bytecodeString: generateIdentifier(),
                literallyLengthString: generateIdentifier(),
            } satisfies StringVariableEnvironment,

            ...{
                decodedBytecodeLengthNumber: generateIdentifier(),
                decodedBytecodeLengthAndTrueLengthNumber: generateIdentifier(),
            } satisfies NumberVariableEnvironment,

            ...{
                decoderFunction: generateIdentifier(),
                vmStateFunction: generateIdentifier(),
                popFunction: generateIdentifier(),
                pushFunction: generateIdentifier(),
                dispatcherFunction: generateIdentifier(),
                literalLoaderAliasFunction: generateIdentifier(),
                literalLoaderFunction: generateIdentifier(),
                exceptionHandlerFunction: generateIdentifier(),
                stateIndex1GetterFunction: generateIdentifier(),
                bytecodeReturnFunction: generateIdentifier(),
                loadRegisterFunction: generateIdentifier(),
            } satisfies FunctionVariableEnvironment,

            ...{
                stringObject: generateIdentifier(),
                vmStateObject: generateIdentifier(),
                globalObject: generateIdentifier(),
                promiseObject: generateIdentifier(),
                regeneratorRuntimeObject: generateIdentifier(),
            } satisfies ObjectVariableEnvironment,
        } as const satisfies InterpreterDefaultEnvironment;

        const randomizedLiteralIds: Array<LiteralId> = shuffle([
            LiteralId.Null,
            LiteralId.StoreOrLoadStr,
            LiteralId.Num,
            LiteralId.True,
            LiteralId.False,
            LiteralId.FakePlaceholder,
        ]);

        const randomizedLiteralBranches = shuffle([
            `if (result !== literalIds[${randomizedLiteralIds.indexOf(LiteralId.FakePlaceholder)}]) {`,
            `
                if (result === literalIds[${randomizedLiteralIds.indexOf(LiteralId.Num)}]) {
                    var high = bytecode[vmState[0]++],
                        low = bytecode[vmState[0]++],
                        sign = high & 2147483648 ? -1 : 1,
                        exponent = (high & 2146435072) >> 20,
                        mantissa = (high & 1048575) * Math.pow(2, 32) + (low < 0 ? low + Math.pow(2, 32) : low);
                    return exponent === 2047 ? mantissa ? NaN : sign * (1 / 0) : (exponent !== 0 ? mantissa += Math.pow(2, 52) : exponent++, sign * mantissa * Math.pow(2, exponent - 1075));
                }
            `,
            `   if (result === literalIds[${randomizedLiteralIds.indexOf(LiteralId.Null)}]) return null;`,
            `
                if (result === literalIds[${randomizedLiteralIds.indexOf(LiteralId.StoreOrLoadStr)}]) {
                    if (stringObject != null && stringObject.{stringSlicerPropKey}) return stringObject.{stringSlicerPropKey}(bytecode[vmState[0]++], bytecode[vmState[0]++]);
                    for (var str = '', length = bytecode[vmState[0]++], index = 0; index < length; index++) {
                        var charCode = bytecode[vmState[0]++];
                        str += String.fromCharCode(charCode & 0xFFFFFFC0 | charCode * 39 & 0x3F);
                    }
                    return str;
                }
            `,
            `   if (result === literalIds[${randomizedLiteralIds.indexOf(LiteralId.True)}]) return !0;`,
            `   if (result === literalIds[${randomizedLiteralIds.indexOf(LiteralId.False)}]) return !1;`,
        ]).concat(
            "   return vmState[result >> 5]",
            "}"
        );

        const encodingTable = BytecodeTranscoderProvider.table,
            encodingRadix = BytecodeTranscoderProvider.radix;

        programNodes.push(
            ...BytecodeTranscoderProvider.decoder.compile(defaultEnvironment),
            ...new Template(`
            var {bytecodeString} = "{encoded}",
                {literallyLengthString} = "length",
                {decodedBytecodeArray} = {decoderFunction}({bytecodeString}, "{table}", {radix}),
                {decodedBytecodeLengthNumber} = {decodedBytecodeArray}[{literallyLengthString}];
            `).compile(
                {
                    ...defaultEnvironment,

                    encoded: BytecodeTranscoderProvider.encode(bytecode, encodingTable, encodingRadix),
                    table: encodingTable,
                    radix: encodingRadix,
                }
            ),
            ...new Template(`
            function {stateIndex1GetterFunction}(state) {
                return state.{stateArrayPropKey}[1]
            }
            `).compile(defaultEnvironment),
            ...new Template(`
            for (var {randomFuncPropKey} = "", {decodedBytecodeLengthAndTrueLengthNumber} = {decodedBytecodeLengthNumber} + ({randomFuncPropKey} + !0)[{literallyLengthString}], {stringObject} = {
                {stringDumpPropKey}: ""
            }, {temp} = 0; {temp} < 28; {temp}++) {randomFuncPropKey} += String.fromCharCode(97 + Math.floor(26 * Math.random()));
            `).compile({
                ...defaultEnvironment,

                temp: generateIdentifier(),
            }),
        );

        programNodes.push(
            ...new Template(`
            var {globalObject} = window,
                {promiseObject} = {globalObject}.Promise;
            `).compile(defaultEnvironment),
        );

        programNodes.push(
            ...new Template(`
            function {loadRegisterFunction}(state) {
                return {decodedBytecodeArray}[state.{stateArrayPropKey}[0]++] >> 5
            }
            
            function {vmStateFunction}() {
                // One for instruction pointer
                var mainState = [1, {
                    {currentThisPropKey}: {globalObject},
                    {callerPropKey}: null,
                    {memoryPropKey}: [],
                    {stateArrayPropKey}: [0],
                    {parentMemoryPropKey}: void 0,
                }, void 0];
                return {
                    {stateArrayPropKey}: mainState,
                    {errorObjectPropKey}: void 0,
                }
            }
            
            function {exceptionHandlerFunction}(state, err) {
                for (; ;) {
                    var nextState = state.{stateArrayPropKey}[1];

                    // Throw err if context is nullish (theres no valid try-catch)
                    if (!nextState) throw err;

                    // Found try-catch, set error then jump to catch address
                    if (nextState.{catchAddressPropKey}) {
                        state.{errorObjectPropKey} = {
                          {anyObjectPropSubPropKey}: err,
                        }, state.{stateArrayPropKey}[0] = nextState.{catchAddressPropKey};
                        return;
                    }
                    
                    // Traverse state and find try-catch
                    state.{stateArrayPropKey} = nextState.{stateArrayPropKey};
                }
            }
            
            // Global vm state, which represents "Program"
            var {vmStateObject} = {vmStateFunction}();

            function {pushFunction}(state, elem) {
                state.{stateArrayPropKey}[{loadRegisterFunction}(state)] = elem
            }
            
            // Literal loader section
            var {literalLoaderFunction} = function (bytecode, vmState, literalIds, stringObject) {
                    var result = bytecode[vmState[0]++];
                    if (result & 1) return result >> 1;
                    ${randomizedLiteralBranches.join("\n")}
                }, 
                {literalIdsArray} = ${JSON.stringify(randomizedLiteralIds)};

            // Load string section
            {
                {stringObject}.{stringSlicerPropKey} = function(start, length) {
                    return {stringObject}.{stringDumpPropKey}.slice(start, start + length)
                }
                var {temp} = {decodedBytecodeArray}[{decodedBytecodeLengthNumber} + {randomFuncPropKey}.indexOf(".")] ^ {decodedBytecodeLengthAndTrueLengthNumber},
                    {temp2} = {decodedBytecodeArray}.splice({temp}, {decodedBytecodeArray}[{temp} + {vmStateObject}.{stateArrayPropKey}[0]] + 2);
                {stringObject}.{stringDumpPropKey} = {literalLoaderFunction}({temp2}, {vmStateObject}.{stateArrayPropKey}[1].{stateArrayPropKey}, {literalIdsArray});
            }

            function {literalLoaderAliasFunction}(state) {
                return {literalLoaderFunction}({decodedBytecodeArray}, state.{stateArrayPropKey}, {literalIdsArray}, {stringObject})
            }

            function {bytecodeReturnFunction}(state, returnValue) {
                var $state = {stateIndex1GetterFunction}(state);
                return $state.{funcResultObjectPropKey} = {
                    {anyObjectPropSubPropKey}: returnValue,
                }, 
                    $state.{finallyAddressPropKey} ? state.{stateArrayPropKey}[0] = $state.{finallyAddressPropKey} : 
                        ($state.{stateArrayPropKey}.length == 1 ? (state.{stateArrayPropKey}[${FUNCTION_RESULT_REG}] = returnValue, null) : 
                            (state.{stateArrayPropKey} = $state.{stateArrayPropKey}, state.{stateArrayPropKey}[${FUNCTION_RESULT_REG}] = returnValue, void 0));
            }
            `).compile({
                ...defaultEnvironment,

                temp: generateIdentifier(),
                temp2: generateIdentifier(),
            })
        );

        const stateArg = generateIdentifier();
        const popArg = generateIdentifier();
        const pushArg = generateIdentifier();
        const stateIndex1GetterArg = generateIdentifier();
        const bigObjectLikeInstancesArg = generateIdentifier();
        const stateRelatedFunctionsArg = generateIdentifier();

        const callerArguments = [
            "state",                                       // stateArgument
            defaultEnvironment.literalLoaderAliasFunction, // popArgument
            defaultEnvironment.pushFunction,               // pushArgument
            defaultEnvironment.stateIndex1GetterFunction,  // stateIndex1GetterArgument
            "bigObjectLikeInstances",                      // bigObjectLikeInstancesArgument
            "stateRelatedFunctions",                       // stateRelatedFunctionsArgument
        ];

        const instructionAccesibleEnvironment = Object.assign(
            defaultEnvironment,
            {
                stateArg,
                popArg,
                pushArg,
                stateIndex1GetterArg,
                bigObjectLikeInstancesArg,
                stateRelatedFunctionsArg,
            } satisfies InstructionArgumentEnvironment,
        ) satisfies InstructionAccesibleEnvironment;

        const handlers = compileASTInstructionHandlers(
            instructionAccesibleEnvironment,
            [
                t.identifier(stateArg),
                t.identifier(popArg),
                t.identifier(pushArg),
                t.identifier(stateIndex1GetterArg),
                t.identifier(bigObjectLikeInstancesArg),
                t.identifier(stateRelatedFunctionsArg),
            ] satisfies Array<t.Identifier>,
        );

        programNodes.push(
            t.variableDeclaration(
                "var",
                [
                    t.variableDeclarator(
                        t.identifier(defaultEnvironment.instructionSetArray),
                        t.arrayExpression(handlers),
                    ),
                ],
            ),
        );

        programNodes.push(
            ...new Template(`
            function {popFunction}(state) {
                return state.{stateArrayPropKey}[{decodedBytecodeArray}[state.{stateArrayPropKey}[0]++] >> 5];
            }
            `).compile(defaultEnvironment),
        );

        // Dispatcher
        programNodes.push(
            ...regeneratorRuntimeTemplate.compile(defaultEnvironment),
            ...this.compileDispatcherAST({
                ...defaultEnvironment,

                callerArgumentsString: callerArguments.join(","),
            }),
            ...new Template(`
            // Run program
            {dispatcherFunction}({vmStateObject})
            `).compile(defaultEnvironment),
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
                        {promiseObject}, 
                        {regeneratorRuntimeObject}
                    ], 
                    {decodedBytecodeArray}
                ], 
                stateRelatedFunctions = [
                    {bytecodeReturnFunction}, 
                    {exceptionHandlerFunction}, 
                    {vmStateFunction}, 
                    {dispatcherFunction}, 
                    {randomFuncPropKey}, 
                    {popFunction}
                ] ; ;) {
                    var instructionHandler = {instructionSetArray}[{decodedBytecodeArray}[state.{stateArrayPropKey}[0]++]];
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