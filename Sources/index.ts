import Compiler from "./Compiler";
import InterpreterBuilder from "./Interpreter/Builder";
import { DeepPartial, DeepReadonly } from "ts-essentials";

export type CompileOptions = DeepPartial<
    DeepReadonly<{
        /**
         * Strip function names on compilation or not.
         */
        stripFunctionName: boolean;
    }>
>;

export type BuildingOptions = DeepPartial<
    DeepReadonly<{
        /**
         * Should remove licenses from builded code or not.
         */
        removeLicenseComments: boolean;
    }>
>;

export type ObfuscateOptions = Partial<
    Readonly<{
        compileOptions: CompileOptions;
        buildOptions: BuildingOptions;
    }>
>;

// Default option values

const defaultCompileOptions: CompileOptions = {
    stripFunctionName: true,
};

const defaultBuildOptions: BuildingOptions = {
    removeLicenseComments: false,
};

const interpreterBuilder = new InterpreterBuilder();
const compiler = new Compiler();

export async function obfuscate(
    code: string,
    { compileOptions = {}, buildOptions = {} }: ObfuscateOptions = {},
): Promise<string> {
    const finalCompileOptions = { ...defaultCompileOptions, ...compileOptions };
    const finalBuildOptions = { ...defaultBuildOptions, ...buildOptions };

    compiler.compile(code, finalCompileOptions);
    const bytecode = compiler.constructBytecode();
    
    return interpreterBuilder.build(bytecode, finalBuildOptions);
}

// Export all the types from the index file
export { default as InterpreterBuilder } from "./Interpreter/Builder";
export { default as Compiler } from "./Compiler";