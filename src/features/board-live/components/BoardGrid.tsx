import type { CSSProperties } from "react";
import { Box } from "@mantine/core";
import BoardCells from "./BoardCells";
import { BotModel } from "@/features/board-live/types/BotModel";
import classes from "./Board.module.scss"
import { BoardPosition } from "@/features/board-live/types/BoardPosition";
import { useElementSize } from "@mantine/hooks";

export default function BoardGrid({ board, bots, start, end }: { board: boolean[][]; bots: BotModel[], start?: BoardPosition, end?: BoardPosition }) {
    const rows = board.length;
    const cols = board[0]?.length || 0;
    const { ref, height, width } = useElementSize()
    return (
        <Box className={classes.boardWrapper} ref={ref} style={{
            paddingLeft: (width - ((cols / rows) * height)) / 2
        }}>
            <Box
                className={classes.boardGrid}
                style={
                    {
                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                        gridTemplateRows: `repeat(${rows}, 1fr)`,
                        aspectRatio: `${cols} / ${rows}`,
                        "--cols": cols,
                        "--rows": rows,
                        maxHeight: height,
                    } as CSSProperties
                }
            >
                <BoardCells board={board} start={start} end={end} />

                {bots.map((bot) => (
                    <div
                        key={bot.name}
                        className={classes.boardBot}
                        style={
                            {
                                "--x": `${((bot.position.x + 0.5) / cols) * 100}%`,
                                "--y": `${((bot.position.y + 0.5) / rows) * 100}%`,
                            } as React.CSSProperties
                        }
                    />
                ))}
            </Box>
        </Box>
    );
}
