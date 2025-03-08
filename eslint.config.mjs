import globals from "globals";
import tsdoc from "eslint-plugin-tsdoc";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";
import importPlugin from "eslint-plugin-import";

const alertStyle = "warn";

export default tseslint.config(
    { files: ["**/*.{ts,tsx}"] },
    importPlugin.flatConfigs.recommended,
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",

            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.devtools,
            },
            parser: tseslint.parser,
            parserOptions: {
                project: true,
            },
        },
        plugins: {
            // Lints
            tsdoc,

            // Formats
            "@stylistic": stylistic,
        },
        rules: {
            // Lints
            "no-unused-vars": "off",
            "tsdoc/syntax": alertStyle,

            // Formats
            "@stylistic/indent": [alertStyle, 4],
            "@stylistic/block-spacing": alertStyle,
            "@stylistic/brace-style": [alertStyle, "1tbs", { allowSingleLine: true }],
            "@stylistic/function-call-spacing": [alertStyle, "never"],
            "@stylistic/comma-dangle": [alertStyle, "always-multiline"],
            "@stylistic/key-spacing": [alertStyle, { beforeColon: false }],
            "@stylistic/keyword-spacing": [alertStyle, {
                before: true,
                after: true,
            }],
            /*
            "@stylistic/lines-around-comment": [alertStyle, {
                beforeLineComment: true,

                // JS
                allowBlockStart: true,
                allowBlockEnd: false,
                allowObjectStart: true,
                allowObjectEnd: false,

                // TS
                allowEnumStart: true,
                allowInterfaceStart: true,
                allowTypeStart: true,
            }],
            */
            "@stylistic/lines-between-class-members": [alertStyle, {
                enforce: [
                    // I love the blank line for each category fields
                    /*
                    {
                        blankLine: "never",
                        prev: "field",
                        next: "field",
                    },
                    */
                    {
                        blankLine: "always",
                        prev: "method",
                        next: "method",
                    },
                ],
            }],
            "@stylistic/member-delimiter-style": [alertStyle, {
                multiline: {
                    delimiter: "semi",
                    requireLast: true,
                },
                singleline: {
                    delimiter: "semi",
                    requireLast: false,
                },
                multilineDetection: "brackets",
            }],
            "@stylistic/no-extra-semi": alertStyle,
            "@stylistic/object-property-newline": [alertStyle, { allowAllPropertiesOnSameLine: true }],
            "@stylistic/padding-line-between-statements": [
                alertStyle,

                // TODO: add style for TS blocks
                {
                    blankLine: "always",
                    prev: "*",
                    next: "return",
                },
                {
                    blankLine: "always",
                    prev: "*",
                    next: "function",
                },
                // Gonna disable this for post-process IFs
                /*
                {
                    blankLine: "always",
                    prev: "*",
                    next: "if",
                },
                */
                {
                    blankLine: "always",
                    prev: "*",
                    next: "block",
                },
            ],
            // "@stylistic/quote-props": [alertStyle, "as-needed"],
            "@stylistic/quotes": "off",
            "@stylistic/semi": alertStyle,
            "@stylistic/space-before-blocks": alertStyle,
            "@stylistic/space-before-function-paren": [alertStyle, {
                named: "never",
                anonymous: "always",
                asyncArrow: "always",
            }],
            "@stylistic/space-infix-ops": alertStyle,
            "@stylistic/type-annotation-spacing": alertStyle,
        },
        settings: {
            "import/resolver": {
                typescript: true,
                node: true,
            },
        },
    },
);