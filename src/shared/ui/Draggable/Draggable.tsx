// components/Draggable.tsx
import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";

export function Draggable({ id, children }: { id: string; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

    const style = transform
        ? { transform: CSS.Translate.toString(transform), touchAction: "none" }
        : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {children}
        </div>
    );
}
