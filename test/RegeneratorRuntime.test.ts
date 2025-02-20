import { executeCode, window } from "./__setup__";

describe("Regenerator tests", () => {
    describe("Promise tests", () => {
        test("async function should return Promise", async () => {
            await executeCode(`
                async function promisedOne() { return 1 }
                window.result = promisedOne() instanceof Promise;
            `);
    
            expect(window.result).toBeTruthy();
        });
    
        test("Promise.resolve should work", async () => {
            await executeCode(`
                window.result = Promise.resolve(42);
            `);
    
            await expect(window.result).resolves.toBe(42);
        });
    
        test("Promise.reject should work", async () => {
            await executeCode(`
                window.result = Promise.reject(new Error('test error'));
            `);
    
            await expect(window.result).rejects.toThrow('test error');
        });
    
        test("Promise chaining should work", async () => {
            await executeCode(`
                window.result = Promise.resolve(2)
                    .then(x => x * 2)
                    .then(x => x + 1);
            `);
    
            await expect(window.result).resolves.toBe(5);
        });
    
        test("Promise.all should work", async () => {
            await executeCode(`
                const p1 = Promise.resolve(1);
                const p2 = Promise.resolve(2);
                const p3 = Promise.resolve(3);
                window.result = Promise.all([p1, p2, p3]);
            `);
    
            await expect(window.result).resolves.toEqual([1, 2, 3]);
        });
    
        test("Promise.race should work", async () => {
            await executeCode(`
                const p1 = new Promise(resolve => setTimeout(() => resolve('slow'), 100));
                const p2 = Promise.resolve('fast');
                window.result = Promise.race([p1, p2]);
            `);
    
            await expect(window.result).resolves.toBe('fast');
        });
    
        test("async/await should work", async () => {
            await executeCode(`
                async function getData() {
                    const value = await Promise.resolve(42);
                    return value * 2;
                }
                window.result = getData();
            `);
    
            await expect(window.result).resolves.toBe(84);
        });
    
        test("Promise error handling should work", async () => {
            await executeCode(`
                window.result = Promise.resolve(1)
                    .then(() => { throw new Error('test error'); })
                    .catch(err => err.message);
            `);
    
            await expect(window.result).resolves.toBe('test error');
        });
    
        test("Promise finally should work", async () => {
            await executeCode(`
                let cleanup = 0;
                window.result = Promise.resolve(1)
                    .finally(() => { cleanup = 1; })
                    .then(() => cleanup);
            `);
    
            await expect(window.result).resolves.toBe(1);
        });
    
        test("Nested promises should work", async () => {
            await executeCode(`
                async function nested() {
                    const outer = await Promise.resolve(1);
                    const inner = await Promise.resolve(outer + 1);
                    return inner + 1;
                }
                window.result = nested();
            `);
    
            await expect(window.result).resolves.toBe(3);
        });
    });
    
    describe("Generator tests", () => {
        test("basic generator should work", async () => {
            await executeCode(`
                function* numberGenerator() {
                    yield 1;
                    yield 2;
                    yield 3;
                }
                const gen = numberGenerator();
                window.result = [
                    gen.next().value,
                    gen.next().value,
                    gen.next().value,
                    gen.next().done
                ];
            `);
    
            expect(window.result).toEqual([1, 2, 3, true]);
        });
    
        test("generator with for...of should work", async () => {
            await executeCode(`
                function* range(start, end) {
                    for (let i = start; i <= end; i++) {
                        yield i;
                    }
                }
                const numbers = [];
                for (const num of range(1, 3)) {
                    numbers.push(num);
                }
                window.result = numbers;
            `);
    
            expect(window.result).toEqual([1, 2, 3]);
        });
    
        test("async generator should work", async () => {
            await executeCode(`
                async function* asyncNumberGenerator() {
                    yield await Promise.resolve(1);
                    yield await Promise.resolve(2);
                    yield await Promise.resolve(3);
                }
                
                async function collect() {
                    const numbers = [];
                    for await (const num of asyncNumberGenerator()) {
                        numbers.push(num);
                    }
                    return numbers;
                }
                
                window.result = collect();
            `);
    
            await expect(window.result).resolves.toEqual([1, 2, 3]);
        });
    
        test("generator with return should work", async () => {
            await executeCode(`
                function* gen() {
                    yield 1;
                    return 'end';
                }
                const g = gen();
                window.result = [
                    g.next(),
                    g.next()
                ];
            `);
    
            expect(window.result).toEqual([
                { value: 1, done: false },
                { value: 'end', done: true }
            ]);
        });
    
        test("generator throw should work", async () => {
            await executeCode(`
                function* errorGenerator() {
                    try {
                        yield 1;
                        yield 2;
                    } catch (e) {
                        yield e.message;
                    }
                }
                const gen = errorGenerator();
                const results = [];
                results.push(gen.next().value);
                results.push(gen.throw(new Error('test error')).value);
                window.result = results;
            `);
    
            expect(window.result).toEqual([1, 'test error']);
        });
    
        test("generator delegation should work", async () => {
            await executeCode(`
                function* gen1() {
                    yield 1;
                    yield 2;
                }
                
                function* gen2() {
                    yield* gen1();
                    yield 3;
                }
                
                const values = [];
                for (const value of gen2()) {
                    values.push(value);
                }
                window.result = values;
            `);
    
            expect(window.result).toEqual([1, 2, 3]);
        });
    
        test("infinite generator with take function should work", async () => {
            await executeCode(`
                function* fibonacci() {
                    let prev = 0, curr = 1;
                    while (true) {
                        yield curr;
                        [prev, curr] = [curr, prev + curr];
                    }
                }
                
                function take(gen, n) {
                    const results = [];
                    for (let i = 0; i < n; i++) {
                        results.push(gen.next().value);
                    }
                    return results;
                }
                
                window.result = take(fibonacci(), 5);
            `);
    
            expect(window.result).toEqual([1, 1, 2, 3, 5]);
        });
    });
});