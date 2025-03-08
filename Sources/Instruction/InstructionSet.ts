
import {
    OperatorCode,
    ARGUMENTS_REG,
    ARGUMENTS_SPREAD_REG,
    FUNCTION_RESULT_REG,
    type NumOpCodes,
} from "../Compiler/CompilerOperatorCode";
import Template from "../Interpreter/Builder/Templates/Template";
import Instruction from "./";
import * as t from '@babel/types';
import type { InstructionAccesibleEnvironment } from "./InstructionAccesibleEnvironment";

/**
 * Define instruction for each opcodes.
 */
export const instructionSet = [
    {
        opcode: OperatorCode.Void,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, void 0);
            `);
        },
    },
    {
        opcode: OperatorCode.EmptyObject,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, {});
            `);
        },
    },
    {
        opcode: OperatorCode.EmptyArray,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, []);
            `);
        },
    },
    {
        opcode: OperatorCode.NewArray,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, new Array(${popArg}(${stateArg})));
            `);
        },
    },
    {
        opcode: OperatorCode.SetReg,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.NewRegExp,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, new RegExp(${popArg}(${stateArg}), ${popArg}(${stateArg})));
            `);
        },
    },
    {
        opcode: OperatorCode.SetVoid,
        requiredArgs: 4,
        templateFn: function ({
            stateArg,
            popArg,
            stateIndex1GetterArg,
            
            memoryPropKey,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${stateIndex1GetterArg}(${stateArg}).${memoryPropKey}[${popArg}(${stateArg})] = void 0
            `);
        },
    },
    {
        opcode: OperatorCode.SetValue,
        requiredArgs: 4,
        templateFn: function ({
            stateArg,
            popArg,
            stateIndex1GetterArg,
            
            memoryPropKey,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${stateIndex1GetterArg}(${stateArg}).${memoryPropKey}[${popArg}(${stateArg})] = ${popArg}(${stateArg})
            `);
        },
    },
    {
        opcode: OperatorCode.Load,
        requiredArgs: 4,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
            stateIndex1GetterArg,
            
            memoryPropKey,
            parentMemoryPropKey,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            for (var $varName = ${popArg}(${stateArg}), $currentState = ${stateIndex1GetterArg}(${stateArg}); $currentState; $currentState = $currentState.${parentMemoryPropKey}) 
              if ($varName in $currentState.${memoryPropKey}) {
                ${pushArg}(${stateArg}, $currentState.${memoryPropKey}[$varName])
                return;
              } 
            throw 'ball';
            `);
        },
    },
    {
        opcode: OperatorCode.Out,
        requiredArgs: 4,
        templateFn: function ({
            stateArg,
            popArg,
            stateIndex1GetterArg,
            
            memoryPropKey,
            parentMemoryPropKey,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            for (var $varName = ${popArg}(${stateArg}), $value = ${popArg}(${stateArg}), $currentState = ${stateIndex1GetterArg}(${stateArg}); $currentState; $currentState = $currentState.${parentMemoryPropKey}) 
              if ($varName in $currentState.${memoryPropKey}) {
                $currentState.${memoryPropKey}[$varName] = $value
                return;
              } 
            throw 'ball';
            `);
        },
    },
    {
        opcode: OperatorCode.InheritCaller,
        requiredArgs: 4,
        templateFn: function ({
            stateArg,
            popArg,
            stateIndex1GetterArg,
            
            memoryPropKey,
            callerPropKey,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            var $id = ${popArg}(${stateArg}),
              $currentState = ${stateIndex1GetterArg}(${stateArg}),
              $callerFunc = ${stateArg}.${callerPropKey};
            $currentState.${memoryPropKey}[$id] = $callerFunc;
            `);
        },
    },
    {
        opcode: OperatorCode.Jump,
        requiredArgs: 2,
        templateFn: function ({
            stateArg,
            popArg,
            
            stateArrayPropKey,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${stateArg}.${stateArrayPropKey}[0] = ${popArg}(${stateArg})
            `);
        },
    },
    {
        opcode: OperatorCode.JumpIfTrue,
        requiredArgs: 2,
        templateFn: function ({
            stateArg,
            popArg,
            
            stateArrayPropKey,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            var $address = ${popArg}(${stateArg});
            ${popArg}(${stateArg}) ? ${stateArg}.${stateArrayPropKey}[0] = $address : $address
            `);
        },
    },
    {
        opcode: OperatorCode.JumpIfFalse,
        requiredArgs: 2,
        templateFn: function ({
            stateArg,
            popArg,
            
            stateArrayPropKey,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            var $address = ${popArg}(${stateArg});
            ${popArg}(${stateArg}) ? $address : ${stateArg}.${stateArrayPropKey}[0] = $address
            `);
        },
    },
    {
        opcode: OperatorCode.Func,
        requiredArgs: 7,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
            stateRelatedFunctionsArg,
            stateIndex1GetterArg,

            stateArrayPropKey,
            randomFuncPropAddrPropKey,
            randomFuncPropFuncPropKey,
            parentMemoryPropKey,
            memoryPropKey,
            callerPropKey,
            currentThisPropKey,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            var $address = ${popArg}(${stateArg}), 
                $length = ${popArg}(${stateArg}),
                $funcName = ${popArg}(${stateArg}),
                $parentState = ${stateIndex1GetterArg}(${stateArg}),
                $stateFunction = ${stateRelatedFunctionsArg}[2],
                $dispatchHandler = ${stateRelatedFunctionsArg}[3],
                $randomProp = ${stateRelatedFunctionsArg}[4],
                $targetFunc = function() {
                  var $funcState = $stateFunction();
                  $funcState.${stateArrayPropKey}[${ARGUMENTS_REG}] = arguments;
                  for (var $idx = 0; $idx < arguments.length; $idx++) $funcState.${stateArrayPropKey}[$idx + ${ARGUMENTS_SPREAD_REG}] = arguments[$idx];
                  return $funcState.${stateArrayPropKey}[1] = {
                      ${currentThisPropKey}: this,
                      ${stateArrayPropKey}: [0],
                      ${memoryPropKey}: [],
                      ${parentMemoryPropKey}: $parentState,
                      ${callerPropKey}: $targetFunc,
                  }, $funcState.${stateArrayPropKey}[0] = $address, $dispatchHandler($funcState), $funcState.${stateArrayPropKey}[${FUNCTION_RESULT_REG}]
                };
            
            try {
              Object.defineProperty($targetFunc, "length", {
                value: $length
              }), Object.defineProperty($targetFunc, "name", {
                value: $funcName
              })
            } catch ($err) {
              for (var $hasArg = !1, $args = "", $i = 0; $i < $length; $i++) $hasArg ? $args += ",a".concat($i) : ($args += "a".concat($i), $hasArg = !0);
              $targetFunc = new Function("fn", "return function ".concat($funcName, "(").concat($args, "){return fn.apply(this, arguments)}"))($targetFunc)
            }
              
            $targetFunc[$randomProp] = {
              ${randomFuncPropAddrPropKey}: $address,
              ${parentMemoryPropKey}: $parentState,
              ${randomFuncPropFuncPropKey}: $targetFunc
            }, ${pushArg}(${stateArg}, $targetFunc)
            `);
        },
    },
    {
        opcode: OperatorCode.Call,
        requiredArgs: 7,
        templateFn: function ({
            stateArg,
            popArg,
            stateRelatedFunctionsArg,

            stateArrayPropKey,
            randomFuncPropAddrPropKey,
            randomFuncPropFuncPropKey,
            parentMemoryPropKey,
            memoryPropKey,
            callerPropKey,
            currentThisPropKey,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            var $callArgs = ${popArg}(${stateArg}),
              $targetFunc = ${popArg}(${stateArg}),
              $thisContext = ${popArg}(${stateArg}),
              $randomFuncProp = ${stateRelatedFunctionsArg}[4];
            if ($targetFunc[$randomFuncProp] && $targetFunc[$randomFuncProp].${randomFuncPropFuncPropKey} === $targetFunc) {
              ${stateArg}.${stateArrayPropKey} = [$targetFunc[$randomFuncProp].${randomFuncPropAddrPropKey}, {
                ${currentThisPropKey}: $thisContext,
                ${callerPropKey}: $targetFunc,
                ${stateArrayPropKey}: ${stateArg}.${stateArrayPropKey},
                ${memoryPropKey}: [],
                ${parentMemoryPropKey}: $targetFunc[$randomFuncProp].${parentMemoryPropKey},
              }, void 0, function() {
                return arguments
              }.apply(void 0, $callArgs)];
              for (var $argIndex = 0; $argIndex < $callArgs.length; $argIndex++) ${stateArg}.${stateArrayPropKey}.push($callArgs[$argIndex]);
            } else ${stateArg}.${stateArrayPropKey}[${FUNCTION_RESULT_REG}] = $targetFunc.apply($thisContext, $callArgs)
            `);
        },
    },
    {
        opcode: OperatorCode.New,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            var $targetFunc = ${popArg}(${stateArg}),
              $argArray = ${popArg}(${stateArg}).slice();
            $argArray.unshift(void 0), ${pushArg}(${stateArg}, new (Function.bind.apply($targetFunc, $argArray)));
            `);
        },
    },
    {
        opcode: OperatorCode.Term,
        requiredArgs: 0,
        templateFn: function (_: InstructionAccesibleEnvironment): Template {
            return new Template(`return null`);
        },
    },
    {
        opcode: OperatorCode.Get,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg})[${popArg}(${stateArg})]);
            `);
        },
    },
    {
        opcode: OperatorCode.Put,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${popArg}(${stateArg})[${popArg}(${stateArg})] = ${popArg}(${stateArg})
            `);
        },
    },
    {
        opcode: OperatorCode.In,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) in ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.Delete,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            var $targetObj = ${popArg}(${stateArg}),
                $propertyKey = ${popArg}(${stateArg});
            ${pushArg}(${stateArg}, delete $targetObj[$propertyKey]);
            `);
        },
    },
    {
        opcode: OperatorCode.Eq,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) == ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.Neq,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) != ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.Seq,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) === ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.SNeq,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) !== ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.Lt,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) < ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.Lte,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) <= ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.Gt,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) > ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.Gte,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) >= ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.Add,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) + ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.Sub,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) - ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.Mul,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) * ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.Div,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) / ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.Mod,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) % ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.BNot,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ~${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.BOr,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) | ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.BXor,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) ^ ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.BAnd,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) & ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.LShift,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) << ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.RShift,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) >> ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.UrShift,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) >>> ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.Not,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, !${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.InstanceOf,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) instanceof ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.TypeOf,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, typeof ${popArg}(${stateArg}));
            `);
        },
    },
    {
        opcode: OperatorCode.GetWindowProp,
        requiredArgs: 6,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
            bigObjectLikeInstancesArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            var $global = ${bigObjectLikeInstancesArg}[0];
            ${pushArg}(${stateArg}, $global[${popArg}(${stateArg})]);
            `);
        },
    },
    {
        opcode: OperatorCode.SetCatchAddr,
        requiredArgs: 2,
        templateFn: function ({
            stateArg,
            popArg,

            catchAddressPropKey,
            stateArrayPropKey,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            var $address = ${popArg}(${stateArg});
            ${stateArg}.${stateArrayPropKey}[1].${catchAddressPropKey} = $address;
            `);
        },
    },
    {
        opcode: OperatorCode.SetFinallyAddr,
        requiredArgs: 2,
        templateFn: function ({
            stateArg,
            popArg,

            finallyAddressPropKey,
            stateArrayPropKey,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            var $address = ${popArg}(${stateArg});
            ${stateArg}.${stateArrayPropKey}[1].${finallyAddressPropKey} = $address;
            `);
        },
    },
    {
        opcode: OperatorCode.ThrowErrorOrDoFinally,
        requiredArgs: 7,
        templateFn: function ({
            stateArg,
            stateIndex1GetterArg,

            errorObjectPropKey,
            funcResultObjectPropKey,
            anyObjectPropSubPropKey,
            stateRelatedFunctionsArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            var $bytecodeReturn = ${stateRelatedFunctionsArg}[0]
              , $exceptionHandler = ${stateRelatedFunctionsArg}[1];
            if (${stateArg}.${errorObjectPropKey}) $exceptionHandler(${stateArg}, ${stateArg}.${errorObjectPropKey}.${anyObjectPropSubPropKey}); else {
              var $state = ${stateIndex1GetterArg}(${stateArg});
              return $state != null && $state.${funcResultObjectPropKey} && $bytecodeReturn(${stateArg}, $state.${funcResultObjectPropKey}.${anyObjectPropSubPropKey})
            }
            `);
        },
    },
    {
        opcode: OperatorCode.ThrowError,
        requiredArgs: 7,
        templateFn: function ({
            stateArg,
            popArg,

            stateRelatedFunctionsArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            var $exceptionHandler = ${stateRelatedFunctionsArg}[1]
              , $error = ${popArg}(${stateArg});
            $exceptionHandler(${stateArg}, $error)
            `);
        },
    },
    {
        opcode: OperatorCode.PushError,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            pushArg,

            errorObjectPropKey,
            anyObjectPropSubPropKey,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${stateArg}.${errorObjectPropKey} && ${stateArg}.${errorObjectPropKey}.${anyObjectPropSubPropKey});
            `);
        },
    },
    {
        opcode: OperatorCode.VoidError,
        requiredArgs: 1,
        templateFn: function ({
            stateArg,

            errorObjectPropKey,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${stateArg}.${errorObjectPropKey} = void 0;
            `);
        },
    },
    {
        opcode: OperatorCode.GetCurrentThis,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            pushArg,

            stateArrayPropKey,
            currentThisPropKey,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${stateArg}.${stateArrayPropKey}[1].${currentThisPropKey});
            `);
        },
    },
    {
        opcode: OperatorCode.ReturnValue,
        requiredArgs: 7,
        templateFn: function ({
            stateArg,
            popArg,
            stateRelatedFunctionsArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            var $bytecodeReturn = ${stateRelatedFunctionsArg}[0],
                $value = ${popArg}(${stateArg});
            return $bytecodeReturn(${stateArg}, $value);
            `);
        },
    },
    {
        opcode: OperatorCode.ReturnVoid,
        requiredArgs: 7,
        templateFn: function ({
            stateArg,
            stateRelatedFunctionsArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            var $bytecodeReturn = ${stateRelatedFunctionsArg}[0];
            return $bytecodeReturn(${stateArg}, void 0);
            `);
        },
    },
    {
        opcode: OperatorCode.ForIn,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            var $object = ${popArg}(${stateArg})
              , $items = [];
            for (var item in $object) $items.push(item);
            ${pushArg}(${stateArg}, $items);
            `);
        },
    },
    {
        opcode: OperatorCode.Promise,
        requiredArgs: 6,
        templateFn: function ({
            stateArg,
            pushArg,
            bigObjectLikeInstancesArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            var $asyncCommon = ${bigObjectLikeInstancesArg}[1];
            ${pushArg}(${stateArg}, $asyncCommon[0]);
            `);
        },
    },
    {
        opcode: OperatorCode.RegeneratorRuntime,
        requiredArgs: 6,
        templateFn: function ({
            stateArg,
            pushArg,
            bigObjectLikeInstancesArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            var $asyncCommon = ${bigObjectLikeInstancesArg}[1];
            ${pushArg}(${stateArg}, $asyncCommon[1]);
            `);
        },
    },
    {
        opcode: OperatorCode.CallFunction0Arg,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            var $func = ${popArg}(${stateArg});
            ${pushArg}(${stateArg}, $func());
            `);
        },
    },
    {
        opcode: OperatorCode.CallFunction1Arg,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            var $func = ${popArg}(${stateArg}),
                $arg1 = ${popArg}(${stateArg});
            ${pushArg}(${stateArg}, $func($arg1));
            `);
        },
    },
    {
        opcode: OperatorCode.CallFunction2Arg,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            var $func = ${popArg}(${stateArg}),
                $arg1 = ${popArg}(${stateArg}),
                $arg2 = ${popArg}(${stateArg});
            ${pushArg}(${stateArg}, $func($arg1, $arg2));
            `);
        },
    },
    {
        opcode: OperatorCode.CallFunction3Arg,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleEnvironment): Template {
            return new Template(`
            var $func = ${popArg}(${stateArg}),
                $arg1 = ${popArg}(${stateArg}),
                $arg2 = ${popArg}(${stateArg}),
                $arg3 = ${popArg}(${stateArg});
            ${pushArg}(${stateArg}, $func($arg1, $arg2, $arg3));
            `);
        },
    },
] as const satisfies (ReadonlyArray<Instruction> & { length: NumOpCodes });

export function getInstructionFromOpcode(opcode: OperatorCode): Instruction {
    return instructionSet.find(o => o.opcode === opcode);
}

export function compileASTInstructionHandlers(
    variableNames: InstructionAccesibleEnvironment,
    instructionHandlerArguments: Array<t.Identifier>,
): Array<t.FunctionExpression> {
    const opcodeNames = Object.keys(OperatorCode).filter((v) => isNaN(Number(v)));

    const handlers = new Array<t.FunctionExpression>();

    opcodeNames.forEach((e, i) => {
        const inst = getInstructionFromOpcode(OperatorCode[e]);
        if (inst) {
            handlers[OperatorCode[e]] = t.functionExpression(
                null,
                instructionHandlerArguments.slice(0, inst.requiredArgs),
                t.blockStatement(inst.templateFn(variableNames).compile()),
            );
        }
    });

    return handlers;
}