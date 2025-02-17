import { readFileSync } from "fs";
import { join } from "path";
import { executeCode, window } from "../__setup__";

const PROTOBUF_JS = readFileSync(join(__dirname, "./Protobuf.src.js"), "utf-8");

test("Protobuf.js", async () => {
    await executeCode(PROTOBUF_JS);

    expect(window).toHaveProperty("result");
    expect(window.result).toBe("name,id,emailjohn doe,99,test@example.com");
});