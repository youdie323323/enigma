export type AddSuffix<T, Suffix extends string> = {
    [K in keyof T as `${K & string}${Suffix}`]: T[K];
};

// This is property key and not actually value (not variable)
export type PropertyKeyEnvironment = AddSuffix<{
    currentThis: string;
    
    stateArray: string;

    anyObjectPropSub: string;
    errorObject: string;
    funcResultObject: string;

    parentMemory: string;

    memory: string;
    caller: string;

    stringDump: string;
    stringSlicer: string;

    catchAddress: string;
    finallyAddress: string;

    // This prop key will dynamically constructed on run and should be StringVariableEnvironment,
    // but this is easier to understand, so ill just do this
    randomFunc: string;
    randomFuncPropAddr: string;
    randomFuncPropFunc: string;
}, "PropKey">;

// Global registered array variables
export type ArrayVariableEnvironment = AddSuffix<{
    literalIds: string;

    decodedBytecode: string;

    instructionSet: string;
}, "Array">;

// Global registered string variables
export type StringVariableEnvironment = AddSuffix<{
    // randomFunc: string;

    bytecode: string;

    literallyLength: string;
}, "String">;

// Global registered number variables
export type NumberVariableEnvironment = AddSuffix<{
    decodedBytecodeLength: string;
    decodedBytecodeLengthAndTrueLength: string;
}, "Number">;

// Global registered function variables
export type FunctionVariableEnvironment = AddSuffix<{
    decoder: string;

    vmState: string;

    pop: string;
    push: string;

    dispatcher: string;

    literalLoader: string;
    literalLoaderAlias: string;

    exceptionHandler: string;

    stateIndex1Getter: string;

    bytecodeReturn: string;

    loadRegister: string;
}, "Function">;

// Global registered object variables
export type ObjectVariableEnvironment = AddSuffix<{
    // A object that include stringDump(PropKey) and stringSlicer(PropKey)
    string: string;

    // A primitive virtual machine state
    vmState: string;

    global: string;

    promise: string;
    regeneratorRuntime: string;
}, "Object">;

export type InterpreterDefaultEnvironment = Readonly<
    PropertyKeyEnvironment &
    ArrayVariableEnvironment &
    StringVariableEnvironment &
    NumberVariableEnvironment &
    FunctionVariableEnvironment &
    ObjectVariableEnvironment
>;