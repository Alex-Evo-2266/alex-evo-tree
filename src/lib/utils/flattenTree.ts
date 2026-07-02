import type { FlatNode } from "../types/FlatNode";
import type { TreeNodeModel } from "../types/TreeNode";

export function flattenTree<T>(

    tree: TreeNodeModel<T>[],

): FlatNode<T>[] {

    const result: FlatNode<T>[] = [];

    function walk(

        nodes: TreeNodeModel<T>[],

        depth: number,

        parentId: string | null,

    ) {

        nodes.forEach((node, index) => {

            result.push({

                node,

                depth,

                parentId,

                index,

            });

            if (

                !node.collapsed &&

                node.children?.length

            ) {

                walk(

                    node.children,

                    depth + 1,

                    node.id,

                );

            }

        });

    }

    walk(tree, 0, null);

    return result;

}