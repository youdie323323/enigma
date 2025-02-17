import { executeCode, window } from "./__setup__";

describe("Scope tests", () => {
    test("Member call object must compiled first", async () => {
        await executeCode(`
            const someValue = function () {
                window.result = this === someValue;
            };

            var r;

            (r = someValue).apply(r, []);
        `);

        expect(window.result).toBeTruthy();
    });

    test("Normal call callee must compiled first", async () => {
        await executeCode(`
            const someValue = function (a) {
              window.result = a === r;
            };

            var r;

            // Ensure 4+ args
            (r = someValue)(r, r, r, r);
        `);

        expect(window.result).toBeTruthy();
    });

    test("CALL_FUNCTION_XARG call callee must compiled first", async () => {
        await executeCode(`
            const someValue = function (a) {
              window.result = a === r;
            };

            var r;

            // Ensure 3 <= args
            (r = someValue)(r, r, r);
        `);

        expect(window.result).toBeTruthy();
    });
});