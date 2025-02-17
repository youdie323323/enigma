import { executeCode, window } from "./__setup__";

describe("Loop and control flow tests", () => {
    describe("For loop tests", () => {
        test("Basic for loop should work correctly", async () => {
            await executeCode(`
                let str = '';
                for (let i = 0; i < 9; i++) {
                    str = str + i;
                }
                window.result = str;
            `);

            expect(window.result).toBe("012345678");
        });

        test("For loop with break should work correctly", async () => {
            await executeCode(`
                let str = '';
                for (let i = 0; i < 9; i++) {
                    break;
                    str = str + i;
                }
                window.result = str;
            `);

            expect(window.result).toBe("");
        });

        test("For loop with continue should work correctly", async () => {
            await executeCode(`
                let str = '';
                for (let i = 0; i < 9; i++) {
                    if (i == 5) {
                        continue;
                    }
                    str = str + i;
                }
                window.result = str;
            `);

            expect(window.result).toBe("01234678");
        });
    });

    describe("While loop tests", () => {
        test("Basic while loop should work correctly", async () => {
            await executeCode(`
                let n = 0;
                while (n < 3) {
                    n++;
                }
                window.result = n;
            `);

            expect(window.result).toBe(3);
        });

        test("While loop with break should work correctly", async () => {
            await executeCode(`
                let n = 0;
                while (n < 3) {
                    break;
                    n++;
                }
                window.result = n;
            `);

            expect(window.result).toBe(0);
        });

        test("While loop with continue should work correctly", async () => {
            await executeCode(`
                let n = 0;
                while (n < 5) {
                    if (n == 1) {
                        n += 2;
                        continue;
                    }
                    n++;
                }
                window.result = n;
            `);

            expect(window.result).toBe(5);
        });
    });

    describe("Do-while loop tests", () => {
        test("Basic do-while loop should work correctly", async () => {
            await executeCode(`
                let n = 0;
                do {
                    n++;
                } while (n < 3);
                window.result = n;
            `);

            expect(window.result).toBe(3);
        });

        test("Do-while loop with break should work correctly", async () => {
            await executeCode(`
                let n = 0;
                do {
                    break;
                    n++;
                } while (n < 3);
                window.result = n;
            `);

            expect(window.result).toBe(0);
        });

        test("Do-while loop with continue should work correctly", async () => {
            await executeCode(`
                let n = 0;
                do {
                    if (n == 1) {
                        n += 2;
                        continue;
                    }
                    n++;
                } while (n < 5);
                window.result = n;
            `);

            expect(window.result).toBe(5);
        });
    });

    describe("For-in loop tests", () => {
        test("For-in loop should work correctly with objects", async () => {
            await executeCode(`
                const object = { a: 1, b: 2, c: 3 };
                for (const property in object) {
                    window[property] = object[property];
                }
            `);

            expect(window.a).toBe(1);
            expect(window.b).toBe(2);
            expect(window.c).toBe(3);
        });

        test("For-in loop should not execute with empty array", async () => {
            await executeCode(`
                for (const property in []) {
                    window.unexpectedProperty = true;
                }
            `);

            expect(window).not.toHaveProperty("unexpectedProperty");
        });
    });

    describe("For-of loop tests", () => {
        test("For-of loop should work correctly with arrays", async () => {
            await executeCode(`
                const array1 = ['a', 'b', 'c'];
                for (const element of array1) {
                    window[element] = element;
                }
            `);

            expect(window.a).toBe("a");
            expect(window.b).toBe("b");
            expect(window.c).toBe("c");
        });
    });

    describe("Label tests", () => {
        test("Nested label break should work correctly", async () => {
            await executeCode(`
                a: while (true) {
                    a2: while (true) {
                        break a;
                        window.unexpected = true;
                    }
                    window.unexpected2 = true;
                }
            `);

            expect(window).not.toHaveProperty("unexpected");
            expect(window).not.toHaveProperty("unexpected2");
        });

        test("Multiple nested labels with continue", async () => {
            await executeCode(`
                let count = 0;
                outer: for(let i = 0; i < 3; i++) {
                    inner: for(let j = 0; j < 3; j++) {
                        if(j === 1) continue outer;
                        count++;
                    }
                }
                window.result = count;
            `);

            expect(window.result).toBe(3);
        });

        test("Triple nested labels with break", async () => {
            await executeCode(`
                let result = '';
                outer: for(let i = 0; i < 3; i++) {
                    middle: for(let j = 0; j < 3; j++) {
                        inner: for(let k = 0; k < 3; k++) {
                            if(j === 1) break middle;
                            result += k;
                        }
                    }
                }
                window.result = result;
            `);

            expect(window.result).toBe("012012012");
        });

        test("Break from deeply nested label", async () => {
            await executeCode(`
                let result = '';
                level1: for(let a = 0; a < 2; a++) {
                    level2: for(let b = 0; b < 2; b++) {
                        level3: for(let c = 0; c < 2; c++) {
                            level4: for(let d = 0; d < 2; d++) {
                                if(d === 1) break level2;
                                result += d;
                            }
                        }
                    }
                }
                window.result = result;
            `);

            expect(window.result).toBe("00");
        });

        test("Continue with multiple nested labels", async () => {
            await executeCode(`
                let result = '';
                outer: for(let i = 0; i < 3; i++) {
                    middle: for(let j = 0; j < 3; j++) {
                        if(j === 1) continue outer;
                        inner: for(let k = 0; k < 2; k++) {
                            if(k === 1) continue middle;
                            result += i + '' + j + '' + k;
                        }
                    }
                }
                window.result = result;
            `);

            expect(window.result).toBe("000100200");
        });

        test("Mixed break and continue with labels", async () => {
            await executeCode(`
                let result = '';
                outer: for(let i = 0; i < 3; i++) {
                    inner1: for(let j = 0; j < 3; j++) {
                        if(j === 2) continue outer;
                        inner2: for(let k = 0; k < 2; k++) {
                            if(i === 1 && j === 1) break outer;
                            result += i + '' + j + '' + k;
                        }
                    }
                }
                window.result = result;
            `);

            expect(window.result).toBe("000001010011100101");
        });

        test("Label with switch statement", async () => {
            await executeCode(`
                let result = '';
                outer: for(let i = 0; i < 3; i++) {
                    inner: switch(i) {
                        case 0:
                            result += '0';
                            break;
                        case 1:
                            break outer;
                        case 2:
                            result += '2';
                            break;
                    }
                }
                window.result = result;
            `);

            expect(window.result).toBe("0");
        });

        test("Complex nested labeled loops with conditional breaks", async () => {
            await executeCode(`
                let result = '';
                loop1: for(let i = 0; i < 2; i++) {
                    loop2: for(let j = 0; j < 2; j++) {
                        loop3: for(let k = 0; k < 2; k++) {
                            if(i === 1 && j === 1) break loop1;
                            if(k === 1) break loop2;
                            result += i + '' + j + '' + k;
                        }
                    }
                }
                window.result = result;
            `);

            expect(window.result).toBe("000100");
        });
    });
});