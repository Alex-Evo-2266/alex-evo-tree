
interface Props {

    parentId: string | null;

    index: number;

    onInsert?(
        parentId: string | null,
        index: number,
    ): void;

}

export function TreeDropZone({

    parentId,
    index,
    onInsert,

}: Props) {

    return (

        <div className="tree-drop-zone">

            <button
                className="tree-insert-button"
                onClick={() =>
                    onInsert?.(
                        parentId,
                        index,
                    )
                }
            >

                +

            </button>

        </div>

    );

}