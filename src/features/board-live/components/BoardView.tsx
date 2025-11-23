import { useEffect, useRef, useState } from "react";
import { usePekkoGameLoop } from "@/features/board-live/hooks/usePekkoGameLoop";
import { Box } from "@mantine/core";
import { BoardStatusResponse } from "@/features/board-live/types/BoardStatusResponse";
import { BotModel } from "@/features/board-live/types/BotModel";
import BoardGrid from "./BoardGrid";
import { BoardPosition } from "@/features/board-live/types/BoardPosition";

function equal2DBool(a: boolean[][], b: boolean[][]): boolean {
    if (a === b) return true;                 // same reference
    if (!a || !b) return false;               // one is null/undefined
    if (a.length !== b.length) return false;  // different number of rows

    for (let i = 0; i < a.length; i++) {
        if (a[i].length !== b[i].length) return false;

        for (let j = 0; j < a[i].length; j++) {
            if (a[i][j] !== b[i][j]) return false;
        }
    }

    return true;
}

export default function BoardView() {
    const { start, stop } = usePekkoGameLoop();
    const [board, setBoard] = useState<boolean[][] | null>(null);
    const [bots, setBots] = useState<BotModel[]>([]);
    const latestStatusRef = useRef<BoardStatusResponse | null>(null);
    const rafRef = useRef<number | null>(null);
    const [targetPos, setTargetPos] = useState<BoardPosition | undefined>(undefined);
    const [startPos, setStartPos] = useState<BoardPosition | undefined>(undefined);

    useEffect(() => {
        start((status) => {
            if (!status) return;

            const prev = latestStatusRef.current;
            const boardChanged =
                !prev ||
                !equal2DBool(prev.matrix, status.matrix) ||
                prev.startPosition.x !== status.startPosition.x ||
                prev.startPosition.y !== status.startPosition.y ||
                prev.targetPosition.x !== status.targetPosition.x ||
                prev.targetPosition.y !== status.targetPosition.y;

            latestStatusRef.current = status; // always update latest snapshot for bots

            if (boardChanged) {
                setTargetPos(status.targetPosition);
                setStartPos(status.startPosition);
                setBoard(status.matrix);
            }
        });

        const loop = () => {
            const status = latestStatusRef.current;
            if (status) setBots(status.bots);
            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);

        return () => {
            stop();
            if (rafRef.current != null) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [start, stop]);

    if (!board) {
        return <Box>Waiting for board…</Box>;
    }

    return <BoardGrid board={board} bots={bots} start={startPos} end={targetPos} />;
}
