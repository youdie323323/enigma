import { writeFileSync } from "fs";
import Compiler from "../Sources/Compiler";
import ProgramBuilder from "../Sources/ProgramBuilder";

export let window: any;
export let compiler: Compiler;
export let programBuilder: ProgramBuilder;

const originalWindowProps: Set<string> = new Set();

type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
};

beforeAll(() => {
    // Setup global envroiments
    const document = {
        documentElement: {},
        createElement: () => ({ style: {} }),
    } satisfies DeepPartial<Document>;

    window = {
        document,
        Array, Object, Symbol, Number, Boolean, String, Date, RegExp, Error,
        Math, JSON, Promise,
        Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array,
        Int32Array, Uint32Array, Float32Array, Float64Array, BigInt64Array,
        BigUint64Array, parseInt, parseFloat, isNaN, isFinite, decodeURI,
        decodeURIComponent, encodeURI, encodeURIComponent, escape, unescape,
        eval, setTimeout, clearTimeout, setInterval, clearInterval,
        Map, Set, WeakMap, WeakSet, ArrayBuffer, SharedArrayBuffer,
        Atomics, DataView, Intl, WebAssembly, Function, BigInt,
        Reflect, Proxy, $: false,
    };

    window.window = window;
    global.window = window;
    for (var key in window) {
        global[key] = window[key];
    }

    Object.keys(window).forEach(prop => {
        originalWindowProps.add(prop);
    });

    compiler = new Compiler();
    programBuilder = new ProgramBuilder();
});

function safelyEndTesting(failedCode: string, failError: Error): void {
    writeFileSync("dev.output.js", failedCode, {
        encoding: "utf-8",
    });

    throw failError;

    expect(true).toStrictEqual(false);
}

export const deleteTestResult = (): void => {
    const currentProps = Object.keys(window);

    currentProps.forEach(prop => {
        if (!originalWindowProps.has(prop)) {
            delete window[prop];
        }
    });
};

export const executeCode = async (code: string): Promise<void> => {
    // Ensure all tests result deleted before
    deleteTestResult();

    compiler.compile(code);

    const bytecode = compiler.constructBytecode();
    const compiledCode = await programBuilder.build(bytecode);

    try {
        eval(compiledCode);
    } catch (e) {
        console.error(e);
        safelyEndTesting(compiledCode, new Error("Error while evaluating"));
    }
};

export const executeShouldThrownCode = async (code: string): Promise<unknown> => {
    // Ensure all tests result deleted before
    deleteTestResult();

    let thrownError: unknown;

    compiler.compile(code);

    const bytecode = compiler.constructBytecode();
    const compiledCode = await programBuilder.build(bytecode);

    try {
        eval(compiledCode);
        safelyEndTesting(compiledCode, new Error("The code must throw error, but its not"));
    } catch (e) {
        thrownError = e;
    }

    return thrownError;
};