import { OperatorCode } from "./CompilerOperatorCode";

type CompilerIR<T extends symbol, U extends object> = { type: T } & U;

export const labelSymbol: unique symbol = Symbol("label");
export const referenceSymbol: unique symbol = Symbol("reference");
export const opcodeSymbol: unique symbol = Symbol("opcode");
export const stringDataSymbol: unique symbol = Symbol("stringData");
export const numericalDataSymbol: unique symbol = Symbol("numericalData");

type Referable = { label: string };

export type IRLabel = CompilerIR<typeof labelSymbol, Referable>;
export type IRReference = CompilerIR<typeof referenceSymbol, Referable>;
export type IROpcode = CompilerIR<typeof opcodeSymbol, { opcode: OperatorCode }>;
export type IRStringData = CompilerIR<typeof stringDataSymbol, { data: string }>;
export type IRNumericalData = CompilerIR<typeof numericalDataSymbol, { data: number[] }>;

/**
 * Represents (any|all) intermediate representation.
 */
export type IR =
  | IRLabel
  | IRReference
  | IROpcode
  | IRStringData
  | IRNumericalData;