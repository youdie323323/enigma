import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { compiler, deleteTestResult, programBuilder, window } from "../__setup__";

const SOURCE_JS = readFileSync(join(__dirname, "./Dynamic.src.js"), "utf-8");

test("Dynamic.src.js", async () => {
    var value = "never_called";
    function input(x) {
        value = x;
    }
    window.input = input;

    // Ensure all tests result deleted before
    beforeEach(deleteTestResult);

    // Eval depends on scope, so we can expand code within here instead using executeCode
    compiler.compile(SOURCE_JS);

    const bytecode = compiler.constructBytecode();
    const compiledCode = await programBuilder.build(bytecode);

    try {
        eval(compiledCode);
    } catch (e) {
        console.error(e);
        writeFileSync("dev.output.js", compiledCode, {
            encoding: "utf-8",
        });
        expect(true).toStrictEqual(false);
    }

    expect(value).toStrictEqual(1738.1738);
});