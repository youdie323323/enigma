import { executeCode, window } from "./__setup__";

describe("Switch statement tests", () => {
    test("Switch cases should work correctly", async () => {
        await executeCode(`
            const expr = 'Papayas';
            switch (expr) {
                case 'Oranges':
                    window.unexpectedResult = true;
                    break;
                case 'Mangoes':
                case 'Papayas':
                    window.result = true;
                    break;
                default:
                    window.unexpectedResult = true;
            }
        `);

        expect(window).toHaveProperty("result");
        expect(window.result).toBe(true);
        expect(window).not.toHaveProperty("unexpectedResult");
    });

    test("Cases can access variables", async () => {
        await executeCode(`
            const expr = 'Oranges';
            switch (expr) {
                case 'Oranges':
                    var res = true;
                case 'Mangoes':
                case 'Papayas':
                    window.result = res;
                    break
                default:
                    window.unexpectedResult = true;
            }
        `);

        expect(window).toHaveProperty("result");
        expect(window.result).toBe(true);
        expect(window).not.toHaveProperty("unexpectedResult");
    });
});