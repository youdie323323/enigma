import * as t from '@babel/types';
import { parse } from '@babel/parser';
import babelTraverse from '@babel/traverse';
import { traverse as customTraverse } from './ParserTraverse';
import { type BabelFileResult, type TransformOptions, transformSync } from "@babel/core";
import UniqueIdentifier from '../CompilerUniqueIdentifier';
import generate from '@babel/generator';

interface BaseNode {
    declarations: Set<string>;
    label: string;
}

declare module '@babel/types' {
    interface Program extends BaseNode { }

    interface FunctionDeclaration extends BaseNode { }

    interface FunctionExpression extends BaseNode {
        functionId?: number;
    }
}

export const SHARED_REGENERATOR_RUNTIME_IDENTIFIER = "regeneratorRuntime";

export const REGENERATOR_RUNTIME_FUNCTION_IDENTIFIER = "_regeneratorRuntime";

export type CompilableBlock = t.Program | t.FunctionDeclaration | t.FunctionExpression;

const babelOptions: TransformOptions = {
    // Ignore babel.config.js
    configFile: false,
    plugins: [
        // Why only this plugin doesnt included in preset plugin list? the website said its included on preset-env but i checked
        // plugin list and doesnt in the list
        "@babel/plugin-transform-property-mutators",
    ],
    presets: [
        ["@babel/preset-env", {
            // No target specify for all transformations
            modules: "commonjs",
            exclude: [
                // This will break this code: /./s.dotAll === true
                "@babel/plugin-transform-dotall-regex", 
                // This will break this code: /test/u.unicode === true
                "@babel/plugin-transform-unicode-regex",
            ],
        }],
        ["minify", {
            mangle: false,
            // Unsafe
            // console.log(Number(0xffffffffn) | 0)
            // This throws error
            typeConstructors: false,
        }],
    ].reverse(),
    code: true,
    ast: false,
    comments: false,
};

/**
 * Transform code to compilable code with babel.
 */
const transformCode = (code: string): BabelFileResult => transformSync(code, babelOptions);

export default class Parser {
    constructor(private uniqueId: UniqueIdentifier) { }

    /**
     * Compile code into compilable blocks.
     */
    public parse(code: string): Array<CompilableBlock> {
        const { code: transformedCode } = transformCode(code);

        const ast = parse(transformedCode);

        babelTraverse(ast, {
            Block(path) {
                const functionDeclarations = [];
                const functionPaths = [];
                const otherStatements = [];

                path.traverse({
                    // This might need fix
                    FunctionDeclaration(innerPath) {
                        const functionParent = innerPath.findParent((p) => p.isBlock());
                        if (functionParent && functionParent.isBlock(path.node)) {
                            functionDeclarations.push(innerPath.node);
                            functionPaths.push(innerPath);
                        }
                    },
                });

                path.node.body.forEach((e) => {
                    if (!t.isFunctionDeclaration(e)) {
                        otherStatements.push(e);
                    }
                });

                functionPaths.forEach(p => p && p.remove());

                path.node.body = [...functionDeclarations, ...otherStatements];
            },

            BigIntLiteral(path) {
                path.replaceWith(t.callExpression(
                    t.identifier('BigInt'),
                    [t.stringLiteral(parseInt(path.node.value) + "")],
                ));
            },

            // Remove regenerator runtime declaration
            FunctionDeclaration(path) {
                if (t.isIdentifier(path.node.id, { name: REGENERATOR_RUNTIME_FUNCTION_IDENTIFIER })) {
                    path.remove();
                }
            },

            // Delete if
            // var regeneratorRuntime = _regeneratorRuntime();
            //
            // Rename identifier of variable above
            // regeneratorRuntime
            // ->
            // _regeneratorRuntime
            Identifier(path) {
                if (
                    t.isIdentifier(path.node, { name: SHARED_REGENERATOR_RUNTIME_IDENTIFIER })
                ) {
                    // var regeneratorRuntime = _regeneratorRuntime();
                    if (path.parentPath.isVariableDeclarator()) {
                        path.parentPath.remove();

                        return;
                    }

                    path.replaceWith(t.identifier(REGENERATOR_RUNTIME_FUNCTION_IDENTIFIER));
                }
            },

            // _regeneratorRuntime() -> _regeneratorRuntime
            CallExpression(path) {
                if (
                    t.isIdentifier(path.node.callee, { name: REGENERATOR_RUNTIME_FUNCTION_IDENTIFIER }) &&
                    path.node.arguments.length === 0
                ) {
                    path.replaceWith(path.node.callee);
                }
            },

            // Delete all directives because no effective on vm
            Directive(path) {
                path.remove();
            },
        });

        babelTraverse(ast, {
            // Add fake condition
            BlockStatement(path) {
                if (Math.random() < 0.05) {
                    const generateRandomAlphabet = (length: number): string => {
                        let result = "";

                        for (let i = 0; i < length; i++) {
                            result += String.fromCharCode(97 + Math.floor(26 * Math.random()));
                        }

                        return result;
                    };

                    const generateUniqueLiteral = (length: number, exclude: string): string => {
                        const uniqueLiteral = generateRandomAlphabet(length);
                        if (uniqueLiteral === exclude) {
                            return generateUniqueLiteral(length, exclude);
                        }

                        return uniqueLiteral;
                    };

                    const shouldInvertBoolean = Math.random() < 0.5;
                    const rightSideRandom = "t";
                    const binaryExpr = t.binaryExpression(
                        "===",
                        t.stringLiteral(rightSideRandom),
                        t.stringLiteral(shouldInvertBoolean ? generateUniqueLiteral(1, rightSideRandom) : rightSideRandom),
                    );

                    path.replaceWith(
                        t.blockStatement(
                            [
                                t.ifStatement(
                                    shouldInvertBoolean ?
                                        t.unaryExpression("!", binaryExpr, true) :
                                        binaryExpr,
                                    path.node,
                                    null,
                                ),
                            ],
                        ),
                    );
                }
            },
        });

        const blocks: Array<CompilableBlock> = [];

        customTraverse<CompilableBlock>((node, parentScopeNode, next) => {
            switch (true) {
                case t.isProgram(node): {
                    node.declarations = new Set();
                    node.label = 'main_' + this.uniqueId.next().toString(16);

                    blocks.push(node);

                    return next(node, node);
                }

                case t.isFunctionExpression(node): {
                    if (node.id) node.functionId = this.uniqueId.next();

                    node.declarations = new Set();
                    node.label = `${(node.id?.name || 'anonymous')}_${this.uniqueId.next().toString(16)}`;

                    blocks.push(node);

                    return next(node, node);
                }

                case t.isFunctionDeclaration(node): {
                    parentScopeNode.declarations.add(node.id.name);

                    node.declarations = new Set();
                    node.label = `${(node.id?.name || 'anonymous')}_${this.uniqueId.next().toString(16)}`;

                    blocks.push(node);

                    return next(node, node);
                }

                case t.isVariableDeclaration(node): {
                    if (node.kind === "var") {
                        node.declarations.forEach(declarator => parentScopeNode.declarations.add((declarator.id as t.Identifier).name));
                    }

                    break;
                }
            }

            return next(node, parentScopeNode);
        })(ast.program, ast.program);

        return blocks;
    }
}
