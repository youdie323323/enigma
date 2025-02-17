export { default } from "./Instruction";

export {
    FUNCTION_RESULT_REG,
    ARGUMENTS_REG,
    ARGUMENTS_SPREAD_REG,
    OperatorCode,
    NUM_OP_CODES,
    NumOpCodes,
} from "./InstructionOperatorCode";

export {
    instructionSet,
    getInstructionFromOpcode,
    compileASTInstructionHandlers as generateASTInstructionHandlers,
} from "./InstructionSet";