import type { TreeNodeModel } from "./TreeNode";

// export interface MovePosition {

//     parentId: string | null;

//     index: number;
// }

// export interface MoveEvent<T = unknown> {

//     node: TreeNodeModel<T>;

//     from: MovePosition;

//     to: MovePosition;
// }

export interface MoveEvent{

    index: number;

    sourceId: string;

    parentId: string | null;
}