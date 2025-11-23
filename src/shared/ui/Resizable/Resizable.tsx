// components/Resizable.tsx
import { Box } from "@mantine/core";
import { useState, useRef } from "react";

export function Resizable({ min = 200, max = 1000, children }: { min?: number; max?: number; children: React.ReactNode }) {
    const [width, setWidth] = useState(400);
    const start = useRef<number | null>(null);

    return (
        <Box
            pos="relative"
            style={{ width }}
            onPointerMove={(e) => {
                if (start.current != null) {
                    const newWidth = Math.min(max, Math.max(min, e.clientX - start.current));
                    setWidth(newWidth);
                }
            }}
            onPointerUp={() => (start.current = null)}
        >
            {children}

            <Box
                pos="absolute"
                bottom={4}
                right={4}
                w={14}
                h={14}
                bg="gray.6"
                style={{ cursor: "nwse-resize" }}
                onPointerDown={(e) => {
                    start.current = e.clientX - width;
                    (e.target as HTMLElement).setPointerCapture(e.pointerId);
                }}
            />
        </Box>
    );
}
