import type { TreeNodeModel } from "./TreeNode";

export interface FlatNode<T = unknown> {

    node: TreeNodeModel<T>;

    depth: number;

    parentId: string | null;

    index: number;

}