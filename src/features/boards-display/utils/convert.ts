
export function convertBoardStringToGrid(boardString: string): string[][] {
    return boardString
        .replaceAll(" ", "")
        .split("\n")
        .filter((val) => { if (val.length > 0) return val })
        .map((v) => v.split(''));
}

export function convertStringGridToBooleanGrid(boardString: string[][]): boolean[][] {
    return boardString.map((row) => row.map((cell) => cell !== "X"));
}

export function convertBoardStringToBooleanGrid(boardString: string): boolean[][] {
    const stringGrid = convertBoardStringToGrid(boardString);
    return convertStringGridToBooleanGrid(stringGrid);
}