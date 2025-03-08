[![npm](https://img.shields.io/npm/v/enigma-vm)](https://www.npmjs.com/package/enigma-vm)
[![license](https://img.shields.io/github/license/youdie323323/enigma)](https://github.com/youdie323323/enigma/blob/main/LICENSE)

<h1 align="center">$$Ёnigma$$</h1>

🚀 **The first publicly available better javascript virtual machine obfuscator**

This tool allows you to run JavaScript code on a custom-built JavaScript interpreter, effectively making reverse engineering harder.  
In a nutshell, i called this as **javascript version of webassembly**.

## 📌 How It Works

Enigma VM obfuscates your javascript code by compiling it into a custom bytecode format that runs on an embedded javascript virtual machine.

### ❓ Why Enigma?

Unlike traditional obfuscators like [obfuscator.io](https://obfuscator.io/) or [js-confuser](https://js-confuser.com/), Enigma analyzes the AST (Abstract Syntax Tree) and converts everything into bytecode before running it on a VM. To reverse this, one would need to create a disassembler (e.g. [shape security VM decompiler](https://github.com/g2asell2019/shape-security-decompiler-toolkit)), which is no trivial task. 

Moreover, deobfuscating the original code from the disassembled output is **extremely** challenging. Most disassemblers display the code in an assembly-like format. This means that if the code is pre-obfuscated and then compiled/executed on the Enigma VM, the difficulty of reverse engineering increases significantly. 

🔒 **AST informations that completely removed on compilation phase**
- Variable names
- Structural differences in loops
- Labels
- And much more...

That being said, overconfidence is not advisable. Please use it in moderation. There is no such thing as obfuscation that makes reverse engineering impossible. **Do not include personal information or passwords in code** that gets compiled. 

## 🔍 Example

Check out the `examples` folder for sample compiled code!

## 🚀 Quick Start

### Installation

```bash
$ npm install enigma-vm
```

### Usage Example

```ts
import { obfuscate } from "enigma-vm";

(async function () {
    const input = `
      function sayHello(name) {
          console.log("Hello,", name + "!");
      }

      for (let i = 0; i < 3; i++) {
          sayHello("Me and " + i);
      }
    `;

    const obfuscatedInput = await obfuscate(input);

    console.log(obfuscatedInput);
})();
```

## ⚙️ Options

Enigma provides customization options to control the compilation process.  
These options can be passed as the second argument to the `obfuscate` method.

### 🛠 Compile Options
These options affect how your code is compiled into bytecode:

- **`stripFunctionName` (boolean)**: Removes function names during compilation.
  - `true`: Function names will be removed (e.g., `myFunction.name → ""`).
  - `false`: Function names will be preserved (e.g., `myFunction.name → "myFunction"`).

### 🔧 Build Options
These options control the interpreter code:

- **`removeLicenseComments` (boolean)**: Determines whether license comments should be removed from the compiled code.
  - `true`: License comments will be removed.
  - `false`: License comments will be kept.

### 📌 Example Usage

```ts
const obfuscatedInput = await obfuscate(input, {
  compileOptions: {
    stripFunctionName: true,
  },
  buildOptions: {
    removeLicenseComments: false,
  },
});
```

## 🎭 Interpreter

This enigma virtual machine is a recreation of [KASADA's virtual machine](https://accounts.nike.com/149e9513-01fa-4fb0-aad4-566afd725d1b/2d206a39-8ed7-437e-a3be-862e0f06eea3/ips.js).

## 🐞 Found a Bug?

If you encounter any issues, please [open an issue](https://github.com/youdie323323/enigma/issues/new?template=bug_report.yml)! Don't submit any PRs until issue approved.

## 🙌 Credits

A huge thank you to:
- [umasi](https://github.com/umasii) for creating the [article](https://www.nullpt.rs/devirtualizing-nike-vm-1) and [repository](https://github.com/umasii/ips-disassembler) about KASADA VM.
- [MichaelXF](https://github.com/MichaelXF) for inspiration from [js-confuser](https://github.com/MichaelXF/js-confuser).
- [j4k0xb](https://github.com/j4k0xb) for the issue templates from [webcrack](https://github.com/j4k0xb/webcrack).

## 📜 License

This project is licensed under the **MIT License**.