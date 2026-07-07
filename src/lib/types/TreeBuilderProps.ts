import type { ReactNode } from "react";
import type { MoveEvent } from "./MoveEvent";
import type { TreeNodeModel } from "./TreeNode";


export interface TreeBuilderProps<T = unknown> {

    items: TreeNodeModel<T>[];

    renderNode(
        node: TreeNodeModel<T>,
    ): ReactNode;

    renderTrash?:()=> ReactNode;

    trashPosition?: 'top' | 'bottom' | 'left' | 'right'; 

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
}