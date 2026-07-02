import type { TreeNodeModel } from "../types/TreeNode";
import { cloneTree } from "./cloneTree";
import { insertNode } from "./insertNode";
import { removeNode } from "./removeNode";

export function moveNode<T>(

    tree: TreeNodeModel<T>[],

    nodeId: string,

    parentId: string | null,

    index: number,

) {

    const copy = cloneTree(tree);

    const node = removeNode(copy, nodeId);

    if (!node)

        return tree;

    insertNode(

        copy,

        parentId,

        index,

        node,

    );

    return copy;

}