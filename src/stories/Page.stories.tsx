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
    parameters: {
        docs: {
            description: {
                component: `
## TreeBuilder Component

Компонент для построения деревьев с поддержкой drag-and-drop, перемещения и удаления узлов.

### Props

| Prop | Type | Description |
|------|------|-------------|
| \`items\` | \`TreeNodeModel<T>[]\` | **Required**. Массив узлов дерева |
| \`renderNode\` | \`(node: TreeNodeModel<T>) => ReactNode\` | **Required**. Функция рендеринга узла |
| \`renderTrash\` | \`() => ReactNode\` | Функция рендеринга корзины для удаления |
| \`trashPosition\` | \`'top' \| 'bottom' \| 'left' \| 'right'\` | Позиция корзины (по умолчанию: 'bottom') |
| \`onMove\` | \`(event: MoveEvent) => void\` | Колбэк при перемещении узла |
| \`onInsert\` | \`(parentId: string \| null, index: number) => void\` | Колбэк при вставке нового узла |
| \`onDelete\` | \`(id: string) => void\` | Колбэк при удалении узла |

### TreeNodeModel

| Prop | Type | Description |
|------|------|-------------|
| \`id\` | \`string\` | **Required**. Уникальный идентификатор узла |
| \`title\` | \`string\` | **Required**. Заголовок узла |
| \`type\` | \`string\` | Тип узла (опционально) |
| \`icon\` | \`ReactNode\` | Иконка узла (опционально) |
| \`data\` | \`T\` | Пользовательские данные узла (опционально) |
| \`collapsed\` | \`boolean\` | Свернут ли узел (опционально) |
| \`disabled\` | \`boolean\` | Отключен ли узел (опционально) |
| \`children\` | \`TreeNodeModel<T>[]\` | Дочерние узлы (опционально) |
                `
            }
        }
    },
    argTypes: {
        trashPosition: {
            control: 'select',
            options: ['top', 'bottom', 'left', 'right'],
            description: 'Позиция корзины для удаления элементов',
            defaultValue: 'bottom'
        },
        onDelete: {
            description: 'Колбэк вызываемый при удалении узла',
            table: {
                type: { summary: '(id: string) => void' }
            }
        },
        onMove: {
            description: 'Колбэк вызываемый при перемещении узла',
            table: {
                type: { summary: '(event: MoveEvent) => void' }
            }
        },
        onInsert: {
            description: 'Колбэк вызываемый при вставке нового узла',
            table: {
                type: { summary: '(parentId: string | null, index: number) => void' }
            }
        }
    }
};

export default meta;

type Story = StoryObj<typeof TreeBuilder<NodeData>>;

// Общий компонент-обертка для всех историй
const TreeBuilderWrapper = ({ 
    position, 
    customTrash,
    showIcons = false
}: { 
    position?: 'top' | 'bottom' | 'left' | 'right';
    customTrash?: () => React.ReactNode;
    showIcons?: boolean;
}) => {
    const [data, setData] = useState<TreeNodeModel<NodeData>[]>(initialData);

    function move(event: MoveEvent) {
        setData(prev => moveNode(prev, event.sourceId, event.parentId, event.index));
    }

    function deleteHandler(id: string) {
        setData(prev => {
            const clone = cloneTree(prev);
            removeNode(clone, id);
            return clone;
        });
    }

    return (
        <div style={{ padding: 20, height: '500px' }}>
            <TreeBuilder<NodeData>
                items={data}
                onInsert={(...e) => console.log("INSERT:", e)}
                onMove={move}
                onDelete={deleteHandler}
                trashPosition={position}
                renderTrash={customTrash || (() => (
                    <div id="delete-zone" className="delete-zone">
                        <div className="delete-zone-content">
                            <svg className="trash-icon" viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="1.5" fill="none">
                                <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m5 4v7m4-7v7"/>
                            </svg>
                            <span className="delete-text">Перетащите сюда элемент для удаления</span>
                            <span className="delete-hint">или кликните по элементу ✕</span>
                        </div>
                    </div>
                ))}
                renderNode={(node) => (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: "10px 15px",
                            background: node.disabled ? '#e0e0e0' : '#4CAF50',
                            borderRadius: "8px",
                            margin: "5px",
                            color: node.disabled ? '#999' : 'white',
                            cursor: node.disabled ? 'not-allowed' : 'grab',
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            transition: "all 0.2s",
                            opacity: node.disabled ? 0.6 : 1
                        }}
                    >
                        {showIcons && node.icon && <span>{node.icon}</span>}
                        {node.data?.title || node.title}
                        {node.type && (
                            <span style={{ 
                                fontSize: 10, 
                                background: 'rgba(255,255,255,0.2)',
                                padding: '2px 8px',
                                borderRadius: 10,
                                marginLeft: 'auto'
                            }}>
                                {node.type}
                            </span>
                        )}
                    </div>
                )}
            />
        </div>
    );
};

// 1. Корзина снизу (по умолчанию)
export const BottomTrash: Story = {
    parameters: {
        docs: {
            description: {
                story: `
### Корзина снизу (по умолчанию)

Стандартное расположение корзины внизу дерева. 
Используется когда \`trashPosition\` не указан или установлен в \`'bottom'\`.

\`\`\`tsx
<TreeBuilder
    items={data}
    onMove={move}
    onDelete={deleteHandler}
    trashPosition="bottom"
    renderTrash={() => <YourTrashComponent />}
    renderNode={(node) => <YourNodeComponent node={node} />}
/>
\`\`\`
                `
            }
        }
    },
    render: () => <TreeBuilderWrapper position="bottom" />
};

// 2. Корзина сверху
export const TopTrash: Story = {
    parameters: {
        docs: {
            description: {
                story: `
### Корзина сверху

Расположение корзины в верхней части дерева.
Полезно когда дерево находится внизу экрана или для мобильных устройств.

\`\`\`tsx
<TreeBuilder
    items={data}
    onMove={move}
    onDelete={deleteHandler}
    trashPosition="top"
    renderTrash={() => <YourTrashComponent />}
    renderNode={(node) => <YourNodeComponent node={node} />}
/>
\`\`\`
                `
            }
        }
    },
    render: () => <TreeBuilderWrapper position="top" />
};

// 3. Корзина слева
export const LeftTrash: Story = {
    parameters: {
        docs: {
            description: {
                story: `
### Корзина слева

Вертикальная корзина слева от дерева.
Идеально для широких экранов или когда нужно сэкономить вертикальное пространство.

\`\`\`tsx
<TreeBuilder
    items={data}
    onMove={move}
    onDelete={deleteHandler}
    trashPosition="left"
    renderTrash={() => <YourTrashComponent />}
    renderNode={(node) => <YourNodeComponent node={node} />}
/>
\`\`\`
                `
            }
        }
    },
    render: () => <TreeBuilderWrapper position="left" />
};

// 4. Корзина справа
export const RightTrash: Story = {
    parameters: {
        docs: {
            description: {
                story: `
### Корзина справа

Вертикальная корзина справа от дерева.
Удобно для RTL языков или при работе с боковыми панелями.

\`\`\`tsx
<TreeBuilder
    items={data}
    onMove={move}
    onDelete={deleteHandler}
    trashPosition="right"
    renderTrash={() => <YourTrashComponent />}
    renderNode={(node) => <YourNodeComponent node={node} />}
/>
\`\`\`
                `
            }
        }
    },
    render: () => <TreeBuilderWrapper position="right" />
};

// 5. Все позиции в одной истории
export const AllPositions: Story = {
    parameters: {
        docs: {
            description: {
                story: `
### Все позиции корзины

Демонстрация всех доступных позиций корзины одновременно.
Позволяет сравнить различные варианты расположения.

| Позиция | Когда использовать |
|---------|-------------------|
| top | Если дерево внизу страницы |
| bottom | Стандартное расположение |
| left | Для широких экранов |
| right | Для RTL интерфейсов |
                `
            }
        }
    },
    render: () => {
        const positions: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right'];
        
        return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: 20 }}>
                {positions.map(pos => (
                    <div key={pos} style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: 8, 
                        padding: 10,
                        background: '#fafafa'
                    }}>
                        <h3 style={{ textAlign: 'center', marginBottom: 10, textTransform: 'capitalize' }}>
                            {pos} position
                        </h3>
                        <div style={{ height: '400px' }}>
                            <TreeBuilderWrapper position={pos} />
                        </div>
                    </div>
                ))}
            </div>
        );
    }
};

// 6. Кастомная корзина с эмодзи
export const EmojiTrash: Story = {
    parameters: {
        docs: {
            description: {
                story: `
### Кастомная корзина с эмодзи

Пример использования кастомного рендеринга корзины с помощью \`renderTrash\` пропса.
Можно использовать любые React компоненты, иконки и стили.

\`\`\`tsx
renderTrash={() => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        fontSize: 24,
        padding: 20,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 12,
        color: 'white',
        minHeight: 80
    }}>
        <span>🗑️</span>
        <span style={{ fontSize: 18 }}>Drop here to delete</span>
        <span>💀</span>
    </div>
)}
/>
\`\`\`
                `
            }
        }
    },
    render: () => (
        <TreeBuilderWrapper 
            position="bottom"
            customTrash={() => (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    fontSize: 24,
                    padding: 20,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 12,
                    color: 'white',
                    minHeight: 80
                }}>
                    <span>🗑️</span>
                    <span style={{ fontSize: 18 }}>Drop here to delete</span>
                    <span>💀</span>
                </div>
            )}
        />
    )
};

// 7. Минималистичная корзина
export const MinimalTrash: Story = {
    parameters: {
        docs: {
            description: {
                story: `
### Минималистичная корзина

Простая и минималистичная корзина без лишних элементов.
Подходит для чистого и современного дизайна.

\`\`\`tsx
renderTrash={() => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        border: '2px dashed #999',
        borderRadius: 6,
        background: 'transparent',
        fontSize: 14,
        color: '#666',
        minHeight: 60,
        writingMode: 'vertical-lr',
        letterSpacing: 4
    }}>
        🗑 DELETE
    </div>
)}
/>
\`\`\`
                `
            }
        }
    },
    render: () => (
        <TreeBuilderWrapper 
            position="right"
            customTrash={() => (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 12,
                    border: '2px dashed #999',
                    borderRadius: 6,
                    background: 'transparent',
                    fontSize: 14,
                    color: '#666',
                    minHeight: 60,
                    transition: 'all 0.3s',
                    writingMode: 'vertical-lr',
                    letterSpacing: 4
                }}>
                    🗑 DELETE
                </div>
            )}
        />
    )
};

// 8. Корзина с анимацией
export const AnimatedTrash: Story = {
    parameters: {
        docs: {
            description: {
                story: `
### Анимированная корзина

Корзина с hover-анимациями и визуальными эффектами.
Улучшает пользовательский опыт за счет обратной связи.

\`\`\`tsx
const [isHover, setIsHover] = useState(false);

renderTrash={() => (
    <div 
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: 16,
            background: isHover ? '#ff1744' : '#ff6b6b',
            borderRadius: 12,
            color: 'white',
            fontSize: 18,
            fontWeight: 600,
            minHeight: 80,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isHover ? 'scale(1.02)' : 'scale(1)',
            boxShadow: isHover ? '0 8px 25px rgba(255, 23, 68, 0.4)' : 'none'
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
    >
        <span style={{ fontSize: 32 }}>🗑️</span>
        <span>Перетащите сюда для удаления</span>
        <span style={{ fontSize: 20 }}>⬇️</span>
    </div>
)}
/>
\`\`\`
                `
            }
        }
    },
    render: () => {
        const [isHover, setIsHover] = useState(false);
        
        return (
            <TreeBuilderWrapper 
                position="top"
                customTrash={() => (
                    <div 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 16,
                            padding: 16,
                            background: isHover ? '#ff1744' : '#ff6b6b',
                            borderRadius: 12,
                            color: 'white',
                            fontSize: 18,
                            fontWeight: 600,
                            minHeight: 80,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: isHover ? 'scale(1.02)' : 'scale(1)',
                            boxShadow: isHover ? '0 8px 25px rgba(255, 23, 68, 0.4)' : 'none'
                        }}
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                    >
                        <span style={{ fontSize: 32 }}>🗑️</span>
                        <span>Перетащите сюда для удаления</span>
                        <span style={{ fontSize: 20 }}>⬇️</span>
                    </div>
                )}
            />
        );
    }
};

// 9. Корзина с счетчиком удалений
export const TrashWithCounter: Story = {
    parameters: {
        docs: {
            description: {
                story: `
### Корзина с счетчиком удалений

Продвинутая корзина, которая отслеживает количество удаленных элементов.
Показывает пользователю статистику его действий.

\`\`\`tsx
const [deletedCount, setDeletedCount] = useState(0);

function deleteHandler(id: string) {
    // ... удаление узла
    setDeletedCount(prev => prev + 1);
}

renderTrash={() => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        background: '#f8f9fa',
        borderRadius: 12,
        border: '2px dashed #dee2e6',
        minHeight: 80
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>🗑️</span>
            <span style={{ fontSize: 16, color: '#495057' }}>
                Перетащите сюда для удаления
            </span>
        </div>
        <div style={{
            background: '#ff6b6b',
            color: 'white',
            padding: '4px 16px',
            borderRadius: 20,
            fontSize: 18,
            fontWeight: 700
        }}>
            {deletedCount} удалено
        </div>
    </div>
)}
/>
\`\`\`
                `
            }
        }
    },
    render: () => {
        const [deletedCount, setDeletedCount] = useState(0);
        const [data, setData] = useState<TreeNodeModel<NodeData>[]>(initialData);

        function move(event: MoveEvent) {
            setData(prev => moveNode(prev, event.sourceId, event.parentId, event.index));
        }

        function deleteHandler(id: string) {
            setData(prev => {
                const clone = cloneTree(prev);
                removeNode(clone, id);
                return clone;
            });
            setDeletedCount(prev => prev + 1);
        }

        return (
            <div style={{ padding: 20, height: '500px' }}>
                <TreeBuilder<NodeData>
                    items={data}
                    onInsert={(...e) => console.log("INSERT:", e)}
                    onMove={move}
                    onDelete={deleteHandler}
                    trashPosition="bottom"
                    renderTrash={() => (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px 24px',
                            background: '#f8f9fa',
                            borderRadius: 12,
                            border: '2px dashed #dee2e6',
                            minHeight: 80
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontSize: 28 }}>🗑️</span>
                                <span style={{ fontSize: 16, color: '#495057' }}>
                                    Перетащите сюда для удаления
                                </span>
                            </div>
                            <div style={{
                                background: '#ff6b6b',
                                color: 'white',
                                padding: '4px 16px',
                                borderRadius: 20,
                                fontSize: 18,
                                fontWeight: 700
                            }}>
                                {deletedCount} удалено
                            </div>
                        </div>
                    )}
                    renderNode={(node) => (
                        <div
                            style={{
                                padding: "10px 15px",
                                background: "#4CAF50",
                                borderRadius: "8px",
                                margin: "5px",
                                color: "white",
                                cursor: "grab",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                            }}
                        >
                            {node?.data?.title}
                        </div>
                    )}
                />
            </div>
        );
    }
};

// 10. Вертикальная корзина с иконками
export const VerticalTrashWithIcons: Story = {
    parameters: {
        docs: {
            description: {
                story: `
### Вертикальная корзина с иконками

Вертикальная корзина с ярким дизайном и иконками.
Отлично подходит для современного интерфейса с акцентом на визуал.

\`\`\`tsx
renderTrash={() => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 20,
        background: '#1a1a2e',
        borderRadius: 12,
        color: 'white',
        minWidth: 80,
        minHeight: 200
    }}>
        <span style={{ fontSize: 32 }}>🗑️</span>
        <div style={{ 
            writingMode: 'vertical-lr', 
            letterSpacing: 4,
            fontSize: 14,
            opacity: 0.8
        }}>
            УДАЛИТЬ
        </div>
        <span style={{ fontSize: 20 }}>⬅️</span>
    </div>
)}
/>
\`\`\`
                `
            }
        }
    },
    render: () => (
        <TreeBuilderWrapper 
            position="left"
            customTrash={() => (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    padding: 20,
                    background: '#1a1a2e',
                    borderRadius: 12,
                    color: 'white',
                    minWidth: 80,
                    minHeight: 200
                }}>
                    <span style={{ fontSize: 32 }}>🗑️</span>
                    <div style={{ 
                        writingMode: 'vertical-lr', 
                        letterSpacing: 4,
                        fontSize: 14,
                        opacity: 0.8
                    }}>
                        УДАЛИТЬ
                    </div>
                    <span style={{ fontSize: 20 }}>⬅️</span>
                </div>
            )}
        />
    )
};

// 11. Дерево с иконками и типами узлов
export const TreeWithIconsAndTypes: Story = {
    parameters: {
        docs: {
            description: {
                story: `
### Дерево с иконками и типами узлов

Расширенный пример использования всех свойств \`TreeNodeModel\`:
- \`icon\` - иконка узла
- \`type\` - тип узла (отображается как тег)
- \`disabled\` - отключенные узлы
- \`collapsed\` - свернутые узлы

\`\`\`tsx
const data: TreeNodeModel<NodeData>[] = [
    {
        id: "1",
        title: "Root 1",
        icon: <span>📁</span>,
        type: "folder",
        children: [
            {
                id: "1-1",
                title: "File 1",
                icon: <span>📄</span>,
                type: "file",
                disabled: true
            }
        ]
    }
];
\`\`\`
                `
            }
        }
    },
    render: () => {
        const dataWithIcons: TreeNodeModel<NodeData>[] = [
            {
                id: "1",
                title: "Root 1",
                data: { title: "📁 Root 1" },
                icon: <span>📁</span>,
                type: "folder",
                children: [
                    {
                        id: "1-1",
                        title: "Child 1-1",
                        data: { title: "📄 Child 1-1" },
                        icon: <span>📄</span>,
                        type: "file",
                        children: [],
                    },
                    {
                        id: "1-2",
                        title: "Child 1-2",
                        data: { title: "⚙️ Child 1-2" },
                        icon: <span>⚙️</span>,
                        type: "config",
                        children: [],
                    },
                ],
            },
            {
                id: "2",
                data: { title: "📁 Root 2" },
                title: "Root 2",
                icon: <span>📁</span>,
                type: "folder",
                children: [
                    {
                        id: "2-1",
                        title: "Child 2-1",
                        data: { title: "🔒 Child 2-1" },
                        icon: <span>🔒</span>,
                        type: "protected",
                        disabled: true,
                    },
                ],
            },
        ];

        const [data, setData] = useState<TreeNodeModel<NodeData>[]>(dataWithIcons);

        function move(event: MoveEvent) {
            setData(prev => moveNode(prev, event.sourceId, event.parentId, event.index));
        }

        function deleteHandler(id: string) {
            setData(prev => {
                const clone = cloneTree(prev);
                removeNode(clone, id);
                return clone;
            });
        }

        return (
            <div style={{ padding: 20, height: '500px' }}>
                <TreeBuilder<NodeData>
                    items={data}
                    onInsert={(...e) => console.log("INSERT:", e)}
                    onMove={move}
                    onDelete={deleteHandler}
                    trashPosition="bottom"
                    renderTrash={() => (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 16,
                            padding: 20,
                            background: '#fff3e0',
                            borderRadius: 12,
                            border: '2px dashed #ff9800',
                            minHeight: 80,
                            fontSize: 18,
                            color: '#e65100'
                        }}>
                            <span style={{ fontSize: 32 }}>🗑️</span>
                            <span>Перетащите сюда для удаления</span>
                        </div>
                    )}
                    renderNode={(node) => (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: "10px 15px",
                                background: node.disabled ? '#f5f5f5' : '#e3f2fd',
                                borderRadius: "8px",
                                margin: "5px",
                                color: node.disabled ? '#999' : '#0d47a1',
                                cursor: node.disabled ? 'not-allowed' : 'grab',
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                transition: "all 0.2s",
                                opacity: node.disabled ? 0.6 : 1,
                                borderLeft: `4px solid ${node.type === 'folder' ? '#ff9800' : node.type === 'file' ? '#4caf50' : '#2196f3'}`
                            }}
                        >
                            {node.icon && <span style={{ fontSize: 20 }}>{node.icon}</span>}
                            <span style={{ fontWeight: 500 }}>{node.data?.title || node.title}</span>
                            {node.type && (
                                <span style={{ 
                                    fontSize: 10, 
                                    background: 'rgba(0,0,0,0.1)',
                                    padding: '2px 8px',
                                    borderRadius: 10,
                                    marginLeft: 'auto',
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5
                                }}>
                                    {node.type}
                                </span>
                            )}
                            {node.disabled && (
                                <span style={{ 
                                    fontSize: 12,
                                    color: '#f44336'
                                }}>
                                    🔒
                                </span>
                            )}
                        </div>
                    )}
                />
            </div>
        );
    }
};



// 11. Дерево с иконками и типами узлов
export const notMove: Story = {

    render: () => {
        const dataWithIcons: TreeNodeModel<NodeData>[] = [
            {
                id: "1",
                title: "Root 1",
                data: { title: "📁 Root 1" },
                icon: <span>📁</span>,
                type: "folder",
                children: [
                    {
                        id: "1-1",
                        title: "Child 1-1",
                        data: { title: "📄 Child 1-1" },
                        icon: <span>📄</span>,
                        type: "file",
                        children: [],
                    },
                    {
                        id: "1-2",
                        title: "Child 1-2",
                        data: { title: "⚙️ Child 1-2" },
                        icon: <span>⚙️</span>,
                        type: "config",
                        children: [],
                    },
                ],
            },
            {
                id: "2",
                data: { title: "📁 Root 2" },
                title: "Root 2",
                icon: <span>📁</span>,
                type: "folder",
                children: [
                    {
                        id: "2-1",
                        title: "Child 2-1",
                        data: { title: "🔒 Child 2-1" },
                        icon: <span>🔒</span>,
                        type: "protected",
                        disabled: true,
                    },
                ],
            },
        ];

        const [data] = useState<TreeNodeModel<NodeData>[]>(dataWithIcons);


        return (
            <div style={{ padding: 20, height: '500px' }}>
                <TreeBuilder<NodeData>
                    items={data}
                    trashPosition="bottom"
                    renderNode={(node) => (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: "10px 15px",
                                background: node.disabled ? '#f5f5f5' : '#e3f2fd',
                                borderRadius: "8px",
                                margin: "5px",
                                color: node.disabled ? '#999' : '#0d47a1',
                                cursor: node.disabled ? 'not-allowed' : 'grab',
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                transition: "all 0.2s",
                                opacity: node.disabled ? 0.6 : 1,
                                borderLeft: `4px solid ${node.type === 'folder' ? '#ff9800' : node.type === 'file' ? '#4caf50' : '#2196f3'}`
                            }}
                        >
                            {node.icon && <span style={{ fontSize: 20 }}>{node.icon}</span>}
                            <span style={{ fontWeight: 500 }}>{node.data?.title || node.title}</span>
                            {node.type && (
                                <span style={{ 
                                    fontSize: 10, 
                                    background: 'rgba(0,0,0,0.1)',
                                    padding: '2px 8px',
                                    borderRadius: 10,
                                    marginLeft: 'auto',
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5
                                }}>
                                    {node.type}
                                </span>
                            )}
                            {node.disabled && (
                                <span style={{ 
                                    fontSize: 12,
                                    color: '#f44336'
                                }}>
                                    🔒
                                </span>
                            )}
                        </div>
                    )}
                />
            </div>
        );
    }
};