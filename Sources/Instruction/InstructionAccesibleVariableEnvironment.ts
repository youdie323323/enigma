import { InterpreterDefaultVariableEnvironment } from "../Interpreter/Builder/InterpreterDefaultVariableEnvironment";

type AddSuffix<T, Suffix extends string> = {
    [K in keyof T as `${K & string}${Suffix}`]: T[K];
};

export type InstructionArgumentEnvironment = Readonly<AddSuffix<{
    state: string;
    pop: string;
    push: string;
    stateIndex1Getter: string;
    bigObjectLikeInstances: string;
    stateRelatedFunctions: string;
}, "Arg">>;

export type InstructionAccesibleVariableEnvironment = InterpreterDefaultVariableEnvironment & InstructionArgumentEnvironment;