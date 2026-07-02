import type { ReactNode } from "react";

export interface TreeNodeModel<T = unknown> {

    id: string;

    title: string;

    type?: string;

    icon?: ReactNode;

    data?: T;

    collapsed?: boolean;

    disabled?: boolean;

    children?: TreeNodeModel<T>[];
}