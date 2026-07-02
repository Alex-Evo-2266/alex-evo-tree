import { TreeChildren } from "./TreeChildren";
import { useTreeContext } from "../context/TreeContext";
import type { TreeNodeModel } from "../types/TreeNode";
import {

    useDraggable,

} from "@dnd-kit/core";

interface Props<T>{

    node:TreeNodeModel<T>;

    depth:number;

}

export function TreeNode<T>({
    node,
    depth,
}:Props<T>){

    const tree = useTreeContext();
    const {setNodeRef,listeners,attributes,transform,isDragging}=useDraggable({
        id:node.id,
    });

    return(

        <div className="tree-node-container">

            <div
                className="tree-node"
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                style={{
                    opacity:isDragging?0.4:1,
                    transform:transform
                    ?`translate(${transform.x}px,${transform.y}px)`
                    :undefined
                }}
                
            >

                {tree.renderNode(node)}

            </div>

            <div
                className={`tree-children ${
                    isDragging ? "unvisible" : ""
                }`}
            >
                {!node.collapsed && node.children && (

                    <TreeChildren

                        nodes={node.children}

                        parentId={node.id}

                        depth={depth+1}

                        onInsert={tree.onInsert}
                    />

                )}
            </div>

        </div>

    )

}