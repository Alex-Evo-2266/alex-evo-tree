import type { TreeNodeModel } from "../types/TreeNode";
import { findNode } from "./findNode";

export function insertNode<T>(

    tree: TreeNodeModel<T>[],

    parentId: string | null,

    index: number,

    node: TreeNodeModel<T>,

) {

    if (parentId === null) {

        tree.splice(index, 0, node);

        return;

    }

    const parent = findNode(tree, parentId);

    if (!parent)

        return;

    parent.children ??= [];

    parent.children.splice(index, 0, node);

}