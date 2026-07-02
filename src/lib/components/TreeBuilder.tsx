import {
    DndContext,
    type DragEndEvent,
} from "@dnd-kit/core";

import { TreeContext } from "../context/TreeContext";
import type { TreeBuilderProps } from "../types/TreeBuilderProps";
import { TreeChildren } from "./TreeChildren";
import "../style/tree.scss"
import { TreeTrashZone } from "./TreeTrashZone";

export function TreeBuilder<T>(
    props: TreeBuilderProps<T>,
) {

    function handleDragEnd(
        event: DragEndEvent,
    ) {

        const { active, over } = event;

        if (!over) {
            return;
        }

        const target = over.data.current;

        if (!target || target.parentId === active.id) {
            return;
        }

        if(target.action === "delete")
        {
            props.onDelete?.(active.id as string)
        }
        else{
            props.onMove?.({
                sourceId: active.id as string,
                parentId: target.parentId,
                index: target.index,
            });
        }

    }

    return(

        <TreeContext.Provider value={props}>

            <DndContext onDragEnd={handleDragEnd}>
                <TreeTrashZone/>
                <div className="tree-builder">

                    <TreeChildren

                        nodes={props.items}

                        parentId={null}

                        depth={0}

                        onInsert={props.onInsert}

                    />

                </div>
            </DndContext>

            

        </TreeContext.Provider>

    )

}