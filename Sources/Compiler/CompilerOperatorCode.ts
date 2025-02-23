import { createRegister, type Register } from "../Compiler/Register/Register";
import { shuffle } from "../Interpreter/Builder/Bytecode/BytecodeTranscoderProvider";

export const NUM_OP_CODES = 61 + 1;
export type NumOpCodes = 62;

const availableID = shuffle(Array.from({ length: NUM_OP_CODES }, (_, i) => i));

let currentIdIndex = 0;
function nextOpcode() {
  if (currentIdIndex >= availableID.length) {
    throw new Error("No more unique IDs available");
  }

  return availableID[currentIdIndex++];
}

export const FUNCTION_RESULT_REG: Register = createRegister(2);
export const ARGUMENTS_REG: Register = createRegister(3);
export const ARGUMENTS_SPREAD_REG: Register = createRegister(4);

export enum OperatorCode {
  // Binary operators
  Add = nextOpcode(),
  Sub = nextOpcode(),
  Div = nextOpcode(),
  // EXP = nextRandomOpcode(),
  Mod = nextOpcode(),
  Mul = nextOpcode(),
  UrShift = nextOpcode(),
  RShift = nextOpcode(),
  LShift = nextOpcode(),
  Gte = nextOpcode(),
  Gt = nextOpcode(),
  Lte = nextOpcode(),
  Lt = nextOpcode(),
  Seq = nextOpcode(),
  Eq = nextOpcode(),
  SNeq = nextOpcode(),
  Neq = nextOpcode(),
  In = nextOpcode(),
  InstanceOf = nextOpcode(),

  // Object operators
  EmptyObject = nextOpcode(),
  Get = nextOpcode(),
  Put = nextOpcode(),
  GetWindowProp = nextOpcode(),
  EmptyArray = nextOpcode(),
  NewArray = nextOpcode(),

  // Variable operators
  SetVoid = nextOpcode(),
  SetValue = nextOpcode(),
  Out = nextOpcode(),
  Load = nextOpcode(),

  Promise = nextOpcode(),
  RegeneratorRuntime = nextOpcode(),

  SetReg = nextOpcode(),

  // Bit operators
  BAnd = nextOpcode(),
  BOr = nextOpcode(),
  BXor = nextOpcode(),

  // Unary operators
  BNot = nextOpcode(),
  Not = nextOpcode(),
  Void = nextOpcode(),
  TypeOf = nextOpcode(),
  Delete = nextOpcode(),

  // Regexp operators
  NewRegExp = nextOpcode(),

  // Call operators
  Call = nextOpcode(),
  New = nextOpcode(),
  CallFunction0Arg = nextOpcode(),
  CallFunction1Arg = nextOpcode(),
  CallFunction2Arg = nextOpcode(),
  CallFunction3Arg = nextOpcode(),

  // Loop operators
  ForIn = nextOpcode(),

  // Try operators
  SetCatchAddr = nextOpcode(),
  SetFinallyAddr = nextOpcode(),
  ThrowErrorOrDoFinally = nextOpcode(),
  PushError = nextOpcode(),
  VoidError = nextOpcode(),
  ThrowError = nextOpcode(),

  // Function operators
  Term = nextOpcode(),
  ReturnValue = nextOpcode(),
  ReturnVoid = nextOpcode(),
  Func = nextOpcode(),
  GetCurrentThis = nextOpcode(),
  InheritCaller = nextOpcode(),

  // Jump operators
  Jump = nextOpcode(),
  JumpIfTrue = nextOpcode(),
  JumpIfFalse = nextOpcode(),
}

type FiniteLikeCallOperatorArgumentCount = 0 | 1 | 2 | 3;

export function getFiniteLikeCallOperatorCode(count: FiniteLikeCallOperatorArgumentCount): OperatorCode {
  return OperatorCode[`CallFunction${count}Arg`];
}

export function isFiniteLikeCallOperatorCodeArgumentCounts(count: number): count is FiniteLikeCallOperatorArgumentCount {
  return count <= 3;
}