import { useDndContext, useDroppable } from "@dnd-kit/core";
import { useTreeContext } from "../context/TreeContext";

export function TreeTrashZone() {

    const {active} = useDndContext()
    const tree = useTreeContext();
    
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
            {
                tree.renderTrash ? 
                tree.renderTrash() :
                "🗑 Drop here to delete"
            }
        </div>
    );
}