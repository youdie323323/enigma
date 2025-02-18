import { createRegister, type Register } from "../Compiler/Register/Register";
import { shuffle, chance } from "../Utils/Random";

export type NumOpCodes = 62;
export const NUM_OP_CODES = 61 + 1;

const availableID = shuffle(Array.from({ length: NUM_OP_CODES }, (_, i) => i));

let currentIdIndex = 0;
function getRandomId() {
  if (currentIdIndex >= availableID.length) {
    throw new Error("No more unique IDs available");
  }

  return availableID[currentIdIndex++];
}

let currentLiteralId: number = Math.floor(Math.random() * 6) + 1;
// To prevent register access blocking, atleast we need to ensure that value is not above 64 (FUNCTION_RESULT_REG << 5)
function nextLiteralId(): number {
  if (chance(15)) {
    currentLiteralId += 1;
  } else if (chance(15)) {
    currentLiteralId += 2;
  } else if (chance(15)) {
    currentLiteralId += 3;
  } else {
    // 6 + (3.8 * 5) = 25
    // 25 << 1 = 50
    currentLiteralId += 3.8;
  }
  return currentLiteralId << 1
}

export const FUNCTION_RESULT_REG: Register = createRegister(2);
export const ARGUMENTS_REG: Register = createRegister(3);
export const ARGUMENTS_SPREAD_REG: Register = createRegister(4);

export enum OperatorCode {
  // For literals
  Null = currentLiteralId << 1,
  True = nextLiteralId(),
  False = nextLiteralId(),
  Num = nextLiteralId(),
  StoreOrLoadStr = nextLiteralId(),
  FakePlaceholder = nextLiteralId(),

  // Binary operators
  Add = getRandomId(),
  Sub = getRandomId(),
  Div = getRandomId(),
  // EXP = getRandomId(),
  Mod = getRandomId(),
  Mul = getRandomId(),
  UrShift = getRandomId(),
  RShift = getRandomId(),
  LShift = getRandomId(),
  Gte = getRandomId(),
  Gt = getRandomId(),
  Lte = getRandomId(),
  Lt = getRandomId(),
  Seq = getRandomId(),
  Eq = getRandomId(),
  SNeq = getRandomId(),
  Neq = getRandomId(),
  In = getRandomId(),
  InstanceOf = getRandomId(),

  // Object operators
  EmptyObject = getRandomId(),
  Get = getRandomId(),
  Put = getRandomId(),
  GetWindowProp = getRandomId(),
  EmptyArray = getRandomId(),
  NewArray = getRandomId(),

  // Varible operators
  SetVoid = getRandomId(),
  SetValue = getRandomId(),
  Out = getRandomId(),
  Load = getRandomId(),

  Promise = getRandomId(),
  Regenerator = getRandomId(),

  SetReg = getRandomId(),

  // Bit operators
  BAnd = getRandomId(),
  BOr = getRandomId(),
  BXor = getRandomId(),

  // Unary operators
  BNot = getRandomId(),
  Not = getRandomId(),
  Void = getRandomId(),
  TypeOf = getRandomId(),
  Delete = getRandomId(),

  // Regexp operators
  NewRegExp = getRandomId(),

  // Call operators
  Call = getRandomId(),
  New = getRandomId(),
  CallFunction0Arg = getRandomId(),
  CallFunction1Arg = getRandomId(),
  CallFunction2Arg = getRandomId(),
  CallFunction3Arg = getRandomId(),

  // Loop operators
  ForIn = getRandomId(),

  // Try operators
  SetCatchAddr = getRandomId(),
  SetFinallyAddr = getRandomId(),
  ThrowErrorOrDoFinally = getRandomId(),
  PushError = getRandomId(),
  VoidError = getRandomId(),
  ThrowError = getRandomId(),

  // Function operators
  Term = getRandomId(),
  ReturnValue = getRandomId(),
  ReturnVoid = getRandomId(),
  Func = getRandomId(),
  GetCurrentThis = getRandomId(),
  InheritCaller = getRandomId(),

  // Jump operators
  Jump = getRandomId(),
  JumpIfTrue = getRandomId(),
  JumpIfFalse = getRandomId(),
}

type FiniteLikeCallOperatorArgumentCount = 0 | 1 | 2 | 3;

export function getFiniteLikeCallOperator(count: FiniteLikeCallOperatorArgumentCount): OperatorCode {
  return OperatorCode[`CallFunction${count}Arg`];
}

export function isFiniteLikeCallOperatorCodeArgumentCounts(count: number): count is FiniteLikeCallOperatorArgumentCount {
  return count <= 3;
}