import { executeCode, window } from "./__setup__";

describe("Object operation tests", () => {
    test("Object.keys should work correctly", async () => {
        await executeCode(`
            window.result = Object.keys({a: 1}).join(",");
        `);

        expect(window.result).toBe(window.Object.keys({ a: 1 }).join(","));
    });

    test("Object property access should work correctly", async () => {
        await executeCode(`
            const person1 = {};
            person1['firstname'] = 'Mario';
            person1.lastname = 'Rossi';

            window.result = person1.firstname + ":" + person1["lastname"];

            const person2 = {
                firstname: 'John',
                ["lastname"]: 'Doe',
            };

            window.result2 = person2.firstname + ":" + person2['lastname'];
        `);

        expect(window.result).toBe("Mario:Rossi");
        expect(window.result2).toBe("John:Doe");
    });
});