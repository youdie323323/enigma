import { type Node } from '@babel/types';

const isNode = (target: Node): target is Node =>
    target && typeof target.type === 'string';

const isBlock = (target: Node | Node[]): target is Node[] =>
    Array.isArray(target) && target[0] && isNode(target[0]);

const isChildNode = (target: any): target is Node | Node[] =>
    isBlock(target) || isNode(target);

const getChildrenKeys = (node: Node): Array<keyof Node> =>
    (Object.keys(node) as Array<keyof Node>).filter(key => isChildNode(node[key]));

const traverseChildren = <T>(func: (node: Node, ctx: T) => Node) => (node: Node, ctx: T) => {
    if (isNode(node)) {
        getChildrenKeys(node).forEach(key => {
            const child = node[key] as unknown as Node | Node[];
            if (isBlock(child)) {
                for (let i = 0; i < child.length; i++) {
                    child[i] = child[i] && func(child[i], ctx);
                }
            } else {
                (node as any)[key] = func((node as any)[key], ctx);
            }
        });
    }
    
    return node;
};

export const traverse = <T>(func: (node: Node, ctx: T, next: (node: Node, ctx: T) => Node) => Node) => {
    const _traverse = (node: Node, ctx: T): Node => func(node, ctx, _traverseChildren);
    const _traverseChildren = traverseChildren(_traverse);

    return _traverse;
};