import { executeCode, window } from "./__setup__";

describe("Unary operator tests", () => {
    describe("Typeof operator tests", () => {
        test("Typeof on various values should work correctly", async () => {
            await executeCode(`
                window.result = typeof undefined;
                window.result2 = typeof null;
                window.result3 = typeof true;
                window.result4 = typeof 42;
                window.result5 = typeof "hello";
                window.result6 = typeof {};
                window.result7 = typeof [];
                window.result8 = typeof function(){};
                window.result9 = typeof Symbol();
            `);

            expect(window.result).toBe("undefined");
            expect(window.result2).toBe("object");
            expect(window.result3).toBe("boolean");
            expect(window.result4).toBe("number");
            expect(window.result5).toBe("string");
            expect(window.result6).toBe("object");
            expect(window.result7).toBe("object");
            expect(window.result8).toBe("function");
            expect(window.result9).toBe("symbol");
        });

        test("Typeof on undefined variables and properties should work correctly", async () => {
            await executeCode(`
                var whatever;
                window.result = typeof undefined;
                window.result2 = typeof whatever;
                window.result3 = typeof nonExistent;
                whatever = {};
                window.result4 = typeof whatever.missingProp;
                whatever = [];
                window.result5 = typeof whatever[10];
            `);

            expect(window.result).toBe("undefined");
            expect(window.result2).toBe("undefined");
            expect(window.result3).toBe("undefined");
            expect(window.result4).toBe("undefined");
            expect(window.result5).toBe("undefined");
        });
    });

    describe("Other unary operator tests", () => {
        test("Unary plus and minus should work correctly", async () => {
            await executeCode(`
                window.result = +42;
                window.result2 = +"42";
                window.result3 = -42;
                window.result4 = -"42";
                window.result5 = +true;
                window.result6 = -false;
            `);

            expect(window.result).toBe(42);
            expect(window.result2).toBe(42);
            expect(window.result3).toBe(-42);
            expect(window.result4).toBe(-42);
            expect(window.result5).toBe(1);
            expect(window.result6).toBe(-0);
        });

        test("Logical not operator should work correctly", async () => {
            await executeCode(`
                window.result = !true;
                window.result2 = !false;
                window.result3 = !0;
                window.result4 = !1;
                window.result5 = !"";
                window.result6 = !"hello";
                window.result7 = !null;
                window.result8 = !undefined;
            `);

            expect(window.result).toBe(false);
            expect(window.result2).toBe(true);
            expect(window.result3).toBe(true);
            expect(window.result4).toBe(false);
            expect(window.result5).toBe(true);
            expect(window.result6).toBe(false);
            expect(window.result7).toBe(true);
            expect(window.result8).toBe(true);
        });

        test("Bitwise not operator should work correctly", async () => {
            await executeCode(`
                window.result = ~0;
                window.result2 = ~1;
                window.result3 = ~-1;
                window.result4 = ~42;
            `);

            expect(window.result).toBe(-1);
            expect(window.result2).toBe(-2);
            expect(window.result3).toBe(0);
            expect(window.result4).toBe(-43);
        });

        test("Delete operator should work correctly", async () => {
            await executeCode(`
                let obj = { a: 1, b: 2 };
                window.result = delete obj.a;
                window.result2 = obj.a;
                window.result3 = obj.b;
            `);

            expect(window.result).toBe(true);
            expect(window.result2).toBe(undefined);
            expect(window.result3).toBe(2);
        });

        test("Void operator should work correctly", async () => {
            await executeCode(`
                window.result = void 0;
                window.result2 = void 42;
                window.result3 = void "hello";
            `);

            expect(window.result).toBe(undefined);
            expect(window.result2).toBe(undefined);
            expect(window.result3).toBe(undefined);
        });
    });
});