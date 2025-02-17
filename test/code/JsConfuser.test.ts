import { readFileSync } from "fs";
import { join } from "path";
import { executeCode, window } from "../__setup__";

const JS_CONFUSER_JS = readFileSync(join(__dirname, "./JsConfuser.src.js"), "utf-8");

test("JsConfuser.js", async () => {
    await executeCode(JS_CONFUSER_JS);

    expect(window).toHaveProperty("result");
    expect(window.result).toBe("Hello Internet User!");
});