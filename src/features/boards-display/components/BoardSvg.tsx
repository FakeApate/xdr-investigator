import { convertBoardStringToBooleanGrid, convertStringGridToBooleanGrid } from "../utils/convert";

export function BoardGridSvg({ board, sboard, boardstring }: { board?: boolean[][], sboard?: string[][], boardstring?: string }) {
    if (!board) {
        if (sboard) {
            board = convertStringGridToBooleanGrid(sboard)
        } else if (boardstring) {
            board = convertBoardStringToBooleanGrid(boardstring)
        }
        else {
            return <svg></svg>
        }

    }

    const rows = board.length;
    const cols = board[0].length;
    const cellSize = 20;
    const width = cols * cellSize;
    const height = rows * cellSize;
    const stroke = "#888"
    const strokeWidth = 0.5
    const cellColor = (cell: boolean) => cell ? "#444" : "#1e1e1e";
    return (
        <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${height}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            {
                board.map((row, y) =>
                    row.map((cell, x) => (
                        <rect
                            key={`${x}-${y}`}
                            x={x * cellSize}
                            y={y * cellSize}
                            width={cellSize}
                            height={cellSize}
                            fill={cellColor(cell)}
                            stroke={stroke}
                            strokeWidth={strokeWidth}
                        />
                    )))
            }
        </svg>
    )
}