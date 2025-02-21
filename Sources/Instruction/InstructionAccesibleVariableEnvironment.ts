import { InterpreterDefaultVariableEnvironment } from "../Interpreter/Builder/InterpreterDefaultVariableEnvironment";

export type InstructionVariableEnvironment = Readonly<{
    stateArgument: string;
    popArgument: string;
    pushArgument: string;
    stateIndex1GetterArgument: string;
    bigObjectLikeInstancesArgument: string;
    stateRelatedFunctionsArgument: string;
}>;

export type InstructionAccesibleVariableEnvironment = InterpreterDefaultVariableEnvironment & InstructionVariableEnvironment;