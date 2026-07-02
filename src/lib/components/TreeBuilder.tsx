import { TreeContext } from "../context/TreeContext";
import type { TreeBuilderProps } from "../types/TreeBuilderProps";
import { TreeChildren } from "./TreeChildren";
import "../style/tree.scss"

export function TreeBuilder<T>(
    props: TreeBuilderProps<T>,
) {
    return(

        <TreeContext.Provider value={props}>

            <div className="tree-builder">

                <TreeChildren

                    nodes={props.items}

                    parentId={null}

                    depth={0}

                    onInsert={props.onInsert}

                />

            </div>

        </TreeContext.Provider>

    )

}