import superjson from 'superjson';
import { useEffect } from "react";
import classes from './Board.module.css';
import { useLocalStorage } from '@mantine/hooks';

export default function Board({ board, downloadRef }: { board: string, downloadRef: React.RefObject<() => void> }) {

  const [boardGrid, setBoardGrid] = useLocalStorage<string[][]>({
    key: 'page-play-board-grid',
    defaultValue: [[]],
    serialize: superjson.stringify,
    deserialize: (str) => str === undefined ? [[]] : superjson.parse(str)
  });
  const rows = board.replaceAll(' ', '').split('\n');
  const gridRows = rows.length;
  const gridCols = rows[0].length || 0;
  const types = ['X', '_'];
  const altTypes = ['_', 'S', 'E'];
  const colors = (cell: string) => {
    switch (cell) {
      case 'X': return 'var(--mantine-color-text)';
      case '_': return 'var(--mantine-color-body)';
      case 'S': return 'green';
      case 'E': return 'blue';
      default: return 'transparent';
    }
  }

  const toggle = ((e: React.MouseEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
    let b = boardGrid;
    e.preventDefault();
    console.log(e)
    const t = e.shiftKey ? altTypes : types;
    for (let i = 0; i < t.length; i++) {
      if (b[rowIndex][colIndex] === t[i]) {
        b[rowIndex][colIndex] = t[(i + 1) % t.length];
        break;
      }
    }
    setBoardGrid([...b]);
  });

  const downloadBoard = () => {
    let boardString = '';
    for (let r = 0; r < boardGrid.length; r++) {
      boardString += boardGrid[r].join(' ') + '\n';
    }
    const element = document.createElement("a");
    const file = new Blob([boardString], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "board.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  downloadRef.current = downloadBoard;
  useEffect(() => {
    const grid = rows.map(row => row.split(''));
    setBoardGrid(grid);
  }, [board]);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${gridCols}, 20px)`,
      gridTemplateRows: `repeat(${gridRows}, 20px)`,
      gap: '2px',
    }} >
      {boardGrid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div className={classes.boardCell} key={`${rowIndex}-${colIndex}`} style={{
            backgroundColor: colors(cell)
          }}
            onClick={(e) => toggle(e, rowIndex, colIndex)}
          ></div>
        ))
      )}
    </div>
  );
}
