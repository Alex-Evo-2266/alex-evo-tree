import type { TreeNodeModel } from "../types/TreeNode";

export function removeNode<T>(

    tree: TreeNodeModel<T>[],

    id: string,

): TreeNodeModel<T> | null {

    for (let i = 0; i < tree.length; i++) {

        const node = tree[i];

        if (node.id === id) {

            tree.splice(i, 1);

            return node;

        }

        if (node.children) {

            const removed = removeNode(

                node.children,

                id,

            );

            if (removed)

                return removed;

        }

    }

    return null;

}