import { executeCode, executeShouldThrownCode, window } from "./__setup__";

describe("Try/Catch/Finally tests", () => {
    test("Basic try/catch/finally should work correctly", async () => {
        await executeCode(`
            try {
                throw "test";
                window.unexpectedResult = true;
            } catch (e) {
                window.result = e;
            } finally {
                window.finally = true;
            }
        `);

        expect(window).toHaveProperty("result");
        expect(window).toHaveProperty("finally");
        expect(window.result).toBe("test");
        expect(window).not.toHaveProperty("unexpectedResult");
    });

    test("Catch with no param should be allowed", async () => {
        await executeCode(`
            try {
                throw "test";
                window.unexpectedResult = true;
            } catch {
                window.result = "ok";
            } finally {
                window.finally = true;
            }
        `);

        expect(window).toHaveProperty("result");
        expect(window).toHaveProperty("finally");
        expect(window.result).toBe("ok");
        expect(window).not.toHaveProperty("unexpectedResult");
    });

    test("Try with only finally should be allowed", async () => {
        await executeCode(`
            try { } finally {
                window.finally = true;
            }
        `);

        expect(window).toHaveProperty("finally");
    });

    test("Finally will execute after catch ends", async () => {
        await executeCode(`
            window.catch = 2;
            try {
                throw "a";
                window.unexpectedResult = true;
            } catch {
                window.catch = 1;
            } finally {
                window.finally = window.catch + 2;
            }
        `);

        expect(window).toHaveProperty("finally");
        expect(window).toHaveProperty("catch");
        expect(window.finally).toBe(3);
        expect(window.catch).toBe(1);
        expect(window).not.toHaveProperty("unexpectedResult");
    });

    test("Nested try/catch/finally should work correctly", async () => {
        await executeCode(`
            try {
                try {
                    throw "er";
                } catch (e) {
                    throw e;
                } finally {
                    window.innerFinally = true;
                }
            } catch (e) {
                window.catchError = e;
            } finally {
                window.outerFinally = true;
            }
        `);

        expect(window).toHaveProperty("catchError");
        expect(window.catchError).toBe("er");
        expect(window).toHaveProperty("innerFinally");
        expect(window).toHaveProperty("outerFinally");
    });

    test("Deeply nested try/catch/finally should work correctly", async () => {
        await executeCode(`
            try {
                try {
                    try {
                        try {
                            throw "error";
                        } finally {
                            window.result = 1;
                        }
                    } finally {
                        window.result2 = 1;
                    }
                } finally {
                    window.result3 = 1;
                }
            } catch (e) {
                window.result4 = 1;
            }
        `);

        expect(window).toHaveProperty("result");
        expect(window).toHaveProperty("result2");
        expect(window).toHaveProperty("result3");
        expect(window).toHaveProperty("result4");
    });

    test("Exception thrown in finally block should propagate", async () => {
        const thrownError = await executeShouldThrownCode(`
            try {
                throw "initialError";
            } catch (e) {
                window.result = e;
            } finally {
                throw "finallyError";
            }
        `);

        expect(window).toHaveProperty("result");
        expect(window.result).toBe("initialError");
        expect(thrownError).toBe("finallyError");
    });

    test("Re-throwing exception in catch block should propagate", async () => {
        const thrownError = await executeShouldThrownCode(`
            try {
                throw "originalError";
            } catch (e) {
                window.result = e;
                throw "reThrownError";
            } finally {
                window.finallyExecuted = true;
            }
        `);

        expect(window).toHaveProperty("result");
        expect(window.result).toBe("originalError");
        expect(window).toHaveProperty("finallyExecuted");
        expect(thrownError).toBe("reThrownError");
    });

    test("Return in try should trigger finally", async () => {
        await executeCode(`
            (function(){
                try {
                    return "something";
                } finally {
                    window.finallyExecuted = true;
                }
            })();
        `);

        expect(window).toHaveProperty("finallyExecuted");
    });

    test("Return in try should trigger finally (new context)", async () => {
        await executeCode(`
            new (function(){
                try {
                    return null;
                } finally {
                    window.finallyExecuted = true;
                }
            })();
        `);

        expect(window).toHaveProperty("finallyExecuted");
    });

    test("Catch v.s. finally return order", async () => {
        await executeCode(`
            function a() {
                try {
                    throw "a"
                } catch (e) {
                    return e;
                } finally {
                    return "hyaa";
                }
            }
            window.result = a();
        `);

        expect(window).toHaveProperty("result");
        expect(window.result).toBe("hyaa");
    });

    test("Catch v.s. finally return order (new context)", async () => {
        await executeCode(`
            function a() {
                try {
                    throw "a"
                } catch (e) {
                    window.result = e;
                } finally {
                    window.result = "hyaa";
                }
            }
            new a();
        `);

        expect(window).toHaveProperty("result");
        expect(window.result).toBe("hyaa");
    });

    test("Throw v.s. finally return order", async () => {
        await executeCode(`
            window.result = (function () {
                try {
                    try {
                        try {
                            throw "gat";
                        } catch (e) {
                            throw e;
                        }
                    } catch (e) {
                        throw e;
                    } finally {
                        return "tgatga";
                    }
                } catch (eh) {
                    window.unexpected = 1;
                }
            })();
        `);

        expect(window).toHaveProperty("result");
        expect(window).not.toHaveProperty("unexpected");
        expect(window.result).toBe("tgatga");
    });
});