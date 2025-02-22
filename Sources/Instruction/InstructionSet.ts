
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
            stateArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, void 0);
            `)
        },
    },
    {
        opcode: OperatorCode.EmptyObject,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, {});
            `)
        },
    },
    {
        opcode: OperatorCode.EmptyArray,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, []);
            `)
        },
    },
    {
        opcode: OperatorCode.NewArray,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, new Array(${popArg}(${stateArg})));
            `)
        },
    },
    {
        opcode: OperatorCode.SetReg,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.NewRegExp,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, new RegExp(${popArg}(${stateArg}), ${popArg}(${stateArg})));
            `)
        },
    },
    {
        opcode: OperatorCode.SetVoid,
        requiredArgs: 4,
        templateFn: function ({
            stateArg,
            popArg,
            stateIndex1GetterArg,
            
            memoryProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${stateIndex1GetterArg}(${stateArg}).${memoryProp}[${popArg}(${stateArg})] = void 0
            `)
        },
    },
    {
        opcode: OperatorCode.SetValue,
        requiredArgs: 4,
        templateFn: function ({
            stateArg,
            popArg,
            stateIndex1GetterArg,
            
            memoryProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${stateIndex1GetterArg}(${stateArg}).${memoryProp}[${popArg}(${stateArg})] = ${popArg}(${stateArg})
            `)
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
            
            memoryProp,
            parentMemoryStorerProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            for (var $varName = ${popArg}(${stateArg}), $currentState = ${stateIndex1GetterArg}(${stateArg}); $currentState; $currentState = $currentState.${parentMemoryStorerProp}) 
              if ($varName in $currentState.${memoryProp}) {
                ${pushArg}(${stateArg}, $currentState.${memoryProp}[$varName])
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
            stateArg,
            popArg,
            stateIndex1GetterArg,
            
            memoryProp,
            parentMemoryStorerProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            for (var $varName = ${popArg}(${stateArg}), $value = ${popArg}(${stateArg}), $currentState = ${stateIndex1GetterArg}(${stateArg}); $currentState; $currentState = $currentState.${parentMemoryStorerProp}) 
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
            stateArg,
            popArg,
            stateIndex1GetterArg,
            
            memoryProp,
            callerProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $id = ${popArg}(${stateArg}),
              $currentState = ${stateIndex1GetterArg}(${stateArg}),
              $callerFunc = ${stateArg}.${callerProp};
            $currentState.${memoryProp}[$id] = $callerFunc;
            `);
        },
    },
    {
        opcode: OperatorCode.Jump,
        requiredArgs: 2,
        templateFn: function ({
            stateArg,
            popArg,
            
            stateArrProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${stateArg}.${stateArrProp}[0] = ${popArg}(${stateArg})
            `)
        },
    },
    {
        opcode: OperatorCode.JumpIfTrue,
        requiredArgs: 2,
        templateFn: function ({
            stateArg,
            popArg,
            
            stateArrProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $address = ${popArg}(${stateArg});
            ${popArg}(${stateArg}) ? ${stateArg}.${stateArrProp}[0] = $address : $address
            `)
        },
    },
    {
        opcode: OperatorCode.JumpIfFalse,
        requiredArgs: 2,
        templateFn: function ({
            stateArg,
            popArg,
            
            stateArrProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $address = ${popArg}(${stateArg});
            ${popArg}(${stateArg}) ? $address : ${stateArg}.${stateArrProp}[0] = $address
            `)
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

            stateArrProp,
            randomFuncPropAddr,
            randomFuncPropFunc,
            parentMemoryStorerProp,
            memoryProp,
            callerProp,
            currentThisProp,
        }: InstructionAccesibleVariableEnvironment): Template {
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
            }, ${pushArg}(${stateArg}, $targetFunc)
            `)
        },
    },
    {
        opcode: OperatorCode.Call,
        requiredArgs: 7,
        templateFn: function ({
            stateArg,
            popArg,
            stateRelatedFunctionsArg,

            stateArrProp,
            randomFuncPropAddr,
            randomFuncPropFunc,
            parentMemoryStorerProp,
            memoryProp,
            callerProp,
            currentThisProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $callArgs = ${popArg}(${stateArg}),
              $targetFunc = ${popArg}(${stateArg}),
              $thisContext = ${popArg}(${stateArg}),
              $randomFuncProp = ${stateRelatedFunctionsArg}[4];
            if ($targetFunc[$randomFuncProp] && $targetFunc[$randomFuncProp].${randomFuncPropFunc} === $targetFunc) {
              ${stateArg}.${stateArrProp} = [$targetFunc[$randomFuncProp].${randomFuncPropAddr}, {
                ${currentThisProp}: $thisContext,
                ${callerProp}: $targetFunc,
                ${stateArrProp}: ${stateArg}.${stateArrProp},
                ${memoryProp}: [],
                ${parentMemoryStorerProp}: $targetFunc[$randomFuncProp].${parentMemoryStorerProp},
              }, void 0, function() {
                return arguments
              }.apply(void 0, $callArgs)];
              for (var $argIndex = 0; $argIndex < $callArgs.length; $argIndex++) ${stateArg}.${stateArrProp}.push($callArgs[$argIndex]);
            } else ${stateArg}.${stateArrProp}[${FUNCTION_RESULT_REG}] = $targetFunc.apply($thisContext, $callArgs)
            `)
        },
    },
    {
        opcode: OperatorCode.New,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $targetFunc = ${popArg}(${stateArg}),
              $argArray = ${popArg}(${stateArg}).slice();
            $argArray.unshift(void 0), ${pushArg}(${stateArg}, new (Function.bind.apply($targetFunc, $argArray)));
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
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg})[${popArg}(${stateArg})]);
            `)
        },
    },
    {
        opcode: OperatorCode.Put,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${popArg}(${stateArg})[${popArg}(${stateArg})] = ${popArg}(${stateArg})
            `)
        },
    },
    {
        opcode: OperatorCode.In,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) in ${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.Delete,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $targetObj = ${popArg}(${stateArg}),
                $propertyKey = ${popArg}(${stateArg});
            ${pushArg}(${stateArg}, delete $targetObj[$propertyKey]);
            `)
        },
    },
    {
        opcode: OperatorCode.Eq,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) == ${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.Neq,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) != ${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.Seq,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) === ${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.SNeq,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) !== ${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.Lt,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) < ${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.Lte,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) <= ${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.Gt,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) > ${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.Gte,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) >= ${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.Add,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) + ${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.Sub,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) - ${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.Mul,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) * ${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.Div,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) / ${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.Mod,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) % ${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.BNot,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ~${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.BOr,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) | ${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.BXor,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) ^ ${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.BAnd,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) & ${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.LShift,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) << ${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.RShift,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) >> ${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.UrShift,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) >>> ${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.Not,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, !${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.InstanceOf,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${popArg}(${stateArg}) instanceof ${popArg}(${stateArg}));
            `)
        },
    },
    {
        opcode: OperatorCode.TypeOf,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, typeof ${popArg}(${stateArg}));
            `)
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
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $global = ${bigObjectLikeInstancesArg}[0];
            ${pushArg}(${stateArg}, $global[${popArg}(${stateArg})]);
            `)
        },
    },
    {
        opcode: OperatorCode.SetCatchAddr,
        requiredArgs: 2,
        templateFn: function ({
            stateArg,
            popArg,

            catchAddrProp,
            stateArrProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $address = ${popArg}(${stateArg});
            ${stateArg}.${stateArrProp}[1].${catchAddrProp} = $address;
            `)
        },
    },
    {
        opcode: OperatorCode.SetFinallyAddr,
        requiredArgs: 2,
        templateFn: function ({
            stateArg,
            popArg,

            finallyAddressProp,
            stateArrProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $address = ${popArg}(${stateArg});
            ${stateArg}.${stateArrProp}[1].${finallyAddressProp} = $address;
            `)
        },
    },
    {
        opcode: OperatorCode.ThrowErrorOrDoFinally,
        requiredArgs: 7,
        templateFn: function ({
            stateArg,
            stateIndex1GetterArg,

            errorObjectProp,
            funcResultStorerProp,
            anyObjectPropSubprop,
            stateRelatedFunctionsArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $bytecodeReturn = ${stateRelatedFunctionsArg}[0]
              , $exceptionHandler = ${stateRelatedFunctionsArg}[1];
            if (${stateArg}.${errorObjectProp}) $exceptionHandler(${stateArg}, ${stateArg}.${errorObjectProp}.${anyObjectPropSubprop}); else {
              var $state = ${stateIndex1GetterArg}(${stateArg});
              return $state != null && $state.${funcResultStorerProp} && $bytecodeReturn(${stateArg}, $state.${funcResultStorerProp}.${anyObjectPropSubprop})
            }
            `)
        },
    },
    {
        opcode: OperatorCode.ThrowError,
        requiredArgs: 7,
        templateFn: function ({
            stateArg,
            popArg,

            stateRelatedFunctionsArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $exceptionHandler = ${stateRelatedFunctionsArg}[1]
              , $error = ${popArg}(${stateArg});
            $exceptionHandler(${stateArg}, $error)
            `)
        },
    },
    {
        opcode: OperatorCode.PushError,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            pushArg,

            errorObjectProp,
            anyObjectPropSubprop,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${stateArg}.${errorObjectProp} && ${stateArg}.${errorObjectProp}.${anyObjectPropSubprop});
            `)
        },
    },
    {
        opcode: OperatorCode.VoidError,
        requiredArgs: 1,
        templateFn: function ({
            stateArg,

            errorObjectProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${stateArg}.${errorObjectProp} = void 0;
            `)
        },
    },
    {
        opcode: OperatorCode.GetCurrentThis,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            pushArg,

            stateArrProp,
            currentThisProp,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            ${pushArg}(${stateArg}, ${stateArg}.${stateArrProp}[1].${currentThisProp});
            `)
        },
    },
    {
        opcode: OperatorCode.ReturnValue,
        requiredArgs: 7,
        templateFn: function ({
            stateArg,
            popArg,
            stateRelatedFunctionsArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $bytecodeReturn = ${stateRelatedFunctionsArg}[0],
                $value = ${popArg}(${stateArg});
            return $bytecodeReturn(${stateArg}, $value);
            `)
        },
    },
    {
        opcode: OperatorCode.ReturnVoid,
        requiredArgs: 7,
        templateFn: function ({
            stateArg,
            stateRelatedFunctionsArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $bytecodeReturn = ${stateRelatedFunctionsArg}[0];
            return $bytecodeReturn(${stateArg}, void 0);
            `)
        },
    },
    {
        opcode: OperatorCode.ForIn,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $object = ${popArg}(${stateArg})
              , $items = [];
            for (var item in $object) $items.push(item);
            ${pushArg}(${stateArg}, $items);
            `)
        },
    },
    {
        opcode: OperatorCode.Promise,
        requiredArgs: 6,
        templateFn: function ({
            stateArg,
            pushArg,
            bigObjectLikeInstancesArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $asyncCommon = ${bigObjectLikeInstancesArg}[1];
            ${pushArg}(${stateArg}, $asyncCommon[0]);
            `)
        },
    },
    {
        opcode: OperatorCode.RegeneratorRuntime,
        requiredArgs: 6,
        templateFn: function ({
            stateArg,
            pushArg,
            bigObjectLikeInstancesArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $asyncCommon = ${bigObjectLikeInstancesArg}[1];
            ${pushArg}(${stateArg}, $asyncCommon[1]);
            `)
        },
    },
    {
        opcode: OperatorCode.CallFunction0Arg,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $func = ${popArg}(${stateArg});
            ${pushArg}(${stateArg}, $func());
            `)
        },
    },
    {
        opcode: OperatorCode.CallFunction1Arg,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $func = ${popArg}(${stateArg}),
                $arg1 = ${popArg}(${stateArg});
            ${pushArg}(${stateArg}, $func($arg1));
            `)
        },
    },
    {
        opcode: OperatorCode.CallFunction2Arg,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
            return new Template(`
            var $func = ${popArg}(${stateArg}),
                $arg1 = ${popArg}(${stateArg}),
                $arg2 = ${popArg}(${stateArg});
            ${pushArg}(${stateArg}, $func($arg1, $arg2));
            `)
        },
    },
    {
        opcode: OperatorCode.CallFunction3Arg,
        requiredArgs: 3,
        templateFn: function ({
            stateArg,
            popArg,
            pushArg,
        }: InstructionAccesibleVariableEnvironment): Template {
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