import type { AddSuffix, InterpreterDefaultEnvironment } from "../Interpreter/Builder/InterpreterDefaultEnvironment";

export type InstructionArgumentEnvironment = Readonly<AddSuffix<{
    state: string;
    pop: string;
    push: string;
    stateIndex1Getter: string;
    bigObjectLikeInstances: string;
    stateRelatedFunctions: string;
}, "Arg">>;

export type InstructionAccesibleEnvironment = InterpreterDefaultEnvironment & InstructionArgumentEnvironment;