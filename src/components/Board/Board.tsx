import superjson from 'superjson';
import React, { useEffect, useState } from 'react';
import classes from './Board.module.css';
import { useLocalStorage } from '@mantine/hooks';

export default function Board({
  board,
  downloadRef,
}: {
  board: string;
  downloadRef: React.RefObject<() => void>;
}) {
  const [boardGrid, setBoardGrid] = useLocalStorage<string[][]>({
    key: 'page-play-board-grid',
    defaultValue: [[]],
    serialize: superjson.stringify,
    deserialize: (str) => (str === undefined ? [[]] : superjson.parse(str)),
  });

  const [paintChar, setPaintChar] = useState<string | null>(null);

  const rows = board.replaceAll(' ', '').split('\n');
  const gridRows = rows.length;
  const gridCols = rows[0]?.length || 0;

  const types = ['X', '_'];
  const altTypes = ['_', 'S', 'E'];

  const colors = (cell: string) => {
    switch (cell) {
      case 'X':
        return 'var(--mantine-color-text)';
      case '_':
        return 'var(--mantine-color-body)';
      case 'S':
        return 'green';
      case 'E':
        return 'blue';
      default:
        return 'transparent';
    }
  };

  const setCell = (rowIndex: number, colIndex: number, value: string) => {
    setBoardGrid((prev) =>
      prev.map((row, r) =>
        row.map((cell, c) => (r === rowIndex && c === colIndex ? value : cell))
      )
    );
  };

  const computeNextChar = (
    cell: string,
    e: React.PointerEvent<HTMLDivElement>
  ): string => {
    if (e.button === 2) {
      return '_';
    }

    const t = e.shiftKey ? altTypes : types;
    const idx = t.indexOf(cell);

    if (idx === -1) {
      return t[0];
    }

    return t[(idx + 1) % t.length];
  };

  const handlePointerDown =
    (rowIndex: number, colIndex: number) =>
      (e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        const currentCell = boardGrid[rowIndex]?.[colIndex];
        if (currentCell == null) return;
        const next = computeNextChar(currentCell, e);
        setPaintChar(next);
        setCell(rowIndex, colIndex, next);
      };

  const handlePointerEnter =
    (rowIndex: number, colIndex: number) =>
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.buttons === 0) return;
        if (paintChar == null) return;

        setCell(rowIndex, colIndex, paintChar);
      };

  const handlePointerUp = () => {
    setPaintChar(null);
  };

  useEffect(() => {
    downloadRef.current = () => {
      let boardString = '';
      for (let r = 0; r < boardGrid.length; r++) {
        boardString += boardGrid[r].join(' ') + '\n';
      }
      const element = document.createElement('a');
      const file = new Blob([boardString], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'board.txt';
      document.body.appendChild(element);
      element.click();
    };
  }, [boardGrid, downloadRef]);

  useEffect(() => {
    const grid = rows.map((row) => row.split(''));
    setBoardGrid(grid);
  }, [board, rows, setBoardGrid]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridCols}, 20px)`,
        gridTemplateRows: `repeat(${gridRows}, 20px)`,
        gap: '2px',
        userSelect: 'none',
      }}
      onPointerUp={handlePointerUp}
      onPointerLeave={(e) => {
        if (e.buttons === 0) setPaintChar(null);
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {boardGrid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            className={classes.boardCell}
            key={`${rowIndex}-${colIndex}`}
            style={{
              backgroundColor: colors(cell),
            }}
            onPointerDown={handlePointerDown(rowIndex, colIndex)}
            onPointerEnter={handlePointerEnter(rowIndex, colIndex)}
            onContextMenu={(e) => e.preventDefault()}
          />
        ))
      )}
    </div>
  );
}
