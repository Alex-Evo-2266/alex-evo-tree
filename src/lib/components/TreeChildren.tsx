import { TreeNode } from "./TreeNode";
import { TreeDropZone } from "./TreeDropZone";
import type { TreeNodeModel } from "../types/TreeNode";

interface Props<T> {

    nodes: TreeNodeModel<T>[];

    parentId: string |null;

    depth:number;

    onInsert?(
        parentId:string|null,
        index:number,
    ):void;

}

export function TreeChildren<T>({
    nodes,
    parentId,
    depth,
    onInsert,
}:Props<T>){

    return(

        <div style={{paddingLeft:depth*24}}>
            <TreeDropZone
                parentId={parentId}
                index={0}
                onInsert={onInsert}
            />

            {nodes.map((node,index)=>(

                <div key={node.id}>

                    <TreeNode
                        node={node}
                        depth={depth}
                    />

                    <TreeDropZone
                        parentId={parentId}
                        index={index+1}
                        onInsert={onInsert}
                    />

                </div>

            ))}

        </div>

    )

}