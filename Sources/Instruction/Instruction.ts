import { OperatorCode } from "../Compiler/CompilerOperatorCode";
import Template from "../Interpreter/Builder/Templates/Template";
import { InstructionAccesibleVariableEnvironment } from "./InstructionAccesibleVariableEnvironment";

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
    templateFn(variableNames: InstructionAccesibleVariableEnvironment): Template;
}