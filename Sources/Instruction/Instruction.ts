import Template from "../Templates/Template";
import { OperatorCode } from "./";

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
    templateFn(variableNames: Map<string, string>): Template;
}