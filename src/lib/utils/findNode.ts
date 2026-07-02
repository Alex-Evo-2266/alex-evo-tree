import type { TreeNodeModel } from "../types/TreeNode";

export function findNode<T>(

    tree: TreeNodeModel<T>[],

    id: string,

): TreeNodeModel<T> | undefined {

    for (const node of tree) {

        if (node.id === id)

            return node;

        const child = node.children
            ? findNode(node.children, id)
            : undefined;

        if (child)

            return child;

    }

}