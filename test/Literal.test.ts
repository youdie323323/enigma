import { executeCode, window } from "./__setup__";

describe("Literal and operator tests", () => {
    describe("Literal tests", () => {
        test("Basic literals should load correctly", async () => {
            await executeCode(`
                window.result = 1;
                window.result2 = "test";
                window.result3 = true;
                window.result4 = false;
                window.result5 = null;
                window.result6 = undefined;
                window.result7 = 3.14;
                window.result8 = "";
                window.result9 = -42;
                window.result10 = 0;
            `);

            expect(window.result).toBe(1);
            expect(window.result2).toBe("test");
            expect(window.result3).toBe(true);
            expect(window.result4).toBe(false);
            expect(window.result5).toBe(null);
            expect(window.result6).toBe(undefined);
            expect(window.result7).toBe(3.14);
            expect(window.result8).toBe("");
            expect(window.result9).toBe(-42);
            expect(window.result10).toBe(0);
        });

        test("Object literals should work correctly", async () => {
            await executeCode(`
                window.result = { a: 1, b: "test", c: true };
                window.result2 = {};
                window.result3 = { nested: { value: 42 } };
            `);

            expect(window.result).toEqual({ a: 1, b: "test", c: true });
            expect(window.result2).toEqual({});
            expect(window.result3).toEqual({ nested: { value: 42 } });
        });

        test("Array literals should work correctly", async () => {
            await executeCode(`
                window.result = [1, 2, 3];
                window.result2 = [];
                window.result3 = [1, "test", true, null];
                window.result4 = [[1, 2], [3, 4]];
            `);

            expect(window.result).toEqual([1, 2, 3]);
            expect(window.result2).toEqual([]);
            expect(window.result3).toEqual([1, "test", true, null]);
            expect(window.result4).toEqual([[1, 2], [3, 4]]);
        });
    });

    describe("Binary operator tests", () => {
        test("Comparison operators should work correctly", async () => {
            await executeCode(`
                window.result1 = 1 == "1";
                window.result2 = "2" != 1;
                window.result3 = "1" !== 1;
                window.result4 = 1 === 1;
                window.result5 = 1 < 2;
                window.result6 = 1 <= 1;
                window.result7 = 2 > 1;
                window.result8 = 1 >= 1;
            `);

            for (let i = 1; i <= 8; i++) {
                expect(window[`result${i}`]).toBe(true);
            }
        });

        test("Bitwise operators should work correctly", async () => {
            await executeCode(`
                window.result1 = (1 << 1) === 2;
                window.result2 = (4 >> 1) === 2;
                window.result3 = (512 >>> 4) === 32;
                window.result4 = (1 | 2) === 3;
                window.result5 = (5 ^ 12) === 9;
                window.result6 = (51 & 5) === 1;
            `);

            for (let i = 1; i <= 6; i++) {
                expect(window[`result${i}`]).toBe(true);
            }
        });

        test("Arithmetic operators should work correctly", async () => {
            await executeCode(`
                window.result1 = (1 + 1) === 2;
                window.result2 = (3 - 1) === 2;
                window.result3 = (2 * 3) === 6;
                window.result4 = (2 ** 3) === 8;
                window.result5 = (10 / 2) === 5;
                window.result6 = (10 % 3) === 1;
            `);

            for (let i = 1; i <= 6; i++) {
                expect(window[`result${i}`]).toBe(true);
            }
        });
    });

    describe("Assignment operator tests", () => {
        test("Basic assignment operators should work correctly", async () => {
            await executeCode(`
                window.result = 0;
                window.result += 12;
                window.result2 = 15;
                window.result2 -= 12;
                window.result3 = 4;
                window.result3 *= 3;
                window.result4 = 15;
                window.result4 /= 3;
                window.result5 = 10;
                window.result5 %= 3;
            `);

            expect(window.result).toBe(12);
            expect(window.result2).toBe(3);
            expect(window.result3).toBe(12);
            expect(window.result4).toBe(5);
            expect(window.result5).toBe(1);
        });

        test("Bitwise assignment operators should work correctly", async () => {
            await executeCode(`
                window.result = 1;
                window.result <<= 2;
                window.result2 = 8;
                window.result2 >>= 2;
                window.result3 = 5;
                window.result3 |= 3;
                window.result4 = 12;
                window.result4 &= 5;
                window.result5 = 15;
                window.result5 ^= 3;
            `);

            expect(window.result).toBe(4);
            expect(window.result2).toBe(2);
            expect(window.result3).toBe(7);
            expect(window.result4).toBe(4);
            expect(window.result5).toBe(12);
        });
    });

    describe("RegExp tests", () => {
        test("RegExp literals should work correctly", async () => {
            await executeCode(`
                window.result1 = /test/.test("test");
                window.result2 = /^test$/.test("test");
                window.result3 = /t[e]st/.test("test");
                window.result4 = /test/i.test("TEST");
                window.result5 = /\\d+/.test("123");
                window.result6 = /test/g.toString() === "/test/g";
            `);

            for (let i = 1; i <= 6; i++) {
                expect(window[`result${i}`]).toBe(true);
            }
        });

        test("RegExp methods should work correctly", async () => {
            await executeCode(`
                window.result1 = "test".match(/t(e)st/)[1] === "e";
                window.result2 = "test test".replace(/test/g, "pass") === "pass pass";
                window.result3 = "test".search(/st/) === 2;
                window.result4 = "test".split(/s/).join(",") === "te,t";
                
                const regex = /t(e)(s)t/;
                const str = "test";
                const match = regex.exec(str);
                window.result5 = match[0] === "test" && match[1] === "e" && match[2] === "s";
                
                window.result6 = "test123test".match(/test/g).length === 2;
            `);

            for (let i = 1; i <= 6; i++) {
                expect(window[`result${i}`]).toBe(true);
            }
        });

        test("RegExp flags should work correctly", async () => {
            await executeCode(`
                window.result1 = /test/i.test("TEST");
                window.result2 = /test/g.global === true;
                window.result3 = /test/m.multiline === true;
                window.result4 = /test/i.ignoreCase === true;
                window.result5 = /./s.dotAll === true;
                window.result6 = /test/u.unicode === true;
            `);

            for (let i = 1; i <= 6; i++) {
                expect(window[`result${i}`]).toBe(true);
            }
        });

        test("RegExp character classes should work correctly", async () => {
            await executeCode(`
                window.result1 = /\\d/.test("1");
                window.result2 = /\\w/.test("a");
                window.result3 = /\\s/.test(" ");
                window.result4 = /\\D/.test("a");
                window.result5 = /\\W/.test("!");
                window.result6 = /\\S/.test("x");
                window.result7 = /[a-z]/.test("x");
                window.result8 = /[^a-z]/.test("1");
            `);

            for (let i = 1; i <= 8; i++) {
                expect(window[`result${i}`]).toBe(true);
            }
        });

        test("RegExp quantifiers should work correctly", async () => {
            await executeCode(`
                window.result1 = /a?/.test("");
                window.result2 = /a*/.test("aaa");
                window.result3 = /a+/.test("a");
                window.result4 = /a{2}/.test("aa");
                window.result5 = /a{2,}/.test("aaa");
                window.result6 = /a{2,4}/.test("aaa");
                window.result7 = /(test){2}/.test("testtest");
                window.result8 = /^(?:a|b)+$/.test("aba");
            `);

            for (let i = 1; i <= 8; i++) {
                expect(window[`result${i}`]).toBe(true);
            }
        });
    });
});