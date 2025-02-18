# Javascript Enigma VM Obfuscator
The **first** published javascript virtual machine obfuscator

## Intepreter

This virtual machine's intepreter is recreation of [KASADA's virtual machine](https://accounts.nike.com/149e9513-01fa-4fb0-aad4-566afd725d1b/2d206a39-8ed7-437e-a3be-862e0f06eea3/ips.js).  


## API Usage

### Installation
```bash
$ npm install js-enigma-vm
```

### Usage
```ts
import { Compiler, ProgramBuilder } from "js-enigma-vm";

(async function () {
    const compiler = new Compiler();

    const input = `
        function sayHello(name) {
            console.log("Hello,", name + "!");
        }

        for (let i = 0; i < 3; i++) {
            sayHello("Me and " + i);
        }
    `;

    compiler.compile(input);

    const bytecode = compiler.constructBytecode();

    const code = await new ProgramBuilder().build(bytecode);

    console.log(code);
})();
```

## Bug

If you have any bugs with your code, [open an issue](https://github.com/youdie323323/js-enigma-vm/issues/new?template=bug_report.yml).

## Credits

- Thanks to [umasi](https://github.com/umasii) for creating the [article](https://www.nullpt.rs/devirtualizing-nike-vm-1) and [repository](https://github.com/umasii/ips-disassembler) about KASADA vm.
- Some of codebase are inspired/taken from [js-confuser](https://github.com/MichaelXF/js-confuser) (thanks, [michael](https://github.com/MichaelXF)!)
- Additionally, issue templates are taken from [webcrack](https://github.com/j4k0xb/webcrack) (thanks, [j4k0xb](https://github.com/j4k0xb) too!)

## License 

MIT License
