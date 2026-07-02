import { TreeChildren } from "./TreeChildren";
import { useTreeContext } from "../context/TreeContext";
import type { TreeNodeModel } from "../types/TreeNode";

interface Props<T>{

    node:TreeNodeModel<T>;

    depth:number;

}

export function TreeNode<T>({
    node,
    depth,
}:Props<T>){

    const tree=useTreeContext();

    return(

        <div>

            <div
                className="tree-node"
                style={{
                    paddingLeft:depth*24
                }}
            >

                {tree.renderNode(node)}

            </div>

            {!node.collapsed && node.children && (

                <TreeChildren

                    nodes={node.children}

                    parentId={node.id}

                    depth={depth+1}

                    onInsert={tree.onInsert}

                />

            )}

        </div>

    )

}