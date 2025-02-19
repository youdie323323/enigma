[![npm](https://img.shields.io/npm/v/enigma)](https://www.npmjs.com/package/enigma)
[![license](https://img.shields.io/github/license/youdie323323/enigma)](https://github.com/youdie323323/enigma/blob/master/LICENSE)

<h1 align="center">enigma</h1>

🚀 **The first publicly available better javascript virtual machine obfuscator**

This tool allows you to run JavaScript code on a custom-built JavaScript interpreter, effectively making reverse engineering harder.  
In a nutshell, i called this as **javascript version of webassembly**.

## 🎯 Features

🔒 **Obfuscation that truly hides your code**
- Eliminates variable names
- Hides structural differences in loops
- Obscures labels
- And much more...

🛡️ **Virtually irreversible**
- The compiled output is extremely difficult to restore to its original form.

## 📌 How It Works

JavaScript enigma VM obfuscates your code by compiling it into a custom bytecode format that runs on an embedded virtual machine.

## 🚀 Quick Start

### Installation

```bash
npm install enigma-vm
```

### Usage Example

```ts
import { Compiler, ProgramBuilder } from "enigma-vm";

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

## 🔍 Example

Check out the `examples` folder for sample compiled code!

## 🎭 Interpreter

This enigma virtual machine is a recreation of [KASADA's virtual machine](https://accounts.nike.com/149e9513-01fa-4fb0-aad4-566afd725d1b/2d206a39-8ed7-437e-a3be-862e0f06eea3/ips.js).

## 🐞 Found a Bug?

If you encounter any issues, please [open an issue](https://github.com/youdie323323/enigma/issues/new?template=bug_report.yml)!

## 🙌 Credits

A huge thank you to:
- [umasi](https://github.com/umasii) for creating the [article](https://www.nullpt.rs/devirtualizing-nike-vm-1) and [repository](https://github.com/umasii/ips-disassembler) about KASADA VM.
- [MichaelXF](https://github.com/MichaelXF) for inspiration from [js-confuser](https://github.com/MichaelXF/js-confuser).
- [j4k0xb](https://github.com/j4k0xb) for the issue templates from [webcrack](https://github.com/j4k0xb/webcrack).

## 📜 License

This project is licensed under the **MIT License**.