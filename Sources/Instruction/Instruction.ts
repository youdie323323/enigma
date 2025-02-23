import { OperatorCode } from "../Compiler/CompilerOperatorCode";
import Template from "../Interpreter/Builder/Templates/Template";
import type { InstructionAccesibleEnvironment } from "./InstructionAccesibleEnvironment";

export default interface Instruction {
    /**
     * Opcode for this operation.
     */
    readonly opcode: OperatorCode;

    /**
     * Number of required args, of generated function body with templateFn().
     */
    readonly requiredArgs: number;

    /**
     * Generate ast of operation handler.
     */
    templateFn(env: InstructionAccesibleEnvironment): Template;
}