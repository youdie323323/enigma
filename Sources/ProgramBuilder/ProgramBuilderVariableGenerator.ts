/**
 * Keywords disallowed for variable names in ES5 and under.
 */
const reservedKeywords = new Set([
    "abstract",
    "arguments",
    "await",
    "boolean",
    "break",
    "byte",
    "case",
    "catch",
    "char",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "double",
    "else",
    "enum",
    "eval",
    "export",
    "extends",
    "false",
    "final",
    "finally",
    "float",
    "for",
    "function",
    "goto",
    "if",
    "implements",
    "import",
    "in",
    "instanceof",
    "int",
    "interface",
    "let",
    "long",
    "native",
    "new",
    "null",
    "package",
    "private",
    "protected",
    "public",
    "return",
    "short",
    "static",
    "super",
    "switch",
    "synchronized",
    "this",
    "throw",
    "throws",
    "transient",
    "true",
    "try",
    "typeof",
    "var",
    "void",
    "volatile",
    "while",
    "with",
    "yield",
]);

/**
 * Identifiers that are not actually variables.
 */
const reservedIdentifiers = new Set([
    "undefined",
    "null",
    "NaN",
    "Infinity",
    "eval",
    "arguments",
]);

export default class VariableGenerator {
    constructor(private varCount: number = 0) { }

    /**
     * Reset variable count.
     */
    public reset(): void {
        this.varCount = 0;
    }

    /**
     * Generates valid javascript identifier.
     */
    public generateIdentifier(): string {
        while (true) {
            const result = VariableGenerator.alphabeticalGenerator(++this.varCount);
            if (
                !(
                    reservedKeywords.has(result) ||
                    reservedIdentifiers.has(result)
                )
            ) {
                return result;
            }
        }
    }

    private static alphabeticalGenerator(index: number) {
        let name = "";
        while (index > 0) {
            const t = (index - 1) % 52;
            const thisChar =
                t >= 26 ? String.fromCharCode(65 + t - 26) : String.fromCharCode(97 + t);
            name = thisChar + name;
            index = ((index - t) / 52) | 0;
        }
        if (!name) {
            name = "_";
        }
        return name;
    }    
}
