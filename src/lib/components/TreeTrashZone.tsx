import { useDroppable } from "@dnd-kit/core";

export function TreeTrashZone() {

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
            className={`tree-trash-zone ${
                isOver ? "active" : ""
            }`}
        >
            🗑 Drop here to delete
        </div>
    );
}