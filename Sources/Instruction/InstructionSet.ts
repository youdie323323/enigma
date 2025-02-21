
import {
    OperatorCode,
    ARGUMENTS_REG,
    ARGUMENTS_SPREAD_REG,
    FUNCTION_RESULT_REG,
    type NumOpCodes
} from "../Compiler/CompilerOperatorCode";
import Template from "../Interpreter/Builder/Templates/Template";
import Instruction from "./";
import * as t from '@babel/types';
import { InstructionAccesibleVariableEnvironment } from "./InstructionAccesibleVariableEnvironment";

/**
 * Define instruction for each opcodes.
 */
export const instructionSet = [
    {
        opcode: OperatorCode.Void,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, void 0);
            `)
        },
    },
    {
        opcode: OperatorCode.EmptyObject,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, {});
            `)
        },
    },
    {
        opcode: OperatorCode.EmptyArray,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, []);
            `)
        },
    },
    {
        opcode: OperatorCode.NewArray,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, new Array(${popArgument}(${stateArgument})));
            `)
        },
    },
    {
        opcode: OperatorCode.SetReg,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.NewRegExp,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, new RegExp(${popArgument}(${stateArgument}), ${popArgument}(${stateArgument})));
            `)
        },
    },
    {
        opcode: OperatorCode.SetVoid,
        requiredArgs: 4,
        templateFn: function ({
            stateArgument,
            popArgument,
            stateIndex1GetterArgument,
            
            memoryProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${stateIndex1GetterArgument}(${stateArgument}).${memoryProp}[${popArgument}(${stateArgument})] = void 0
            `)
        },
    },
    {
        opcode: OperatorCode.SetValue,
        requiredArgs: 4,
        templateFn: function ({
            stateArgument,
            popArgument,
            stateIndex1GetterArgument,
            
            memoryProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${stateIndex1GetterArgument}(${stateArgument}).${memoryProp}[${popArgument}(${stateArgument})] = ${popArgument}(${stateArgument})
            `)
        },
    },
    {
        opcode: OperatorCode.Load,
        requiredArgs: 4,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
            stateIndex1GetterArgument,
            
            memoryProp,
            parentMemoryStorerProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            for (var $varName = ${popArgument}(${stateArgument}), $currentState = ${stateIndex1GetterArgument}(${stateArgument}); $currentState; $currentState = $currentState.${parentMemoryStorerProp}) 
              if ($varName in $currentState.${memoryProp}) {
                ${pushArgument}(${stateArgument}, $currentState.${memoryProp}[$varName])
                return;
              } 
            throw 'ball';
            `)
        },
    },
    {
        opcode: OperatorCode.Out,
        requiredArgs: 4,
        templateFn: function ({
            stateArgument,
            popArgument,
            stateIndex1GetterArgument,
            
            memoryProp,
            parentMemoryStorerProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            for (var $varName = ${popArgument}(${stateArgument}), $value = ${popArgument}(${stateArgument}), $currentState = ${stateIndex1GetterArgument}(${stateArgument}); $currentState; $currentState = $currentState.${parentMemoryStorerProp}) 
              if ($varName in $currentState.${memoryProp}) {
                $currentState.${memoryProp}[$varName] = $value
                return;
              } 
            throw 'ball';
            `)
        },
    },
    {
        opcode: OperatorCode.InheritCaller,
        requiredArgs: 4,
        templateFn: function ({
            stateArgument,
            popArgument,
            stateIndex1GetterArgument,
            
            memoryProp,
            callerProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $id = ${popArgument}(${stateArgument}),
              $currentState = ${stateIndex1GetterArgument}(${stateArgument}),
              $callerFunc = ${stateArgument}.${callerProp};
            $currentState.${memoryProp}[$id] = $callerFunc;
            `);
        },
    },
    {
        opcode: OperatorCode.Jump,
        requiredArgs: 2,
        templateFn: function ({
            stateArgument,
            popArgument,
            
            stateArrProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${stateArgument}.${stateArrProp}[0] = ${popArgument}(${stateArgument})
            `)
        },
    },
    {
        opcode: OperatorCode.JumpIfTrue,
        requiredArgs: 2,
        templateFn: function ({
            stateArgument,
            popArgument,
            
            stateArrProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $address = ${popArgument}(${stateArgument});
            ${popArgument}(${stateArgument}) ? ${stateArgument}.${stateArrProp}[0] = $address : $address
            `)
        },
    },
    {
        opcode: OperatorCode.JumpIfFalse,
        requiredArgs: 2,
        templateFn: function ({
            stateArgument,
            popArgument,
            
            stateArrProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $address = ${popArgument}(${stateArgument});
            ${popArgument}(${stateArgument}) ? $address : ${stateArgument}.${stateArrProp}[0] = $address
            `)
        },
    },
    {
        opcode: OperatorCode.Func,
        requiredArgs: 7,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
            stateRelatedFunctionsArgument,
            stateIndex1GetterArgument,

            stateArrProp,
            randomFuncPropAddr,
            randomFuncPropFunc,
            parentMemoryStorerProp,
            memoryProp,
            callerProp,
            currentThisProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $address = ${popArgument}(${stateArgument}), 
                $length = ${popArgument}(${stateArgument}),
                $funcName = ${popArgument}(${stateArgument}),
                $parentState = ${stateIndex1GetterArgument}(${stateArgument}),
                $stateFunction = ${stateRelatedFunctionsArgument}[2],
                $dispatchHandler = ${stateRelatedFunctionsArgument}[3],
                $randomProp = ${stateRelatedFunctionsArgument}[4],
                $targetFunc = function() {
                  var $funcState = $stateFunction();
                  $funcState.${stateArrProp}[${ARGUMENTS_REG}] = arguments;
                  for (var $idx = 0; $idx < arguments.length; $idx++) $funcState.${stateArrProp}[$idx + ${ARGUMENTS_SPREAD_REG}] = arguments[$idx];
                  return $funcState.${stateArrProp}[1] = {
                      ${currentThisProp}: this,
                      ${stateArrProp}: [0],
                      ${memoryProp}: [],
                      ${parentMemoryStorerProp}: $parentState,
                      ${callerProp}: $targetFunc,
                  }, $funcState.${stateArrProp}[0] = $address, $dispatchHandler($funcState), $funcState.${stateArrProp}[${FUNCTION_RESULT_REG}]
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
              ${randomFuncPropAddr}: $address,
              ${parentMemoryStorerProp}: $parentState,
              ${randomFuncPropFunc}: $targetFunc
            }, ${pushArgument}(${stateArgument}, $targetFunc)
            `)
        },
    },
    {
        opcode: OperatorCode.Call,
        requiredArgs: 7,
        templateFn: function ({
            stateArgument,
            popArgument,
            stateRelatedFunctionsArgument,

            stateArrProp,
            randomFuncPropAddr,
            randomFuncPropFunc,
            parentMemoryStorerProp,
            memoryProp,
            callerProp,
            currentThisProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $callArgs = ${popArgument}(${stateArgument}),
              $targetFunc = ${popArgument}(${stateArgument}),
              $thisContext = ${popArgument}(${stateArgument}),
              $randomFuncProp = ${stateRelatedFunctionsArgument}[4];
            if ($targetFunc[$randomFuncProp] && $targetFunc[$randomFuncProp].${randomFuncPropFunc} === $targetFunc) {
              ${stateArgument}.${stateArrProp} = [$targetFunc[$randomFuncProp].${randomFuncPropAddr}, {
                ${currentThisProp}: $thisContext,
                ${callerProp}: $targetFunc,
                ${stateArrProp}: ${stateArgument}.${stateArrProp},
                ${memoryProp}: [],
                ${parentMemoryStorerProp}: $targetFunc[$randomFuncProp].${parentMemoryStorerProp},
              }, void 0, function() {
                return arguments
              }.apply(void 0, $callArgs)];
              for (var $argIndex = 0; $argIndex < $callArgs.length; $argIndex++) ${stateArgument}.${stateArrProp}.push($callArgs[$argIndex]);
            } else ${stateArgument}.${stateArrProp}[${FUNCTION_RESULT_REG}] = $targetFunc.apply($thisContext, $callArgs)
            `)
        },
    },
    {
        opcode: OperatorCode.New,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $targetFunc = ${popArgument}(${stateArgument}),
              $argArray = ${popArgument}(${stateArgument}).slice();
            $argArray.unshift(void 0), ${pushArgument}(${stateArgument}, new (Function.bind.apply($targetFunc, $argArray)));
            `)
        },
    },
    {
        opcode: OperatorCode.Term,
        requiredArgs: 0,
        templateFn: function (_: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`return null`)
        },
    },
    {
        opcode: OperatorCode.Get,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument})[${popArgument}(${stateArgument})]);
            `)
        },
    },
    {
        opcode: OperatorCode.Put,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${popArgument}(${stateArgument})[${popArgument}(${stateArgument})] = ${popArgument}(${stateArgument})
            `)
        },
    },
    {
        opcode: OperatorCode.In,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument}) in ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.Delete,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $targetObj = ${popArgument}(${stateArgument}),
                $propertyKey = ${popArgument}(${stateArgument});
            ${pushArgument}(${stateArgument}, delete $targetObj[$propertyKey]);
            `)
        },
    },
    {
        opcode: OperatorCode.Eq,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument}) == ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.Neq,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument}) != ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.Seq,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument}) === ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.SNeq,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument}) !== ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.Lt,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument}) < ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.Lte,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument}) <= ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.Gt,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument}) > ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.Gte,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument}) >= ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.Add,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument}) + ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.Sub,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument}) - ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.Mul,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument}) * ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.Div,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument}) / ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.Mod,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument}) % ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.BNot,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ~${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.BOr,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument}) | ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.BXor,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument}) ^ ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.BAnd,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument}) & ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.LShift,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument}) << ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.RShift,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument}) >> ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.UrShift,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument}) >>> ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.Not,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, !${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.InstanceOf,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${popArgument}(${stateArgument}) instanceof ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.TypeOf,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, typeof ${popArgument}(${stateArgument}));
            `)
        },
    },
    {
        opcode: OperatorCode.GetWindowProp,
        requiredArgs: 6,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
            bigObjectLikeInstancesArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $global = ${bigObjectLikeInstancesArgument}[0];
            ${pushArgument}(${stateArgument}, $global[${popArgument}(${stateArgument})]);
            `)
        },
    },
    {
        opcode: OperatorCode.SetCatchAddr,
        requiredArgs: 2,
        templateFn: function ({
            stateArgument,
            popArgument,

            catchAddrProp,
            stateArrProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $address = ${popArgument}(${stateArgument});
            ${stateArgument}.${stateArrProp}[1].${catchAddrProp} = $address;
            `)
        },
    },
    {
        opcode: OperatorCode.SetFinallyAddr,
        requiredArgs: 2,
        templateFn: function ({
            stateArgument,
            popArgument,

            finallyAddressProp,
            stateArrProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $address = ${popArgument}(${stateArgument});
            ${stateArgument}.${stateArrProp}[1].${finallyAddressProp} = $address;
            `)
        },
    },
    {
        opcode: OperatorCode.ThrowErrorOrDoFinally,
        requiredArgs: 7,
        templateFn: function ({
            stateArgument,
            stateIndex1GetterArgument,

            errorObjectProp,
            funcResultStorerProp,
            anyObjectPropSubprop,
            stateRelatedFunctionsArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $bytecodeReturn = ${stateRelatedFunctionsArgument}[0]
              , $exceptionHandler = ${stateRelatedFunctionsArgument}[1];
            if (${stateArgument}.${errorObjectProp}) $exceptionHandler(${stateArgument}, ${stateArgument}.${errorObjectProp}.${anyObjectPropSubprop}); else {
              var $state = ${stateIndex1GetterArgument}(${stateArgument});
              return $state != null && $state.${funcResultStorerProp} && $bytecodeReturn(${stateArgument}, $state.${funcResultStorerProp}.${anyObjectPropSubprop})
            }
            `)
        },
    },
    {
        opcode: OperatorCode.ThrowError,
        requiredArgs: 7,
        templateFn: function ({
            stateArgument,
            popArgument,

            stateRelatedFunctionsArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $exceptionHandler = ${stateRelatedFunctionsArgument}[1]
              , $error = ${popArgument}(${stateArgument});
            $exceptionHandler(${stateArgument}, $error)
            `)
        },
    },
    {
        opcode: OperatorCode.PushError,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            pushArgument,

            errorObjectProp,
            anyObjectPropSubprop,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${stateArgument}.${errorObjectProp} && ${stateArgument}.${errorObjectProp}.${anyObjectPropSubprop});
            `)
        },
    },
    {
        opcode: OperatorCode.VoidError,
        requiredArgs: 1,
        templateFn: function ({
            stateArgument,

            errorObjectProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${stateArgument}.${errorObjectProp} = void 0;
            `)
        },
    },
    {
        opcode: OperatorCode.GetCurrentThis,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            pushArgument,

            stateArrProp,
            currentThisProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArgument}(${stateArgument}, ${stateArgument}.${stateArrProp}[1].${currentThisProp});
            `)
        },
    },
    {
        opcode: OperatorCode.ReturnValue,
        requiredArgs: 7,
        templateFn: function ({
            stateArgument,
            popArgument,
            stateRelatedFunctionsArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $bytecodeReturn = ${stateRelatedFunctionsArgument}[0],
                $value = ${popArgument}(${stateArgument});
            return $bytecodeReturn(${stateArgument}, $value);
            `)
        },
    },
    {
        opcode: OperatorCode.ReturnVoid,
        requiredArgs: 7,
        templateFn: function ({
            stateArgument,
            stateRelatedFunctionsArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $bytecodeReturn = ${stateRelatedFunctionsArgument}[0];
            return $bytecodeReturn(${stateArgument}, void 0);
            `)
        },
    },
    {
        opcode: OperatorCode.ForIn,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $object = ${popArgument}(${stateArgument})
              , $items = [];
            for (var item in $object) $items.push(item);
            ${pushArgument}(${stateArgument}, $items);
            `)
        },
    },
    {
        opcode: OperatorCode.Promise,
        requiredArgs: 6,
        templateFn: function ({
            stateArgument,
            pushArgument,
            bigObjectLikeInstancesArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $asyncCommon = ${bigObjectLikeInstancesArgument}[1];
            ${pushArgument}(${stateArgument}, $asyncCommon[0]);
            `)
        },
    },
    {
        opcode: OperatorCode.Regenerator,
        requiredArgs: 6,
        templateFn: function ({
            stateArgument,
            pushArgument,
            bigObjectLikeInstancesArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $asyncCommon = ${bigObjectLikeInstancesArgument}[1];
            ${pushArgument}(${stateArgument}, $asyncCommon[1]);
            `)
        },
    },
    {
        opcode: OperatorCode.CallFunction0Arg,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $func = ${popArgument}(${stateArgument});
            ${pushArgument}(${stateArgument}, $func());
            `)
        },
    },
    {
        opcode: OperatorCode.CallFunction1Arg,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $func = ${popArgument}(${stateArgument}),
                $arg1 = ${popArgument}(${stateArgument});
            ${pushArgument}(${stateArgument}, $func($arg1));
            `)
        },
    },
    {
        opcode: OperatorCode.CallFunction2Arg,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $func = ${popArgument}(${stateArgument}),
                $arg1 = ${popArgument}(${stateArgument}),
                $arg2 = ${popArgument}(${stateArgument});
            ${pushArgument}(${stateArgument}, $func($arg1, $arg2));
            `)
        },
    },
    {
        opcode: OperatorCode.CallFunction3Arg,
        requiredArgs: 3,
        templateFn: function ({
            stateArgument,
            popArgument,
            pushArgument,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $func = ${popArgument}(${stateArgument}),
                $arg1 = ${popArgument}(${stateArgument}),
                $arg2 = ${popArgument}(${stateArgument}),
                $arg3 = ${popArgument}(${stateArgument});
            ${pushArgument}(${stateArgument}, $func($arg1, $arg2, $arg3));
            `);
        },
    },
] as const satisfies (ReadonlyArray<Instruction> & { length: NumOpCodes });

export function getInstructionFromOpcode(opcode: OperatorCode): Instruction {
    return instructionSet.find(o => o.opcode === opcode);
}

export function compileASTInstructionHandlers(
    variableNames: InstructionAccesibleVariableEnvironment,
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