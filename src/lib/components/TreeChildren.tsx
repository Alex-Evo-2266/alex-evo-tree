import { TreeNode } from "./TreeNode";
import { TreeDropZone } from "./TreeDropZone";
import type { TreeNodeModel } from "../types/TreeNode";
import { useTreeContext } from "../context/TreeContext";

interface Props<T> {

    nodes: TreeNodeModel<T>[];

    parentId: string |null;

    depth:number;

}

export function TreeChildren<T>({
    nodes,
    parentId,
    depth
}:Props<T>){

    const {onInsert, onMove} = useTreeContext()

    return(

        <div style={{paddingLeft:depth*24}}>
            {
                !!onMove || !!onInsert ? 
                <TreeDropZone
                    parentId={parentId}
                    index={0}
                    onInsert={onInsert}
                />:null
            }

            {nodes.map((node,index)=>(

                <div key={node.id}>

                    <TreeNode
                        node={node}
                        depth={depth}
                    />
                    {
                        !!onMove || !!onInsert ? 
                        <TreeDropZone
                            parentId={parentId}
                            index={index+1}
                            onInsert={onInsert}
                        />:null
                    }

                </div>

            ))}

        </div>

    )

}