import { executeCode, window } from "./__setup__";

describe("Update operator tests", () => {
    test("Update should work correctly", async () => {
        await executeCode(`
            var baseValue = 19194545;
            window.result = baseValue++;
            window.result2 = ++baseValue;
            window.result3 = baseValue--;
            window.result4 = --baseValue;
        `);

        expect(window).toHaveProperty("result");
        expect(window).toHaveProperty("result2");
        expect(window).toHaveProperty("result3");
        expect(window).toHaveProperty("result4");
        expect(window.result).toBe(19194545);
        expect(window.result2).toBe(19194547);
        expect(window.result3).toBe(19194547);
        expect(window.result4).toBe(19194545);
    });
});