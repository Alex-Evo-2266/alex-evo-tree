import type { TreeNodeModel } from "../types/TreeNode";

export function cloneTree<T>(
    tree: TreeNodeModel<T>[],
): TreeNodeModel<T>[] {

    return structuredClone(tree);

}