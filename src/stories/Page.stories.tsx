import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TreeBuilder, type MoveEvent, type TreeNodeModel } from "../lib";
import { moveNode } from "../lib/utils/moveNode";
import { cloneTree } from "../lib/utils/cloneTree";
import { removeNode } from "../lib/utils/removeNode";
import './demostype.scss'

/**
 * Пример данных
 */
type NodeData = {
    title: string;
};

const initialData: TreeNodeModel<NodeData>[] = [
    {
        id: "1",
        title: "Root 1",
        data: { title: "Root 1" },
        children: [
            {
                id: "1-1",
                title: "Child 1-1",
                data: { title: "Child 1-1" },
                children: [],
            },
            {
                id: "1-2",
                title: "Child 1-2",
                data: { title: "Child 1-2" },
                children: [],
            },
        ],
    },
    {
        id: "2",
        data: { title: "Root 2" },
        title: "Root 2",
        children: [
            {
                id: "2-1",
                title: "Child 2-1",
                data: { title: "Child 2-1" }
            },
        ],
    },
];

const meta: Meta<typeof TreeBuilder> = {
    title: "Components/TreeBuilder",
    component: TreeBuilder,
};

export default meta;

type Story = StoryObj<typeof TreeBuilder<NodeData>>;

/**
 * Controlled Tree Story
 */
export const Default: Story = {
    render: () => {

        const [data, setData] =
            useState<TreeNodeModel<NodeData>[]>(initialData);

        function move(event: MoveEvent) {
            setData(prev=>moveNode(prev, event.sourceId, event.parentId, event.index))
        }

        function deleteHandler(id: string) {
            setData(prev=>{
                const clone = cloneTree(prev)
                removeNode(clone, id)
                return clone
            })
        }

        return (
            <div style={{ padding: 20 }}>

                <TreeBuilder<NodeData>

                    items={data}

                    onInsert={(...e) => {
                        console.log("INSERT:", e);
                    }}

                    onMove={move}

                    onDelete={deleteHandler}

                    renderTrash={()=>(
                        <div id="delete-zone" className="delete-zone">
                        <div className="delete-zone-content">
                            <svg className="trash-icon" viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="1.5" fill="none">
                            <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m5 4v7m4-7v7"/>
                            </svg>
                            <span className="delete-text">Перетащите сюда элемент для удаления</span>
                            <span className="delete-hint">или кликните по элементу ✕</span>
                        </div>
                        </div>
                    )}

                    renderNode={(node) => (
                        <div
                            style={{
                                padding: "5px",
                                background: "red",
                                borderRadius: "10px",
                                margin: "5px",
                                color: "white",
                            }}
                        >
                            {node?.data?.title}
                        </div>
                    )}

                />

            </div>
        );
    },
};