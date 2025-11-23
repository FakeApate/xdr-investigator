import classes from "./Board.module.scss";

export default function BoardCells({ board, start, end }: { board: boolean[][], start?: { x: number, y: number }, end?: { x: number, y: number } }) {
    const cells = board.map((row) => row.map((cell) => (cell ? classes.boardCellFloor : classes.boardCellWall)));
    if (start) {
        cells[start.y][start.x] = classes.boardCellStart;
    }
    if (end) {
        cells[end.y][end.x] = classes.boardCellTarget;
    }
    return (
        <>
            {cells.map((row, r) =>
                row.map((cell, c) => (
                    <div
                        key={`${r}-${c}`}
                        className={`${classes.boardCell} ${cell}`}
                    />
                ))
            )}
        </>
    );
}