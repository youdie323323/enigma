import { obfuscate } from ".";

(async function () {
    const input = `
        function sayHello(name) {
            console.log("Hello,", name + "!");
        }

        for (let i = 0; i < 3; i++) {
            sayHello("Me and " + i);
        }

        console.log(sayHello.name);
    `;

    const obfuscatedInput = await obfuscate(input, {
        compileOptions: {
            stripFunctionName: true,
        },
        buildOptions: {
            removeLicenseComments: true,
        },
    });

    console.log(obfuscatedInput);
})();