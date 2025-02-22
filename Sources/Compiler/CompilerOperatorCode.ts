import { createRegister, type Register } from "../Compiler/Register/Register";
import { shuffle } from "../Interpreter/Builder/Bytecode/BytecodeTranscoderProvider";

export type NumOpCodes = 62;
export const NUM_OP_CODES = 61 + 1;

const availableID = shuffle(Array.from({ length: NUM_OP_CODES }, (_, i) => i));

let currentIdIndex = 0;
function nextRandomOpcode() {
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
  Add = nextRandomOpcode(),
  Sub = nextRandomOpcode(),
  Div = nextRandomOpcode(),
  // EXP = nextRandomOpcode(),
  Mod = nextRandomOpcode(),
  Mul = nextRandomOpcode(),
  UrShift = nextRandomOpcode(),
  RShift = nextRandomOpcode(),
  LShift = nextRandomOpcode(),
  Gte = nextRandomOpcode(),
  Gt = nextRandomOpcode(),
  Lte = nextRandomOpcode(),
  Lt = nextRandomOpcode(),
  Seq = nextRandomOpcode(),
  Eq = nextRandomOpcode(),
  SNeq = nextRandomOpcode(),
  Neq = nextRandomOpcode(),
  In = nextRandomOpcode(),
  InstanceOf = nextRandomOpcode(),

  // Object operators
  EmptyObject = nextRandomOpcode(),
  Get = nextRandomOpcode(),
  Put = nextRandomOpcode(),
  GetWindowProp = nextRandomOpcode(),
  EmptyArray = nextRandomOpcode(),
  NewArray = nextRandomOpcode(),

  // Varible operators
  SetVoid = nextRandomOpcode(),
  SetValue = nextRandomOpcode(),
  Out = nextRandomOpcode(),
  Load = nextRandomOpcode(),

  Promise = nextRandomOpcode(),
  RegeneratorRuntime = nextRandomOpcode(),

  SetReg = nextRandomOpcode(),

  // Bit operators
  BAnd = nextRandomOpcode(),
  BOr = nextRandomOpcode(),
  BXor = nextRandomOpcode(),

  // Unary operators
  BNot = nextRandomOpcode(),
  Not = nextRandomOpcode(),
  Void = nextRandomOpcode(),
  TypeOf = nextRandomOpcode(),
  Delete = nextRandomOpcode(),

  // Regexp operators
  NewRegExp = nextRandomOpcode(),

  // Call operators
  Call = nextRandomOpcode(),
  New = nextRandomOpcode(),
  CallFunction0Arg = nextRandomOpcode(),
  CallFunction1Arg = nextRandomOpcode(),
  CallFunction2Arg = nextRandomOpcode(),
  CallFunction3Arg = nextRandomOpcode(),

  // Loop operators
  ForIn = nextRandomOpcode(),

  // Try operators
  SetCatchAddr = nextRandomOpcode(),
  SetFinallyAddr = nextRandomOpcode(),
  ThrowErrorOrDoFinally = nextRandomOpcode(),
  PushError = nextRandomOpcode(),
  VoidError = nextRandomOpcode(),
  ThrowError = nextRandomOpcode(),

  // Function operators
  Term = nextRandomOpcode(),
  ReturnValue = nextRandomOpcode(),
  ReturnVoid = nextRandomOpcode(),
  Func = nextRandomOpcode(),
  GetCurrentThis = nextRandomOpcode(),
  InheritCaller = nextRandomOpcode(),

  // Jump operators
  Jump = nextRandomOpcode(),
  JumpIfTrue = nextRandomOpcode(),
  JumpIfFalse = nextRandomOpcode(),
}

type FiniteLikeCallOperatorArgumentCount = 0 | 1 | 2 | 3;

export function getFiniteLikeCallOperatorCode(count: FiniteLikeCallOperatorArgumentCount): OperatorCode {
  return OperatorCode[`CallFunction${count}Arg`];
}

export function isFiniteLikeCallOperatorCodeArgumentCounts(count: number): count is FiniteLikeCallOperatorArgumentCount {
  return count <= 3;
}