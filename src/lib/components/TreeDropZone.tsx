import { useDroppable } from "@dnd-kit/core";

interface Props {

    parentId: string | null;

    index: number;

    onInsert?(
        parentId: string | null,
        index: number,
    ): void;

}

export function TreeDropZone({

    parentId,
    index,
    onInsert,

}: Props) {

      const {setNodeRef, isOver} = useDroppable({
        id:`${parentId}:${index}`,
        data:{
            parentId,
            index,
        }
    });

    return (

        <div ref={setNodeRef} 
            className={isOver
                    ? "tree-drop-zone active"
                    : "tree-drop-zone"
                }>

            <button
                className="tree-insert-button"
                onClick={() =>
                    onInsert?.(
                        parentId,
                        index,
                    )
                }
            >

                +

            </button>

        </div>

    );

}