import { useEffect, useRef } from "react";
import { usePekkoGameLoop } from "@/hooks/usePekkoGameLoop";
import { Box } from "@mantine/core";

export default function BoardView() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const boxRef = useRef<HTMLDivElement>(null)
    const { start, stop } = usePekkoGameLoop();

    useEffect(() => {
        const ctx = canvasRef.current!.getContext("2d")!;
        const box = boxRef.current!;
        const width = box.clientWidth;
        const height = box.clientHeight;
        canvasRef.current!.width = width;
        canvasRef.current!.height = height;
        const tileSize = 20;
        const tile = Math.min(width, height) / tileSize;
        // user draw fn
        start((status) => {
            if (!status) return;

            const { matrix, bots, phase, startPosition, targetPosition } = status;

            ctx.clearRect(0, 0, width, height);
            const maxTilesX = Math.floor(width / matrix[0].length * tileSize);
            const maxTilesY = Math.floor(height / matrix.length * tileSize);

            ctx.font = "16px Arial";
            // draw tiles
            for (let y = 0; y < matrix.length; y++) {
                for (let x = 0; x < matrix[y].length; x++) {
                    ctx.fillStyle = matrix[y][x] ? "black" : "gray";
                    if (startPosition.x === x && startPosition.y === y) {
                        ctx.fillStyle = "green";
                    } else if (targetPosition.x === x && targetPosition.y === y) {
                        ctx.fillStyle = "blue";
                    }
                    ctx.fillRect(x * tile, y * tile, tile, tile);
                }
            }

            // draw bots
            for (const bot of bots) {
                ctx.fillStyle = "red";
                ctx.beginPath();
                ctx.arc(
                    bot.position.x * tile + tile / 2,
                    bot.position.y * tile + tile / 2,
                    8, 0, Math.PI * 2
                );
                ctx.fill();
            }

            // draw phase text
            ctx.fillStyle = "black";
            ctx.fillText(phase, 10, 20);
        });

        return () => stop();
    }, [start, stop]);


    return (
        <Box ref={boxRef} style={{
            border: '1px solid var(--mantine-color-gray-4)',
            flexGrow: "1",
        }}>
            <canvas ref={canvasRef} width="100%" height="100%" />
        </Box>
    )
}
