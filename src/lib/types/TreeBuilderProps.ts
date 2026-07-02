import type { ReactNode } from "react";
import type { MoveEvent } from "./MoveEvent";
import type { TreeNodeModel } from "./TreeNode";


export interface TreeBuilderProps<T = unknown> {

    items: TreeNodeModel<T>[];

    renderNode(
        node: TreeNodeModel<T>,
    ): ReactNode;

    onMove?(
        event: MoveEvent,
    ): void;

    onInsert?(
        parentId: string | null,
        index: number,
    ): void;

    onDelete?(
        id: string,
    ): void;

    onRename?(
        id: string,
        title: string,
    ): void;

    allowDrop?(
        drag: TreeNodeModel<T>,
        target: TreeNodeModel<T>,
    ): boolean;
}