import Template from "../ProgramBuilder/Templates/Template";
import {
    default as Instruction,
    ARGUMENTS_REG,
    ARGUMENTS_SPREAD_REG,
    FUNCTION_RESULT_REG,
    type NumOpCodes,
    OperatorCode,
} from "./";
import * as t from '@babel/types';

/**
 * Define instruction for each opcodes.
 */
export const instructionSet = [
    {
        opcode: OperatorCode.Void,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const push = v.get("PUSH");
            const state = v.get("STATE");
            return new Template(`${push}(${state}, void 0)`)
        },
    },
    {
        opcode: OperatorCode.EmptyObject,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const push = v.get("PUSH");
            const state = v.get("STATE");
            return new Template(`${push}(${state}, {})`)
        },
    },
    {
        opcode: OperatorCode.EmptyArray,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const push = v.get("PUSH");
            const state = v.get("STATE");
            return new Template(`${push}(${state}, [])`)
        },
    },
    {
        opcode: OperatorCode.NewArray,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const push = v.get("PUSH");
            const pop = v.get("POP");
            const state = v.get("STATE");
            return new Template(`${push}(${state}, new Array(${pop}(${state})))`)
        },
    },
    {
        opcode: OperatorCode.SetReg,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const push = v.get("PUSH");
            const state = v.get("STATE");
            const pop = v.get("POP");
            return new Template(`
            ${push}(${state}, ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.NewRegExp,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const push = v.get("PUSH");
            const state = v.get("STATE");
            const pop = v.get("POP");
            return new Template(`${push}(${state}, new RegExp(${pop}(${state}), ${pop}(${state})))`)
        },
    },
    {
        opcode: OperatorCode.SetVoid,
        requiredArgs: 4,
        templateFn: function (v: Map<string, string>): Template {
            const state = v.get("STATE");
            const pop = v.get("POP");
            const memory = v.get("MEMORY");
            const state_index1_getter = v.get("STATE_INDEX1_GETTER");
            return new Template(`
            ${state_index1_getter}(${state}).${memory}[${pop}(${state})] = void 0
            `)
        },
    },
    {
        opcode: OperatorCode.SetValue,
        requiredArgs: 4,
        templateFn: function (v: Map<string, string>): Template {
            const state = v.get("STATE");
            const pop = v.get("POP");
            const memory = v.get("MEMORY");
            const state_index1_getter = v.get("STATE_INDEX1_GETTER");
            return new Template(`
            ${state_index1_getter}(${state}).${memory}[${pop}(${state})] = ${pop}(${state})
            `)
        },
    },
    {
        opcode: OperatorCode.Load,
        requiredArgs: 4,
        templateFn: function (v: Map<string, string>): Template {
            const state = v.get("STATE");
            const pop = v.get("POP");
            const push = v.get("PUSH");
            const parent_memory_keeper = v.get("PARENT_MEMORY_KEEPER");
            const memory = v.get("MEMORY");
            const state_index1_getter = v.get("STATE_INDEX1_GETTER");
            return new Template(`
            for (var $varName = ${pop}(${state}), $currentState = ${state_index1_getter}(${state}); $currentState; $currentState = $currentState.${parent_memory_keeper}) 
              if ($varName in $currentState.${memory}) {
                ${push}(${state}, $currentState.${memory}[$varName])
                return;
              } 
            throw 'ball';
            `)
        },
    },
    {
        opcode: OperatorCode.Out,
        requiredArgs: 4,
        templateFn: function (v: Map<string, string>): Template {
            const state = v.get("STATE");
            const pop = v.get("POP");
            const parent_memory_keeper = v.get("PARENT_MEMORY_KEEPER");
            const memory = v.get("MEMORY");
            const state_index1_getter = v.get("STATE_INDEX1_GETTER");
            return new Template(`
            for (var $varName = ${pop}(${state}), $value = ${pop}(${state}), $currentState = ${state_index1_getter}(${state}); $currentState; $currentState = $currentState.${parent_memory_keeper}) 
              if ($varName in $currentState.${memory}) {
                $currentState.${memory}[$varName] = $value
                return;
              } 
            throw 'ball';
            `)
        },
    },
    {
        opcode: OperatorCode.InheritCaller,
        requiredArgs: 4,
        templateFn: function (v: Map<string, string>): Template {
            const state = v.get("STATE");
            const pop = v.get("POP");
            const memory = v.get("MEMORY");
            const state_index1_getter = v.get("STATE_INDEX1_GETTER");
            const caller = v.get("CALLER");
            return new Template(`
            var $id = ${pop}(${state}),
              $currentState = ${state_index1_getter}(${state}),
              $callerFunc = ${state}.${caller};
            $currentState.${memory}[$id] = $callerFunc;
            `);
        },
    },
    {
        opcode: OperatorCode.Jump,
        requiredArgs: 2,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const state_arr = v.get("STATE_ARR");
            return new Template(`
            ${state}.${state_arr}[0] = ${pop}(${state})
            `)
        },
    },
    {
        opcode: OperatorCode.JumpIfTrue,
        requiredArgs: 2,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const state_arr = v.get("STATE_ARR");
            return new Template(`
            var $address = ${pop}(${state});
            ${pop}(${state}) ? ${state}.${state_arr}[0] = $address : $address
            `)
        },
    },
    {
        opcode: OperatorCode.JumpIfFalse,
        requiredArgs: 2,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const state_arr = v.get("STATE_ARR");
            return new Template(`
            var $address = ${pop}(${state});
            ${pop}(${state}) ? $address : ${state}.${state_arr}[0] = $address
            `)
        },
    },
    {
        opcode: OperatorCode.Func,
        requiredArgs: 7,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const push = v.get("PUSH");
            const state = v.get("STATE");
            const state_arr = v.get("STATE_ARR");
            const random_func_prop_addr = v.get("RAND_FUNC_PROP_ADDR");
            const random_func_prop_func = v.get("RAND_FUNC_PROP_FUNC");
            const random_func_prop_parent = v.get("RAND_FUNC_PROP_PARENT");
            const parent_memory_keeper = v.get("PARENT_MEMORY_KEEPER");
            const memory = v.get("MEMORY");
            const state_index1_getter = v.get("STATE_INDEX1_GETTER");
            const state_storer = v.get("STATE_STORER");
            const current_this = v.get("CURRENT_THIS");
            const caller = v.get("CALLER");
            const state_related_functions = v.get("STATE_RELATED_FUNCTIONS");
            return new Template(`
            var $address = ${pop}(${state}), 
                $length = ${pop}(${state}),
                $funcName = ${pop}(${state}),
                $parentState = ${state_index1_getter}(${state}),
                $stateFunction = ${state_related_functions}[2],
                $dispatchHandler = ${state_related_functions}[3],
                $randomProp = ${state_related_functions}[4],
                $targetFunc = function() {
                  var $funcState = $stateFunction();
                  $funcState.${state_arr}[${ARGUMENTS_REG}] = arguments;
                  for (var $idx = 0; $idx < arguments.length; $idx++) $funcState.${state_arr}[$idx + ${ARGUMENTS_SPREAD_REG}] = arguments[$idx];
                  return $funcState.${state_arr}[1] = {
                      ${current_this}: this,
                      ${state_storer}: [0],
                      ${memory}: [],
                      ${parent_memory_keeper}: $parentState,
                      ${caller}: $targetFunc,
                  }, $funcState.${state_arr}[0] = $address, $dispatchHandler($funcState), $funcState.${state_arr}[${FUNCTION_RESULT_REG}]
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
              ${random_func_prop_addr}: $address,
              ${random_func_prop_parent}: $parentState,
              ${random_func_prop_func}: $targetFunc
            }, ${push}(${state}, $targetFunc)
            `)
        },
    },
    {
        opcode: OperatorCode.Call,
        requiredArgs: 7,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const state_arr = v.get("STATE_ARR");
            const random_func_prop_addr = v.get("RAND_FUNC_PROP_ADDR");
            const random_func_prop_func = v.get("RAND_FUNC_PROP_FUNC");
            const random_func_prop_parent = v.get("RAND_FUNC_PROP_PARENT");
            const parent_memory_keeper = v.get("PARENT_MEMORY_KEEPER");
            const memory = v.get("MEMORY");
            const state_storer = v.get("STATE_STORER");
            const current_this = v.get("CURRENT_THIS");
            const caller = v.get("CALLER");
            const state_related_functions = v.get("STATE_RELATED_FUNCTIONS");
            return new Template(`
            var $callArgs = ${pop}(${state}),
              $targetFunc = ${pop}(${state}),
              $thisContext = ${pop}(${state}),
              $randomFuncProp = ${state_related_functions}[4];
            if ($targetFunc[$randomFuncProp] && $targetFunc[$randomFuncProp].${random_func_prop_func} === $targetFunc) {
              ${state}.${state_arr} = [$targetFunc[$randomFuncProp].${random_func_prop_addr}, {
                ${current_this}: $thisContext,
                ${caller}: $targetFunc,
                ${state_storer}: ${state}.${state_arr},
                ${memory}: [],
                ${parent_memory_keeper}: $targetFunc[$randomFuncProp].${random_func_prop_parent},
              }, void 0, function() {
                return arguments
              }.apply(void 0, $callArgs)];
              for (var $argIndex = 0; $argIndex < $callArgs.length; $argIndex++) ${state}.${state_arr}.push($callArgs[$argIndex]);
            } else ${state}.${state_arr}[${FUNCTION_RESULT_REG}] = $targetFunc.apply($thisContext, $callArgs)
            `)
        },
    },
    {
        opcode: OperatorCode.New,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const push = v.get("PUSH");
            const state = v.get("STATE");
            return new Template(`
            var $targetFunc = ${pop}(${state}),
              $argArray = ${pop}(${state}).slice();
            $argArray.unshift(void 0), ${push}(${state}, new (Function.bind.apply($targetFunc, $argArray)));
            `)
        },
    },
    {
        opcode: OperatorCode.Term,
        requiredArgs: 0,
        templateFn: function (v: Map<string, string>): Template {
            return new Template(`return null`)
        },
    },
    {
        opcode: OperatorCode.Get,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ${pop}(${state})[${pop}(${state})]);
            `)
        },
    },
    {
        opcode: OperatorCode.Put,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            return new Template(`
            ${pop}(${state})[${pop}(${state})] = ${pop}(${state})
            `)
        },
    },
    {
        opcode: OperatorCode.In,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ${pop}(${state}) in ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.Delete,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            var $targetObj = ${pop}(${state}),
                $propertyKey = ${pop}(${state});
            ${push}(${state}, delete $targetObj[$propertyKey]);
            `)
        },
    },
    {
        opcode: OperatorCode.Eq ,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ${pop}(${state}) == ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.Neq,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ${pop}(${state}) != ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.Seq,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ${pop}(${state}) === ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.SNeq,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ${pop}(${state}) !== ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.Lt,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ${pop}(${state}) < ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.Lte,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ${pop}(${state}) <= ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.Gt,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ${pop}(${state}) > ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.Gte,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ${pop}(${state}) >= ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.Add,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ${pop}(${state}) + ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.Sub,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ${pop}(${state}) - ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.Mul,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ${pop}(${state}) * ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.Div,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ${pop}(${state}) / ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.Mod,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ${pop}(${state}) % ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.BNot,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ~${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.BOr,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ${pop}(${state}) | ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.BXor,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ${pop}(${state}) ^ ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.BAnd,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ${pop}(${state}) & ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.LShift,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ${pop}(${state}) << ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.RShift,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ${pop}(${state}) >> ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.UrShift,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ${pop}(${state}) >>> ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.Not,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, !${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.InstanceOf,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, ${pop}(${state}) instanceof ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.TypeOf,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const push = v.get("PUSH");
            return new Template(`
            ${push}(${state}, typeof ${pop}(${state}));
            `)
        },
    },
    {
        opcode: OperatorCode.GetWindowProp,
        requiredArgs: 6,
        templateFn: function (v: Map<string, string>): Template {
            const push = v.get("PUSH");
            const state = v.get("STATE");
            const pop = v.get("POP");
            const big_object_like_instances = v.get("BIG_OBJECT_LIKE_INSTANCES");
            return new Template(`
            var $global = ${big_object_like_instances}[0];
            ${push}(${state}, $global[${pop}(${state})]);
            `)
        },
    },
    {
        opcode: OperatorCode.SetCatchAddr,
        requiredArgs: 2,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const error_addr = v.get("ERROR_ADDR");
            const state_arr = v.get("STATE_ARR");
            return new Template(`
            var $address = ${pop}(${state});
            ${state}.${state_arr}[1].${error_addr} = $address;
            `)
        },
    },
    {
        opcode: OperatorCode.SetFinallyAddr,
        requiredArgs: 2,
        templateFn: function (v: Map<string, string>): Template {
            const pop = v.get("POP");
            const state = v.get("STATE");
            const finally_addr = v.get("FINALLY_ADDR");
            const state_arr = v.get("STATE_ARR");
            return new Template(`
            var $address = ${pop}(${state});
            ${state}.${state_arr}[1].${finally_addr} = $address;
            `)
        },
    },
    {
        opcode: OperatorCode.ThrowErrorOrDoFinally,
        requiredArgs: 7,
        templateFn: function (v: Map<string, string>): Template {
            const state = v.get("STATE");
            const error_object = v.get("ERROR_OBJECT");
            const error = v.get("ERROR_OBJECT_VALUE");
            const state_index1_getter = v.get("STATE_INDEX1_GETTER");
            const func_result_storer = v.get("FUNC_RESULT_STORER");
            const func_result_storer_value = v.get("FUNC_RESULT_STORER_VALUE");
            const state_related_functions = v.get("STATE_RELATED_FUNCTIONS");
            return new Template(`
            var $bytecodeReturn = ${state_related_functions}[0]
              , $exceptionHandler = ${state_related_functions}[1];
            if (${state}.${error_object}) $exceptionHandler(${state}, ${state}.${error_object}.${error}); else {
              var $state = ${state_index1_getter}(${state});
              return $state != null && $state.${func_result_storer} && $bytecodeReturn(${state}, $state.${func_result_storer}.${func_result_storer_value})
            }
            `)
        },
    },
    {
        opcode: OperatorCode.ThrowError,
        requiredArgs: 7,
        templateFn: function (v: Map<string, string>): Template {
            const state = v.get("STATE");
            const pop = v.get("POP");
            const state_related_functions = v.get("STATE_RELATED_FUNCTIONS");
            return new Template(`
            var $exceptionHandler = ${state_related_functions}[1]
              , $error = ${pop}(${state});
            $exceptionHandler(${state}, $error)
            `)
        },
    },
    {
        opcode: OperatorCode.PushError,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const state = v.get("STATE");
            const push = v.get("PUSH");
            const error_object = v.get("ERROR_OBJECT");
            const error = v.get("ERROR_OBJECT_VALUE");
            return new Template(`
            ${push}(${state}, ${state}.${error_object} && ${state}.${error_object}.${error});
            `)
        },
    },
    {
        opcode: OperatorCode.VoidError,
        requiredArgs: 1,
        templateFn: function (v: Map<string, string>): Template {
            const state = v.get("STATE");
            const error_object = v.get("ERROR_OBJECT");
            return new Template(`
            ${state}.${error_object} = void 0;
            `)
        },
    },
    {
        opcode: OperatorCode.GetCurrentThis,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const state = v.get("STATE");
            const push = v.get("PUSH");
            const state_arr = v.get("STATE_ARR");
            const current_this = v.get("CURRENT_THIS");
            return new Template(`
            ${push}(${state}, ${state}.${state_arr}[1].${current_this});
            `)
        },
    },
    {
        opcode: OperatorCode.ReturnValue,
        requiredArgs: 7,
        templateFn: function (v: Map<string, string>): Template {
            const state = v.get("STATE");
            const pop = v.get("POP");
            const state_related_functions = v.get("STATE_RELATED_FUNCTIONS");
            return new Template(`
            var $bytecodeReturn = ${state_related_functions}[0],
                $value = ${pop}(${state});
            return $bytecodeReturn(${state}, $value);
            `)
        },
    },
    {
        opcode: OperatorCode.ReturnVoid,
        requiredArgs: 7,
        templateFn: function (v: Map<string, string>): Template {
            const state = v.get("STATE");
            const state_related_functions = v.get("STATE_RELATED_FUNCTIONS");
            return new Template(`
            var $bytecodeReturn = ${state_related_functions}[0];
            return $bytecodeReturn(${state}, void 0);
            `)
        },
    },
    {
        opcode: OperatorCode.ForIn,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const state = v.get("STATE");
            const push = v.get("PUSH");
            const pop = v.get("POP");
            return new Template(`
            var $object = ${pop}(${state})
              , $items = [];
            for (var item in $object) $items.push(item);
            ${push}(${state}, $items);
            `)
        },
    },
    {
        opcode: OperatorCode.Promise,
        requiredArgs: 6,
        templateFn: function (v: Map<string, string>): Template {
            const state = v.get("STATE");
            const push = v.get("PUSH");
            const big_object_like_instances = v.get("BIG_OBJECT_LIKE_INSTANCES");
            return new Template(`
            var $asyncCommon = ${big_object_like_instances}[1];
            ${push}(${state}, $asyncCommon[0]);
            `)
        },
    },
    {
        opcode: OperatorCode.Regenerator,
        requiredArgs: 6,
        templateFn: function (v: Map<string, string>): Template {
            const state = v.get("STATE");
            const push = v.get("PUSH");
            const big_object_like_instances = v.get("BIG_OBJECT_LIKE_INSTANCES");
            return new Template(`
            var $asyncCommon = ${big_object_like_instances}[1];
            ${push}(${state}, $asyncCommon[1]);
            `)
        },
    },
    {
        opcode: OperatorCode.CallFunction0Arg,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const state = v.get("STATE");
            const push = v.get("PUSH");
            const pop = v.get("POP");
            return new Template(`
            var $func = ${pop}(${state});
            ${push}(${state}, $func());
            `)
        },
    },
    {
        opcode: OperatorCode.CallFunction1Arg,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const state = v.get("STATE");
            const push = v.get("PUSH");
            const pop = v.get("POP");
            return new Template(`
            var $func = ${pop}(${state}),
                $arg1 = ${pop}(${state});
            ${push}(${state}, $func($arg1));
            `)
        },
    },
    {
        opcode: OperatorCode.CallFunction2Arg,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const state = v.get("STATE");
            const push = v.get("PUSH");
            const pop = v.get("POP");
            return new Template(`
            var $func = ${pop}(${state}),
                $arg1 = ${pop}(${state}),
                $arg2 = ${pop}(${state});
            ${push}(${state}, $func($arg1, $arg2));
            `)
        },
    },
    {
        opcode: OperatorCode.CallFunction3Arg,
        requiredArgs: 3,
        templateFn: function (v: Map<string, string>): Template {
            const state = v.get("STATE");
            const push = v.get("PUSH");
            const pop = v.get("POP");
            return new Template(`
            var $func = ${pop}(${state}),
                $arg1 = ${pop}(${state}),
                $arg2 = ${pop}(${state}),
                $arg3 = ${pop}(${state});
            ${push}(${state}, $func($arg1, $arg2, $arg3));
            `)
        },
    },
] as const satisfies (ReadonlyArray<Instruction> & { length: NumOpCodes });

export function getInstructionFromOpcode(opcode: OperatorCode): Instruction {
    return instructionSet.find(o => o.opcode === opcode);
}

export function compileASTInstructionHandlers(
    variableNames: Map<string, string>,
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