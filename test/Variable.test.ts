import { executeCode, executeShouldThrownCode, window } from "./__setup__";

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

    test("let variables respect block scope", async () => {
        await executeCode(`
            let blockScoped = 'outside';
            {
                let blockScoped = 'inside';
                window.innerResult = blockScoped;
            }
            window.outerResult = blockScoped;
        `);

        expect(window.innerResult).toBe('inside');
        expect(window.outerResult).toBe('outside');
    });

    // This can detectable on parse phase, ignore
    /*
    test("const variables cannot be reassigned", async () => {
        const thrownError = await executeShouldThrownCode(`
            const constant = 42;
            constant = 43;
        `);
    });
    */

    test("var variables are hoisted", async () => {
        await executeCode(`
            window.result = typeof myVar;
            var myVar = "defined later";
        `);

        expect(window.result).toBe("undefined");
    });

    test("Variable shadowing with different scopes", async () => {
        await executeCode(`
            var x = 'global';
            function test() {
                var x = 'local';
                window.localResult = x;
            }
            test();
            window.globalResult = x;
        `);

        expect(window.localResult).toBe('local');
        expect(window.globalResult).toBe('global');
    });

    test("Global object properties as variables", async () => {
        await executeCode(`
            window.testVar = 'global value';
            var result = testVar;
            window.result = result;
        `);

        expect(window.result).toBe('global value');
    });
});