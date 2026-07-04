import { useDndContext, useDroppable } from "@dnd-kit/core";

export function TreeTrashZone() {

    const {active} = useDndContext()
    const { setNodeRef, isOver } = useDroppable({
        id: "trash",
        data: {
            action: "delete",
            parentId: null,
            index: -1,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={`
                tree-trash-zone 
                ${
                    isOver ? "active" : ""
                }
                ${
                    !!active ? "visible" : ""
                }
                `}
        >
            🗑 Drop here to delete
        </div>
    );
}