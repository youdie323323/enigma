import * as t from '@babel/types';
import {
  default as Parser,
  REGENERATOR_RUNTIME_FUNCTION_IDENTIFIER,
  type CompilableBlock
} from "./Parser";
import RegisterAllocator from './Register/RegisterAllocator';
import UniqueIdentifier from './CompilerUniqueIdentifier';
import { Memoize } from './CompilerMemoize';
import { OperatorCode, ARGUMENTS_REG, ARGUMENTS_SPREAD_REG, FUNCTION_RESULT_REG } from '../Instruction';
import type { IR, IRNumericalData, IRLabel, IROpcode, IRReference, IRStringData } from './CompilerIntermediateRepresentation';
import { labelSymbol, referenceSymbol, opcodeSymbol, stringDataSymbol, numericalDataSymbol } from './CompilerIntermediateRepresentation';
import { getFiniteLikeCallOperator, isFiniteLikeCallOperatorCodeArgumentCounts } from '../Instruction/InstructionOperatorCode';
import { type Bytecode } from '../ProgramBuilder/Bytecode/Bytecode';
import { createRegister, type Register, registerToNumber } from './Register/Register';
import { shuffle } from '../ProgramBuilder/Bytecode/BytecodeTranscoderProvider';

type ControlBlock = { label?: string; continue?: string; break?: string };

type Try = { catch?: string; finally?: string };

const buffer = new ArrayBuffer(8);
const floatView = new Float64Array(buffer);
const intView = new Uint32Array(buffer);

export default class Compiler {
  private static readonly MAX_SAFE_INTEGER = Math.pow(2, 30) - 1;

  /**
   * Uid generator.
   */
  private uniqueId: UniqueIdentifier;

  /**
   * Parser for parse code and generates compilable blocks.
   */
  private parser: Parser;

  private registerAllocator: RegisterAllocator;

  /**
   * All instructions.
   */
  private instructions: Array<IR>;

  /**
   * String store.
   */
  private stringTable: Set<string>;

  /**
   * The set of objects that will be pushed for all blocks that can break/continue.
   */
  private controlBlockStack: Array<ControlBlock>;

  /**
   * Try stack to determine if that try-catch has parent try-catch.
   */
  private tryStack: Array<Try>;

  /**
   * Memory dictionary to easing operations.
   */
  private memoryDictionary: Map<string, number>;

  /**
   * Variable memory similar to (var x). 
   */
  private scopedMemory: Map<string, number>;

  /**
   * Global memory store where global setted memory goes.
   * 
   * @remarks
   * Similar to something like window.something .
   * Global variables doesnt have number id or something to identify, so we can just use Set to store them.
   */
  private globalMemory: Set<string>;

  /**
   * Opcode mapping for each assignment operators.
   */
  private static readonly ASSIGNMENT_OPCODES = {
    "=": -1,
    "+=": OperatorCode.Add,
    "-=": OperatorCode.Sub,
    "*=": OperatorCode.Mul,
    // "**=": OperatorCode.EXP,
    "/=": OperatorCode.Div,
    "%=": OperatorCode.Mod,
    "<<=": OperatorCode.LShift,
    ">>=": OperatorCode.RShift,
    ">>>=": OperatorCode.UrShift,
    "|=": OperatorCode.BOr,
    "^=": OperatorCode.BXor,
    "&=": OperatorCode.BAnd,
  } satisfies Record<`${string}=`, OperatorCode>;

  /**
   * Opcode mapping for each binary operators.
   */
  private static readonly BINARY_OPCODES = {
    "+": OperatorCode.Add,
    "-": OperatorCode.Sub,
    "*": OperatorCode.Mul,
    // "**": OperatorCode.EXP,
    "/": OperatorCode.Div,
    "%": OperatorCode.Mod,
    "<<": OperatorCode.LShift,
    ">>": OperatorCode.RShift,
    ">>>": OperatorCode.UrShift,
    "|": OperatorCode.BOr,
    "^": OperatorCode.BXor,
    "&": OperatorCode.BAnd,

    "in": OperatorCode.In,
    "instanceof": OperatorCode.InstanceOf,

    "==": OperatorCode.Eq,
    "!=": OperatorCode.Neq,
    "===": OperatorCode.Seq,
    "!==": OperatorCode.SNeq,
    "<": OperatorCode.Lt,
    "<=": OperatorCode.Lte,
    ">": OperatorCode.Gt,
    ">=": OperatorCode.Gte,
  } satisfies Record<
    Exclude<
      t.BinaryExpression["operator"],
      // Not supports pipeline
      "|>" |
      // Converted with plugin
      "**"
    >,
    OperatorCode
  >;

  /**
   * Reset all values to initial size.
   */
  private reset() {
    this.uniqueId = new UniqueIdentifier();

    this.parser = new Parser(this.uniqueId);

    this.registerAllocator = new RegisterAllocator(createRegister(2));

    this.instructions = new Array();

    this.controlBlockStack = new Array();

    this.tryStack = new Array();

    this.stringTable = new Set();

    this.scopedMemory = new Map<string, number>();
    this.globalMemory = new Set<string>();

    this.memoryDictionary = new Map<string, number>();
    // Add dictionary
    this.memoryDictionary.set("GLOBAL", this.uniqueId.get());
  }

  private createLabelName(): string {
    return String(this.uniqueId.get());
  }

  @Memoize()
  private createLabel(label: string): IRLabel {
    return { type: labelSymbol, label } satisfies IRLabel;
  }

  @Memoize()
  private createReference(label: string): IRReference {
    return { type: referenceSymbol, label } satisfies IRReference;
  }

  @Memoize()
  private createOp(opcode: OperatorCode): IROpcode {
    return { type: opcodeSymbol, opcode } satisfies IROpcode;
  }

  // @Memoize()
  private createLiteral(literal: string | number | boolean | null): Array<IR> {
    const asms: Array<IR> = [];

    switch (true) {
      case typeof literal === "string": {
        // Push string if unknown
        if (!this.stringTable.has(literal)) this.stringTable.add(literal);

        const inst = { type: stringDataSymbol, data: literal } satisfies IRStringData;

        asms.push(inst);

        break;
      }

      case typeof literal === "number": {
        const inst = { type: numericalDataSymbol, data: [] } satisfies IRNumericalData;

        // Use NUM, if value is > 2^30-1 or float
        // Literal never be negative value
        if (
          literal <= Compiler.MAX_SAFE_INTEGER &&
          Number.isInteger(literal)
        ) {
          inst.data.push(this.encodeSafeInteger(literal));
        } else {
          inst.data.push(...this.encodeFloat64(literal));
          asms.push(this.createOp(OperatorCode.Num));
        }

        asms.push(inst);

        break;
      }

      case typeof literal === "boolean": {
        asms.push(this.createOp(literal ? OperatorCode.True : OperatorCode.False));

        break;
      }

      case literal === null: {
        asms.push(this.createOp(OperatorCode.Null));

        break;
      }

      default: throw new Error("Unsupported literal type: " + typeof literal);
    }

    return asms;
  }

  /**
   * Write asm to instructions.
   */
  private writeInstructions(...asms: Array<IR>): void {
    this.instructions.push(...asms);
  };

  /**
   * Push stack to control block stack, then pop on end.
   */
  private disposableControlBlock(stack: ControlBlock): Disposable {
    this.controlBlockStack.push(stack);

    return { [Symbol.dispose]: () => { this.controlBlockStack.pop() } } satisfies Disposable;
  }

  /**
   * Compiles variable into number instructions.
   */
  private compileMemory(ident: string): Array<IR> {
    let id: number;
    if (this.scopedMemory.has(ident)) {
      id = this.scopedMemory.get(ident);
    } else {
      id = this.uniqueId.get();
      this.scopedMemory.set(ident, id);
    };

    return this.createLiteral(id);
  }

  /**
   * Compiles variable assignment.
   * 
   * @param reg - The register number to store expression value
   * @param valueFn - Compiles right-side value then return value register
   * @param isOperatorEqual - The operator is assignment ("=") or not
   */
  private compileAssign(
    { name }: t.Identifier,
    reg: Register,
    valueFn: () => Register,
    isOperatorEqual: boolean,
  ) {
    if (
      (isOperatorEqual && !this.scopedMemory.has(name)) ||
      (!isOperatorEqual && this.globalMemory.has(name))
    ) {
      const globalReg = this.globalRegister;
      const valueReg = valueFn();

      this.writeInstructions(this.createOp(OperatorCode.Put), this.createRegId(globalReg), ...this.createLiteral(name), this.createRegId(valueReg));
      this.writeInstructions(this.createOp(OperatorCode.SetReg), this.createRegId(valueReg), this.createRegId(reg));

      // Free globalReg/valueReg
      this.registerAllocator.free();
      this.registerAllocator.free();

      // Assigned to global, store them
      this.globalMemory.add(name);
    } else {
      const valueReg = valueFn();

      this.writeInstructions(this.createOp(OperatorCode.Out), ...this.compileMemory(name), this.createRegId(valueReg));
      this.writeInstructions(this.createOp(OperatorCode.SetReg), this.createRegId(valueReg), this.createRegId(reg));

      // Free valueReg
      this.registerAllocator.free();
    }
  }

  /**
   * Compiles statements.
   */
  private compileStatement(stat: t.Statement, labelName: string = undefined): void {
    const endStatementLabel = this.createLabelName();

    // TODO: supports label for all statements

    switch (true) {
      case t.isEmptyStatement(stat):
      case t.isDebuggerStatement(stat): {
        // using _disposable = this.disposableControlBlock({ label: labelName, break: endStatementLabel });

        break;
      }

      case t.isBlockStatement(stat): {
        stat.body.forEach(stat => this.compileStatement(stat));

        break;
      }

      case t.isLabeledStatement(stat): {
        this.compileStatement(stat.body, stat.label.name);

        break;
      }

      case t.isBreakStatement(stat): {
        const label = stat.label?.name;
        const reversedControlBlock = this.controlBlockStack.toReversed();

        if (label) {
          for (const { break: breakLabel, label: labelName } of reversedControlBlock) {
            if (breakLabel && labelName === label) {
              this.writeInstructions(this.createOp(OperatorCode.Jump), this.createReference(breakLabel));
              break;
            }
          }
        } else {
          for (const { break: breakLabel } of reversedControlBlock) {
            if (breakLabel) {
              this.writeInstructions(this.createOp(OperatorCode.Jump), this.createReference(breakLabel));
              break;
            }
          }
        }

        break;
      }

      case t.isContinueStatement(stat): {
        const label = stat.label?.name;
        if (label) {
          for (const { continue: continueLabel, label: labelName } of this.controlBlockStack.toReversed()) {
            if (continueLabel && labelName === label) {
              this.writeInstructions(this.createOp(OperatorCode.Jump), this.createReference(continueLabel));
              break;
            }
          }
        } else {
          for (const { continue: continueLabel } of this.controlBlockStack.toReversed()) {
            if (continueLabel) {
              this.writeInstructions(this.createOp(OperatorCode.Jump), this.createReference(continueLabel));
              break;
            }
          }
        }

        break;
      }

      case t.isIfStatement(stat): {
        const { test, consequent, alternate } = stat;

        const testReg = this.compileExpression(test);

        const altLabel = this.createLabelName();
        const endLabel = this.createLabelName();

        this.writeInstructions(
          this.createOp(OperatorCode.JumpIfFalse),
          this.createReference(alternate ? altLabel : endLabel),
          this.createRegId(testReg),
        );

        this.compileStatement(consequent);

        if (alternate) {
          this.writeInstructions(this.createOp(OperatorCode.Jump), this.createReference(endLabel));

          this.writeInstructions(this.createLabel(altLabel));
          this.compileStatement(alternate);
        }

        this.writeInstructions(this.createLabel(endLabel));

        // Free testReg
        this.registerAllocator.free();

        break;
      }

      case t.isSwitchStatement(stat): {
        const { discriminant, cases } = stat;

        const discriminantReg = this.compileExpression(discriminant);

        const caseLabel = this.createLabelName();
        const defaultLabel = this.createLabelName();

        cases.forEach((_case, i) => {
          if (_case.test != null) {
            const testReg = this.compileExpression(_case.test);
            const seqResultReg = this.registerAllocator.next();

            this.writeInstructions(this.createOp(OperatorCode.Seq), this.createRegId(testReg), this.createRegId(discriminantReg), this.createRegId(seqResultReg));
            this.writeInstructions(this.createOp(OperatorCode.JumpIfTrue), this.createReference(`${caseLabel}_${i}`), this.createRegId(seqResultReg))

            // Free testReg/seqResultReg
            this.registerAllocator.free();
            this.registerAllocator.free();
          } else {
            // Case is default if test is null
            this.writeInstructions(this.createOp(OperatorCode.Jump), this.createReference(defaultLabel));
          }
        });
        cases.forEach((_case, i) => {
          if (_case.test != null) {
            this.writeInstructions(this.createLabel(`${caseLabel}_${i}`));
          } else {
            this.writeInstructions(this.createLabel(defaultLabel));
          }

          for (const _stat of _case.consequent) {
            this.compileStatement(_stat);
          }
        });

        // Free discriminantReg
        this.registerAllocator.free();

        break;
      }

      // Loop statements
      case t.isWhile(stat): {
        const { body, test } = stat;

        const bodyLabel = this.createLabelName();
        const testLabel = this.createLabelName();

        using _disposable = this.disposableControlBlock({
          label: labelName,
          continue: testLabel,
          break: endStatementLabel
        });

        this.writeInstructions(this.createLabel(bodyLabel));

        this.compileStatement(body);

        this.writeInstructions(this.createLabel(testLabel));

        const testReg = this.compileExpression(test);
        this.writeInstructions(this.createOp(OperatorCode.JumpIfTrue), this.createReference(bodyLabel), this.createRegId(testReg));

        // Free testReg
        this.registerAllocator.free();

        break;
      }

      case t.isForStatement(stat): {
        const { init, test, body, update } = stat;

        // const bodyLabel = this.createLabelName("for_body");
        const testLabel = this.createLabelName();
        const updateLabel = this.createLabelName();

        using _disposable = this.disposableControlBlock({
          label: labelName,
          continue: updateLabel,
          break: endStatementLabel
        });

        if (init) {
          const newInit: t.Statement = t.isVariableDeclaration(init) ?
            init :
            t.expressionStatement(init);
          this.compileStatement(newInit);
        }

        this.writeInstructions(this.createLabel(testLabel));
        if (test) {
          const testReg = this.compileExpression(test);

          this.writeInstructions(this.createOp(OperatorCode.JumpIfFalse), this.createReference(endStatementLabel), this.createRegId(testReg));

          // Free testReg
          this.registerAllocator.free();
        }

        // this.writeInstructions(this.makeLabel(bodyLabel));
        this.compileStatement(body);

        this.writeInstructions(this.createLabel(updateLabel));
        if (update) {
          this.compileStatement(t.expressionStatement(update));
        }

        this.writeInstructions(this.createOp(OperatorCode.Jump), this.createReference(testLabel));

        break;
      }

      case t.isForInStatement(stat): {
        const { left, right, body } = stat;

        const propertiesReg = this.registerAllocator.next();
        const propertiesLengthReg = this.registerAllocator.next();
        const isPropertiesLengthZeroReg = this.registerAllocator.next();
        const propertiesIndexReg = isPropertiesLengthZeroReg;
        const propertiesItemReg = this.registerAllocator.next();
        const isJumpableReg = this.registerAllocator.next();

        const startLabel = this.createLabelName();

        using _disposable = this.disposableControlBlock({
          label: labelName,
          continue: startLabel,
          break: endStatementLabel
        });

        let itemName: string | null = null;

        if (t.isVariableDeclaration(left)) {
          itemName = (left.declarations[0].id as t.Identifier).name;
        } else if (t.isIdentifier(left)) {
          itemName = left.name;
        } else {
          throw new Error("Unsupported left-hand side in for-in statement");
        }

        const rightReg = this.compileExpression(right);
        this.writeInstructions(this.createOp(OperatorCode.ForIn), this.createRegId(rightReg), this.createRegId(propertiesReg));

        // Jump if properties length is zero
        this.writeInstructions(this.createOp(OperatorCode.Get), this.createRegId(propertiesReg), ...this.createLiteral("length"), this.createRegId(propertiesLengthReg));
        this.writeInstructions(this.createOp(OperatorCode.Eq), this.createRegId(propertiesLengthReg), ...this.createLiteral(0), this.createRegId(isPropertiesLengthZeroReg));
        this.writeInstructions(this.createOp(OperatorCode.JumpIfTrue), this.createReference(endStatementLabel), this.createRegId(isPropertiesLengthZeroReg));
        // Set zero to index
        this.writeInstructions(this.createOp(OperatorCode.SetReg), ...this.createLiteral(0), this.createRegId(propertiesIndexReg));

        this.writeInstructions(this.createLabel(startLabel));
        // Set element
        this.writeInstructions(this.createOp(OperatorCode.Get), this.createRegId(propertiesReg), this.createRegId(propertiesIndexReg), this.createRegId(propertiesItemReg));
        this.writeInstructions(this.createOp(OperatorCode.Out), ...this.compileMemory(itemName), this.createRegId(propertiesItemReg));
        // Compile body
        this.compileStatement(body);
        // Iterate
        this.writeInstructions(this.createOp(OperatorCode.Add), this.createRegId(propertiesIndexReg), ...this.createLiteral(1), this.createRegId(propertiesIndexReg));
        this.writeInstructions(this.createOp(OperatorCode.Lt), this.createRegId(propertiesIndexReg), this.createRegId(propertiesLengthReg), this.createRegId(isJumpableReg));
        this.writeInstructions(this.createOp(OperatorCode.JumpIfTrue), this.createReference(startLabel), this.createRegId(isJumpableReg));

        // Free regs
        this.registerAllocator.free();
        this.registerAllocator.free();
        this.registerAllocator.free();
        this.registerAllocator.free();
        this.registerAllocator.free();
        this.registerAllocator.free();

        break;
      }

      // End loop statements
      case t.isVariableDeclaration(stat): {
        const { declarations, kind } = stat;

        declarations.forEach(declaration => {
          const varName = (declaration.id as t.Identifier).name;

          if (kind !== "var") {
            this.writeInstructions(this.createOp(OperatorCode.SetVoid), ...this.compileMemory(varName));
          }

          if (declaration.init) {
            const initReg = this.compileExpression(declaration.init);

            this.writeInstructions(this.createOp(OperatorCode.Out), ...this.compileMemory(varName), this.createRegId(initReg));

            // Free initReg
            this.registerAllocator.free();
          }
        });

        break;
      }

      case t.isFunctionDeclaration(stat): {
        const { id, params, label } = stat;

        const funcReg = this.registerAllocator.next();

        const funcName = id.name;

        this.writeInstructions(
          this.createOp(OperatorCode.Func),
          this.createReference(label),
          ...this.createLiteral(params.length),
          ...this.createLiteral("" /* funcName */),
          this.createRegId(funcReg),
        );

        this.writeInstructions(
          this.createOp(OperatorCode.SetValue),
          ...this.compileMemory(funcName),
          this.createRegId(funcReg),
        );

        // Free funcReg
        this.registerAllocator.free();

        break;
      }

      case t.isReturnStatement(stat): {
        if (stat.argument) {
          const argumentReg = this.compileExpression(stat.argument);

          this.writeInstructions(this.createOp(OperatorCode.ReturnValue), this.createRegId(argumentReg));

          // Free argumentReg
          this.registerAllocator.free();
        } else {
          this.writeInstructions(this.createOp(OperatorCode.ReturnVoid));
        }

        break;
      }

      case t.isExpressionStatement(stat): {
        this.compileExpression(stat.expression);

        // Free expression
        this.registerAllocator.free();

        break;
      }

      case t.isThrowStatement(stat): {
        const argumentReg = this.compileExpression(stat.argument);

        this.writeInstructions(this.createOp(OperatorCode.ThrowError), this.createRegId(argumentReg));

        // Free argument
        this.registerAllocator.free();

        break;
      }

      case t.isTryStatement(stat): {
        const catchLabel = stat.handler ? this.createLabelName() : null;
        const finallyLabel = stat.finalizer ? this.createLabelName() : null;
        const tryCatchFinallyEndLabel = this.createLabelName();

        let lastTryHasCatch = null;
        let lastTryHasFinally = null;
        for (const { catch: catchLabel, finally: finallyLabel } of this.tryStack.toReversed()) {
          lastTryHasCatch = lastTryHasCatch || catchLabel;
          lastTryHasFinally = lastTryHasFinally || finallyLabel;
        }

        // const parentTryStack = this.tryStack.at(-1);
        // const parentTryCatch = parentTryStack?.catch ? this.makeReference(parentTryStack.catch) : this.makeLiteral(null);
        // const parentTryFinally = parentTryStack?.finally ? this.makeReference(parentTryStack.finally) : this.makeLiteral(null);

        const parentTryCatch = lastTryHasCatch ? [this.createReference(lastTryHasCatch)] : this.createLiteral(null);
        const parentTryFinally = lastTryHasFinally ? [this.createReference(lastTryHasFinally)] : this.createLiteral(null);

        // Push before catch parent so try dont refer itself
        this.tryStack.push({ catch: catchLabel, finally: finallyLabel } satisfies Try);

        // Compile the try block
        this.writeInstructions(
          // Jump to finally label when catch is not used + error is cached
          this.createOp(OperatorCode.SetCatchAddr),
          this.createReference(catchLabel || finallyLabel),
        );
        if (stat.finalizer) {
          // Execute finally, if return triggered in block or catch
          this.writeInstructions(
            this.createOp(OperatorCode.SetFinallyAddr),
            this.createReference(finallyLabel),
          );
        }
        this.compileStatement(stat.block);
        // If there is handler, we cant directly do finallyLabel || tryCatchFinallyEndLabel so
        // jump to finallyLabel || tryCatchFinallyEndLabel
        if (stat.handler) {
          // This op is not running when error is occured
          this.writeInstructions(this.createOp(OperatorCode.Jump), this.createReference(finallyLabel || tryCatchFinallyEndLabel));
        }

        // Compile the catch block if it exists
        if (stat.handler) {
          this.writeInstructions(this.createLabel(catchLabel));

          const errorReg = this.registerAllocator.next();

          this.writeInstructions(
            this.createOp(OperatorCode.SetCatchAddr),
            ...(stat.finalizer ? [this.createReference(finallyLabel)] : parentTryCatch),
          );

          if (stat.handler.param) {
            const name = (stat.handler.param as t.Identifier).name;

            this.writeInstructions(this.createOp(OperatorCode.PushError), this.createRegId(errorReg));
            this.writeInstructions(this.createOp(OperatorCode.VoidError));
            this.writeInstructions(this.createOp(OperatorCode.SetValue), ...this.compileMemory(name), this.createRegId(errorReg));
          } else {
            this.writeInstructions(this.createOp(OperatorCode.VoidError));
          }

          this.compileStatement(stat.handler.body);

          // Free errorReg
          this.registerAllocator.free();

          // If error is not occured, directly do finallyLabel || tryCatchFinallyEndLabel
        }

        // Compile the finally block if it exists
        if (stat.finalizer) {
          this.writeInstructions(this.createLabel(finallyLabel));

          // TODO: Fix if theres error, parentTryFinally will not running

          this.writeInstructions(
            this.createOp(OperatorCode.SetCatchAddr),
            ...parentTryCatch,
          );
          this.writeInstructions(
            this.createOp(OperatorCode.SetFinallyAddr),
            ...parentTryFinally,
          );

          this.compileStatement(stat.finalizer);
          this.writeInstructions(this.createOp(OperatorCode.ThrowErrorOrDoFinally));
        }

        // Write the end label
        this.writeInstructions(this.createLabel(tryCatchFinallyEndLabel));
        this.writeInstructions(
          this.createOp(OperatorCode.SetCatchAddr),
          ...parentTryCatch,
        );

        this.tryStack.pop();

        break;
      }

      default: {
        throw new Error(`Unsupported statement type: ${stat.type}`);
      }
    }

    this.writeInstructions(this.createLabel(endStatementLabel));
  }

  /**
   * Compiles expressions.
   * 
   * @remarks
   * Need to return the register and allow it to be consumed only once.
   * 
   * @returns The result register
   */
  private compileExpression(expr: t.Expression): Register {
    switch (true) {
      case t.isIdentifier(expr): {
        switch (expr.name) {
          case "undefined": {
            const reg = this.registerAllocator.next();

            this.writeInstructions(this.createOp(OperatorCode.Void), this.createRegId(reg));

            return reg;
          }

          case "arguments": {
            const reg = this.registerAllocator.next();

            this.writeInstructions(this.createOp(OperatorCode.SetReg), this.createRegId(ARGUMENTS_REG), this.createRegId(reg));

            return reg;
          }

          case "Promise": {
            const reg = this.registerAllocator.next();

            this.writeInstructions(this.createOp(OperatorCode.Promise), this.createRegId(reg));

            return reg;
          }

          case REGENERATOR_RUNTIME_FUNCTION_IDENTIFIER: {
            const reg = this.registerAllocator.next();

            this.writeInstructions(this.createOp(OperatorCode.Regenerator), this.createRegId(reg));

            return reg;
          }

          // For fast run (probably unsafe)
          case "window": return this.globalRegister;

          default: {
            const reg = this.registerAllocator.next();

            if (this.scopedMemory.has(expr.name) === false) {
              // TODO: V8 throws error when unknown variable does not exists on global
              this.writeInstructions(this.createOp(OperatorCode.GetWindowProp), ...this.createLiteral(expr.name), this.createRegId(reg));
            } else {
              this.writeInstructions(this.createOp(OperatorCode.Load), ...this.compileMemory(expr.name), this.createRegId(reg));
            }

            return reg;
          }
        }
      }

      case t.isLiteral(expr): {
        const literalReg = this.registerAllocator.next();

        // TemplateLiteral | BigIntLiteral | DecimalLiteral already converted with plugin

        // Write operation
        this.writeInstructions(
          this.createOp(
            t.isRegExpLiteral(expr) ?
              OperatorCode.NewRegExp :
              OperatorCode.SetReg
          ),
        );

        if (t.isRegExpLiteral(expr)) {
          this.writeInstructions(...this.createLiteral(expr.pattern), ...this.createLiteral(expr.flags));
        } else if (t.isNumericLiteral(expr) || t.isStringLiteral(expr) || t.isBooleanLiteral(expr)) {
          this.writeInstructions(...this.createLiteral(expr.value));
        } else if (t.isNullLiteral(expr)) {
          this.writeInstructions(...this.createLiteral(null));
        } else {
          throw new Error(`Unsupported literal type: ${expr.type}`);
        }

        this.writeInstructions(this.createRegId(literalReg));

        return literalReg;
      }

      case t.isThisExpression(expr): {
        const reg = this.registerAllocator.next();

        this.writeInstructions(this.createOp(OperatorCode.GetCurrentThis), this.createRegId(reg));

        return reg;
      }

      case t.isArrayExpression(expr): {
        const { elements } = expr;

        const arrayReg = this.registerAllocator.next();

        if (elements.length === 0) {
          this.writeInstructions(this.createOp(OperatorCode.EmptyArray), this.createRegId(arrayReg));
        } else {
          this.writeInstructions(this.createOp(OperatorCode.NewArray), ...this.createLiteral(elements.length), this.createRegId(arrayReg));

          elements.forEach((element, i) => {
            if (element) {
              // We already converted spread with plugin
              const elementReg = this.compileExpression(element as t.Expression);

              this.writeInstructions(this.createOp(OperatorCode.Put), this.createRegId(arrayReg), ...this.createLiteral(i), this.createRegId(elementReg));

              // Free elementReg
              this.registerAllocator.free();
            }
          });
        }

        return arrayReg;
      }

      case t.isObjectExpression(expr): {
        const { properties } = expr;

        const objectReg = this.registerAllocator.next();

        this.writeInstructions(this.createOp(OperatorCode.EmptyObject), this.createRegId(objectReg));

        (properties as t.ObjectProperty[]).forEach(({ computed, key, value }) => {
          if (computed) {
            const keyReg = this.compileExpression(key as t.Expression);
            const valueReg = this.compileExpression(value as t.Expression);

            this.writeInstructions(
              this.createOp(OperatorCode.Put),
              this.createRegId(objectReg),
              this.createRegId(keyReg),
              this.createRegId(valueReg)
            );

            // Free keyReg/valueReg
            this.registerAllocator.free();
            this.registerAllocator.free();
          } else {
            const valueReg = this.compileExpression(value as t.Expression);

            const staticKeyOrDynamicKey =
              t.isIdentifier(key) ?
                this.createLiteral(key.name) :
                this.createLiteral((key as t.StringLiteral | t.NumericLiteral).value);

            this.writeInstructions(
              this.createOp(OperatorCode.Put),
              this.createRegId(objectReg),
              ...staticKeyOrDynamicKey,
              this.createRegId(valueReg),
            );

            // Free valueReg
            this.registerAllocator.free();
          }
        });

        return objectReg;
      }

      case t.isUnaryExpression(expr): {
        const { argument } = expr;

        const unaryReg = this.registerAllocator.next();

        switch (expr.operator) {
          case "+": {
            const valueReg = this.compileExpression(argument);

            this.writeInstructions(this.createOp(OperatorCode.Add), ...this.createLiteral(0), this.createRegId(valueReg));

            this.registerAllocator.free();

            break;
          }

          case "-": {
            const valueReg = this.compileExpression(argument);

            // TODO: zero should be minus zero, but zero
            this.writeInstructions(this.createOp(OperatorCode.Sub), ...this.createLiteral(0), this.createRegId(valueReg));

            this.registerAllocator.free();

            break;
          }

          case "!": {
            const valueReg = this.compileExpression(argument);

            this.writeInstructions(this.createOp(OperatorCode.Not), this.createRegId(valueReg));

            this.registerAllocator.free();

            break;
          }

          case "~": {
            const valueReg = this.compileExpression(argument);

            this.writeInstructions(this.createOp(OperatorCode.BNot), this.createRegId(valueReg));

            this.registerAllocator.free();

            break;
          }

          case "typeof": {
            const valueReg = this.compileExpression(argument);

            this.writeInstructions(this.createOp(OperatorCode.TypeOf), this.createRegId(valueReg));

            this.registerAllocator.free();

            break;
          }

          case "void": {
            this.compileExpression(argument);

            this.writeInstructions(this.createOp(OperatorCode.Void));

            this.registerAllocator.free();

            break;
          }

          case "delete": {
            if (t.isMemberExpression(argument)) {
              const objectReg = this.compileExpression(argument.object);

              let propertyReg = null;
              if (argument.computed) {
                propertyReg = this.compileExpression(argument.property as t.Expression);

                this.registerAllocator.free();
              }

              this.writeInstructions(this.createOp(OperatorCode.Delete));
              this.writeInstructions(this.createRegId(objectReg));
              if (propertyReg) {
                this.writeInstructions(this.createRegId(propertyReg));
              } else {
                this.writeInstructions(...this.createLiteral((argument.property as t.Identifier).name));
              }

              // Free objectReg
              this.registerAllocator.free();
            } else {
              this.writeInstructions(this.createOp(OperatorCode.SetReg), ...this.createLiteral(false));
            }

            break;
          }
        }

        this.writeInstructions(this.createRegId(unaryReg));

        return unaryReg;
      }

      case t.isBinaryExpression(expr): {
        const { right, left, operator } = expr;

        const op = Compiler.BINARY_OPCODES[operator];

        const leftReg = this.compileExpression(left as t.Expression);
        const rightReg = this.compileExpression(right);
        // Reuse rightReg
        const binaryReg = leftReg;

        // Free rightReg
        this.registerAllocator.free();
        // this.register.freeRegister();

        this.writeInstructions(this.createOp(op));

        this.writeInstructions(this.createRegId(leftReg), this.createRegId(rightReg), this.createRegId(binaryReg));

        return binaryReg;
      }

      case t.isUpdateExpression(expr): {
        const { argument, prefix, operator } = expr;

        const updateReg = this.registerAllocator.next();

        const op: OperatorCode = operator === "++" ? OperatorCode.Add : OperatorCode.Sub;
        const invertedOp: OperatorCode = operator === "++" ? OperatorCode.Sub : OperatorCode.Add;

        if (t.isIdentifier(argument)) {
          const argumentReg = this.compileExpression(argument);

          this.writeInstructions(this.createOp(op), this.createRegId(argumentReg), ...this.createLiteral(1), this.createRegId(updateReg));
          // OUT argument.name -> valueReg
          this.writeInstructions(this.createOp(OperatorCode.Out), ...this.compileMemory(argument.name), this.createRegId(updateReg));

          if (!prefix) {
            // SUB | ADD updateReg (- | +) 1 -> updateReg
            this.writeInstructions(
              this.createOp(invertedOp),
              this.createRegId(updateReg),
              ...this.createLiteral(1),
              this.createRegId(updateReg),
            );
          }

          // Free argumentReg
          this.registerAllocator.free();
        } else if (t.isMemberExpression(argument)) {
          const objectReg = this.compileExpression(argument.object);
          // Reuse updateReg
          const getValueReg = updateReg;

          let propertyReg = null;
          if (argument.computed) {
            propertyReg = this.compileExpression(argument.property as t.Expression);

            this.registerAllocator.free();
          }

          // GET objectReg[argument.property | argument.property.name] -> getValueReg
          this.writeInstructions(this.createOp(OperatorCode.Get));
          this.writeInstructions(this.createRegId(objectReg));
          if (propertyReg) {
            this.writeInstructions(this.createRegId(propertyReg));
          } else {
            this.writeInstructions(...this.createLiteral((argument.property as t.Identifier).name));
          }
          this.writeInstructions(this.createRegId(getValueReg));

          // op 1 (+ | -) getValueReg -> updateReg
          this.writeInstructions(this.createOp(op), this.createRegId(getValueReg), ...this.createLiteral(1), this.createRegId(updateReg));

          // PUT objectReg[argument.property | argument.property.name] = updateReg
          this.writeInstructions(this.createOp(OperatorCode.Put));
          this.writeInstructions(this.createRegId(objectReg));
          if (propertyReg) {
            this.writeInstructions(this.createRegId(propertyReg));
          } else {
            this.writeInstructions(...this.createLiteral((argument.property as t.Identifier).name));
          }
          this.writeInstructions(this.createRegId(updateReg));

          if (!prefix) {
            // SUB | ADD updateReg (- | +) 1 -> updateReg
            this.writeInstructions(
              this.createOp(invertedOp),
              this.createRegId(updateReg),
              ...this.createLiteral(1),
              this.createRegId(updateReg),
            );
          }

          // Free objectReg
          this.registerAllocator.free();
        }

        return updateReg;
      }

      case t.isAssignmentExpression(expr): {
        const { left, right, operator } = expr;

        const assignReg = this.registerAllocator.next();

        const op: OperatorCode = Compiler.ASSIGNMENT_OPCODES[operator];

        if (t.isIdentifier(left)) {
          if (operator === "=") {
            this.compileAssign(left, assignReg, () => {
              return this.compileExpression(right);
            }, true);
          } else {
            this.compileAssign(left, assignReg, () => {
              const leftReg = this.compileExpression(left);
              const rightReg = this.compileExpression(right);
              // Reuse leftReg
              const valueReg = leftReg;

              this.writeInstructions(this.createOp(op), this.createRegId(leftReg), this.createRegId(rightReg), this.createRegId(valueReg));

              // Free rightReg
              this.registerAllocator.free();

              return valueReg;
            }, false);
          }
        } else if (t.isMemberExpression(left)) {
          const objectReg = this.compileExpression(left.object);

          if (left.computed) {
            const rightReg = this.compileExpression(right);
            const propertyReg = this.compileExpression(left.property as t.Expression);

            if (operator === "=") {
              this.writeInstructions(this.createOp(OperatorCode.Put), this.createRegId(objectReg), this.createRegId(propertyReg), this.createRegId(rightReg));
              this.writeInstructions(this.createOp(OperatorCode.SetReg), this.createRegId(rightReg), this.createRegId(assignReg));
            } else {
              const valueReg = this.registerAllocator.next();

              this.writeInstructions(this.createOp(OperatorCode.Get), this.createRegId(objectReg), this.createRegId(propertyReg), this.createRegId(valueReg));
              this.writeInstructions(this.createOp(op), this.createRegId(valueReg), this.createRegId(rightReg), this.createRegId(valueReg));
              this.writeInstructions(this.createOp(OperatorCode.Put), this.createRegId(objectReg), this.createRegId(propertyReg), this.createRegId(valueReg));
              this.writeInstructions(this.createOp(OperatorCode.SetReg), this.createRegId(valueReg), this.createRegId(assignReg));

              // Free valueReg
              this.registerAllocator.free();
            }

            // Free rightReg/propertyReg
            this.registerAllocator.free();
            this.registerAllocator.free();
          } else {
            const rightReg = this.compileExpression(right);
            const property = this.createLiteral((left.property as t.Identifier).name);

            if (operator === "=") {
              this.writeInstructions(this.createOp(OperatorCode.Put), this.createRegId(objectReg), ...property, this.createRegId(rightReg));
              this.writeInstructions(this.createOp(OperatorCode.SetReg), this.createRegId(rightReg), this.createRegId(assignReg));
            } else {
              const valueReg = this.registerAllocator.next();

              // Get the property value, then
              this.writeInstructions(this.createOp(OperatorCode.Get), this.createRegId(objectReg), ...property, this.createRegId(valueReg));
              // Apply op value to getted value
              this.writeInstructions(this.createOp(op), this.createRegId(valueReg), this.createRegId(rightReg), this.createRegId(valueReg));
              // And push back value
              this.writeInstructions(this.createOp(OperatorCode.Put), this.createRegId(objectReg), ...property, this.createRegId(valueReg));
              // Copy value to assignReg
              this.writeInstructions(this.createOp(OperatorCode.SetReg), this.createRegId(valueReg), this.createRegId(assignReg));

              // Free valueReg
              this.registerAllocator.free();
            }

            // Free rightReg
            this.registerAllocator.free();
          }

          // Free objectReg
          this.registerAllocator.free();
        }

        return assignReg;
      }

      case t.isLogicalExpression(expr): {
        const { left, right, operator } = expr;

        const leftReg = this.compileExpression(left);

        const endLabel = this.createLabelName();

        this.writeInstructions(
          this.createOp(operator === "&&" ? OperatorCode.JumpIfFalse : OperatorCode.JumpIfTrue),
          this.createReference(endLabel),
          this.createRegId(leftReg),
        );

        // Logical right not consumed when left is truthy|falsy
        const rightReg = this.compileExpression(right);

        this.writeInstructions(this.createOp(OperatorCode.SetReg), this.createRegId(rightReg), this.createRegId(leftReg));

        this.writeInstructions(this.createLabel(endLabel));

        // Free rightReg
        this.registerAllocator.free();

        return leftReg;
      }

      case t.isMemberExpression(expr): {
        const objectReg = this.compileExpression(expr.object);
        // Reuse objectReg
        const memberReg = objectReg;

        let propertyReg = null;
        if (expr.computed) {
          propertyReg = this.compileExpression(expr.property as t.Expression);

          this.registerAllocator.free();
        }

        // GET objectReg[property | property.name] -> memberReg
        this.writeInstructions(this.createOp(OperatorCode.Get));
        this.writeInstructions(this.createRegId(objectReg));
        if (propertyReg) {
          this.writeInstructions(this.createRegId(propertyReg));
        } else {
          this.writeInstructions(...this.createLiteral((expr.property as t.Identifier).name));
        }
        this.writeInstructions(this.createRegId(memberReg));

        // Free objectReg
        // this.register.freeRegister();

        return memberReg;
      }

      case t.isConditionalExpression(expr): {
        const { test, consequent, alternate } = expr;

        const testReg = this.compileExpression(test);
        // Reuse testReg
        const assignReg = testReg;

        const endLabel = this.createLabelName();
        const altLabel = this.createLabelName();

        // JUMP_IF_FALSE testReg : ip = altLabel
        this.writeInstructions(this.createOp(OperatorCode.JumpIfFalse), this.createReference(altLabel), this.createRegId(testReg));

        // Compile consequent if test is true
        const consequentReg = this.compileExpression(consequent)
        this.writeInstructions(this.createOp(OperatorCode.SetReg), this.createRegId(consequentReg), this.createRegId(assignReg));
        this.writeInstructions(this.createOp(OperatorCode.Jump), this.createReference(endLabel));

        // Compile alternate if test is false
        this.writeInstructions(this.createLabel(altLabel));
        const alternateReg = this.compileExpression(alternate);
        this.writeInstructions(this.createOp(OperatorCode.SetReg), this.createRegId(alternateReg), this.createRegId(assignReg));

        this.writeInstructions(this.createLabel(endLabel));

        // Free consequent/alternate
        this.registerAllocator.free();
        this.registerAllocator.free();

        return assignReg;
      }

      case t.isCallExpression(expr): {
        const { callee, arguments: args } = expr;

        const callReg = this.registerAllocator.next();

        if (t.isMemberExpression(callee)) {
          const { object, property, computed } = callee;

          const objectReg = this.compileExpression(object);
          const argsReg = this.compileExpression(t.arrayExpression(args as t.Expression[]));

          const funcReg = this.registerAllocator.next();

          let propertyReg = null;
          if (computed) {
            propertyReg = this.compileExpression(property as t.Expression);

            this.registerAllocator.free();
          }

          // GET objectReg[property | property.name] -> funcReg
          this.writeInstructions(this.createOp(OperatorCode.Get));
          this.writeInstructions(this.createRegId(objectReg));
          if (propertyReg) {
            this.writeInstructions(this.createRegId(propertyReg));
          } else {
            this.writeInstructions(...this.createLiteral((property as t.Identifier).name));
          }
          this.writeInstructions(this.createRegId(funcReg));

          // CALL funcReg.apply(objectReg, argsReg)
          this.writeInstructions(this.createOp(OperatorCode.Call), this.createRegId(argsReg), this.createRegId(funcReg), this.createRegId(objectReg));

          // Free args/funcReg/objectReg
          this.registerAllocator.free();
          this.registerAllocator.free();
          this.registerAllocator.free();

          // Push call result
          this.functionReturn = callReg;
        } else {
          // Normal call this are global
          if (isFiniteLikeCallOperatorCodeArgumentCounts(args.length)) {
            const funcReg = this.compileExpression(callee as t.Expression);

            const argsReg: Array<IROpcode> = new Array<IROpcode>(args.length);
            args.forEach((arg, i) => argsReg[i] = this.createRegId(this.compileExpression(arg as t.Expression)));

            // CALL_FUNCTION_XARG funcReg(...args) -> callReg
            this.writeInstructions(this.createOp(getFiniteLikeCallOperator(args.length)), this.createRegId(funcReg), ...argsReg, this.createRegId(callReg));

            // Free args
            args.forEach(() => this.registerAllocator.free());

            // Free funcReg
            this.registerAllocator.free();
          } else {
            const funcReg = this.compileExpression(callee as t.Expression);
            const argsReg = this.compileExpression(t.arrayExpression(args as t.Expression[]));

            const thisReg = this.globalRegister;

            // CALL funcReg.apply(thisReg, argsReg)
            this.writeInstructions(this.createOp(OperatorCode.Call), this.createRegId(argsReg), this.createRegId(funcReg), this.createRegId(thisReg));

            // Free args/thisReg/funcReg
            this.registerAllocator.free();
            this.registerAllocator.free();
            this.registerAllocator.free();

            // Push call result
            this.functionReturn = callReg;
          }
        }

        return callReg;
      }

      case t.isNewExpression(expr): {
        const { callee, arguments: args } = expr;

        const constructorReg = this.compileExpression(callee as t.Expression);
        const argsReg = this.compileExpression(t.arrayExpression(args as t.Expression[]));
        // Reuse argsReg
        const newReg = constructorReg;

        this.writeInstructions(this.createOp(OperatorCode.New), this.createRegId(constructorReg), this.createRegId(argsReg), this.createRegId(newReg));

        // Free argsReg
        this.registerAllocator.free();
        // this.register.freeRegister();

        return newReg;
      }

      case t.isSequenceExpression(expr): {
        const { expressions } = expr;

        for (let i = 0; i < expressions.length; i++) {
          if (i === expressions.length - 1) {
            return this.compileExpression(expressions[i]);
          } else {
            this.compileStatement(t.expressionStatement(expressions[i]))
          }
        }

        break;
      }

      case t.isFunctionExpression(expr): {
        const { label, params, functionId } = expr;

        const funcReg = this.registerAllocator.next();

        this.writeInstructions(
          this.createOp(OperatorCode.Func),
          this.createReference(label),
          ...this.createLiteral(params.length),
          ...this.createLiteral("" /* expr.id ? expr.id.name : null */),
          this.createRegId(funcReg),
        );

        if (functionId) {
          this.writeInstructions(this.createOp(OperatorCode.SetValue), ...this.createLiteral(functionId), this.createRegId(funcReg));
        }

        return funcReg;
      }

      case !expr: { break }

      default: {
        throw new Error(`Unsupported expression type: ${expr}`);
      }
    }
  }

  /**
   * Compiles compilable block.
   */
  private compileBlock(block: CompilableBlock) {
    this.writeInstructions(this.createLabel(block.label));

    switch (true) {
      case t.isProgram(block): {
        // Set global element which used for global assign
        // to reduce performance reducation
        {
          const globalReg = this.registerAllocator.next();

          this.writeInstructions(
            this.createOp(OperatorCode.GetWindowProp),
            ...this.createLiteral("window"),
            this.createRegId(globalReg),

            this.createOp(OperatorCode.SetValue),
            ...this.createLiteral(this.memoryDictionary.get("GLOBAL")),
            this.createRegId(globalReg),
          );

          // Free globalReg
          this.registerAllocator.free();
        }

        // Init declare all variable declrations (only var kinds are declared)
        block.declarations.forEach(name => this.writeInstructions(this.createOp(OperatorCode.SetVoid), ...this.compileMemory(name)));

        // Assume program body as block statement, compile all statements
        this.compileStatement(t.blockStatement(block.body));

        // Execution end, terminate program
        this.writeInstructions(this.createOp(OperatorCode.Term));

        break;
      }

      case t.isFunctionExpression(block):
      case t.isFunctionDeclaration(block): {
        const stackRegister = this.registerAllocator.get();

        this.registerAllocator.set(
          createRegister(registerToNumber(ARGUMENTS_SPREAD_REG) + block.params.length),
        );

        // Define all parameters
        for (let i = 0; i < block.params.length; i++) {
          const { name } = block.params[i] as t.Identifier;
          this.writeInstructions(
            this.createOp(OperatorCode.SetValue),
            ...this.compileMemory(name),
            this.createRegId(
              createRegister(registerToNumber(ARGUMENTS_SPREAD_REG) + i),
            ),
          );
        };

        // Define function for function expression
        if (
          t.isFunctionExpression(block) &&
          // If function expression has name, declare it
          block.functionId
        ) {
          const funcReg = this.registerAllocator.next();

          this.writeInstructions(
            this.createOp(OperatorCode.Load),
            ...this.createLiteral(block.functionId),
            this.createRegId(funcReg),

            this.createOp(OperatorCode.SetValue),
            ...this.compileMemory(block.id.name),
            this.createRegId(funcReg),
          );

          // Free funcReg
          this.registerAllocator.free();
        }

        // Init declare all variable declrations (only var kinds are declared)
        block.declarations.forEach(name => this.writeInstructions(this.createOp(OperatorCode.SetVoid), ...this.compileMemory(name)));

        // Compile block body
        this.compileStatement(block.body);

        // Return void at end (RETURN_VALUE will execute if there is)
        this.writeInstructions(this.createOp(OperatorCode.ReturnVoid));

        // Set register to previous
        this.registerAllocator.set(stackRegister);

        break;
      }
    }
  }

  /**
   * Compile AST (from source) to IRs and push them into instructions.
   * 
   * @param source - The source code
   */
  public compile(source: string) {
    this.reset();

    // Parse code, then compile all compilable blocks
    const blocks = this.parser.parse(source);

    blocks.forEach(this.compileBlock.bind(this));
  }

  /**
   * Construct the bytecode from current compiler instructions.
   * 
   * @remarks
   * You must call {compile(source)} before call this.
   * 
   * @returns - Constructed bytecode
   */
  public constructBytecode(): Bytecode {
    const bytecode: Bytecode = new Array();

    bytecode.push(0);

    const labelMap = new Map<string, { address: number; references: number[] }>();

    const joinedStringTable = shuffle(Array.from(this.stringTable.values())).join("");
    const stringIndexMap = new Map<string, number>();

    this.stringTable.forEach((str) => {
      if (!stringIndexMap.has(str)) {
        stringIndexMap.set(str, joinedStringTable.indexOf(str));
      }
    });

    this.instructions.forEach(inst => {
      switch (inst.type) {
        case labelSymbol: {
          const label = labelMap.get(inst.label) ?? {
            address: 0,
            references: [],
          };
          label.address = bytecode.length;
          labelMap.set(inst.label, label);

          break;
        }

        case referenceSymbol: {
          const label = labelMap.get(inst.label) ?? {
            address: 0,
            references: [],
          };
          label.references.push(bytecode.length);
          // Offset placeholder
          bytecode.push(0);
          labelMap.set(inst.label, label);

          break;
        }

        case opcodeSymbol: {
          bytecode.push(inst.opcode);

          break;
        }

        case numericalDataSymbol: {
          bytecode.push(...inst.data);

          break;
        }

        case stringDataSymbol: {
          bytecode.push(OperatorCode.StoreOrLoadStr, stringIndexMap.get(inst.data) ?? joinedStringTable.indexOf(inst.data), inst.data.length);

          break;
        }
      }
    });

    labelMap.forEach(({ address, references }) => {
      const newAddress = this.encodeSafeInteger(address);
      references.forEach(offset => bytecode[offset] = newAddress);
    });

    // Load string operation
    bytecode.push(OperatorCode.StoreOrLoadStr);
    const indexAtStringDataLength = bytecode.length - 1;
    bytecode.push(joinedStringTable.length);
    for (const c of joinedStringTable) {
      bytecode.push(this.encodeCharCode(c.charCodeAt(0)));
    };
    bytecode.push(indexAtStringDataLength ^ (bytecode.length + 1 + /* literally adds "true" length */ 4));

    return bytecode;
  }

  /**
   * Encode value to x & 0xFFFFFFC0 | x * 39 & 0x3F format.
   */
  @Memoize()
  private encodeCharCode(c: number): number {
    const upper26 = c & 0xFFFFFFC0;
    const lower6 = c & 0x3F;

    for (let i = 0; i < 64; i++) {
      if ((i * 39 & 0x3F) === lower6) {
        return (i & 0x3F) | upper26;
      }
    }

    throw new Error(`Failed to encode charcode ${c}`);
  }

  /**
   * Encodes float64 to decodable numbers.
   */
  @Memoize()
  private encodeFloat64(f64: number): [number, number] {
    floatView[0] = f64;
    return [intView[1], intView[0]];
  }

  /**
   * Encodes number into x >> 1 decodable format.
   */
  @Memoize()
  private encodeSafeInteger(num: number): number {
    return num * 2 + 1;
  }

  /**
   * Make register id.
   */
  @Memoize()
  private createRegId(r: Register): IROpcode {
    return this.createOp(r << 5);
  }

  /**
   * Set function call result to given register r.
   */
  private set functionReturn(r: Register) {
    this.writeInstructions(
      this.createOp(OperatorCode.SetReg),
      this.createRegId(FUNCTION_RESULT_REG),
      this.createRegId(r),
    );
  }

  /**
   * Get the global object (window) then return the register of global object.
   */
  private get globalRegister(): Register {
    const reg = this.registerAllocator.next();

    this.writeInstructions(
      this.createOp(OperatorCode.Load),
      ...this.createLiteral(this.memoryDictionary.get("GLOBAL")),
      this.createRegId(reg),
    );

    return reg;
  }
}