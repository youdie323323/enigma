import { executeCode, window } from "./__setup__";

describe("Variable tests", () => {
    test("Variables can read & write correctly", async () => {
        await executeCode(`
            var res = true;
            window.result = res;
        `);

        expect(window).toHaveProperty("result");
        expect(window.result).toBe(true);
    });

    test("Unknown variable will read & write to global", async () => {
        await executeCode(`
            result = JSON;
        `);

        expect(window).toHaveProperty("result");
        expect(window.result).toBe(window.JSON);
    });
});