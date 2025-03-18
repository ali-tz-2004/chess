import { CellType } from "../type/ChessTypes";

const countRow = 8;
const countColumn = 8;

export const clearMovesAndSelection = (
  cells: CellType[][],
  setCells: (cells: CellType[][]) => void,
  firstIndex: number | undefined = undefined,
  secondIndex: number | undefined = undefined,
  isCheck: boolean = false
) => {
  let cell = [...cells];

  for (let i = 0; i < countRow; i++) {
    for (let j = 0; j < countColumn; j++) {
      if (firstIndex === i && secondIndex === j) continue;
      cell[i][j].isAllowMove = false;
      cell[i][j].selected = false;
      if (isCheck) cell[i][j].isCheck = false;
    }
  }

  setCells(cell);
};

export const updateSelectionAndMoves = (
  index: number[][],
  status: boolean,
  cells: CellType[][],
  setCells: (cells: CellType[][]) => void
) => {
  let cell = [...cells];

  for (let i = 0; i < countRow; i++) {
    for (let j = 0; j < countColumn; j++) {
      cell[i][j].isAllowMove = false;
      cell[i][j].selected = false;
    }
  }

  for (let i = 0; i < index.length; i++) {
    if (i === 0) {
      cell[index[i][0]][index[i][1]].selected = status;
    } else {
      cell[index[i][0]][index[i][1]].isAllowMove = status;
    }
  }

  setCells(cell);
};
