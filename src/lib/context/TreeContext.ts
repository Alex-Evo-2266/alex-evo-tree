import {
    createContext,
    useContext,
} from "react";

import type { TreeBuilderProps } from "../types/TreeBuilderProps";

export const TreeContext =
    createContext<TreeBuilderProps<any> | null>(null);

export function useTreeContext() {

    const ctx = useContext(TreeContext);

    if (!ctx) {

        throw new Error(
            "TreeContext not found",
        );

    }

    return ctx;

}