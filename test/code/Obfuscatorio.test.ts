import { readFileSync } from "fs";
import { join } from "path";
import { executeCode, window } from "../__setup__";

const OBFUSCATOR_IO_JS = readFileSync(join(__dirname, "./Obfuscatorio.src.js"), "utf-8");

test("Obfuscatorio.js", async () => {
    await executeCode(OBFUSCATOR_IO_JS);

    expect(window).toHaveProperty("result");
    expect(window.result).toBe("Hello World!");
});