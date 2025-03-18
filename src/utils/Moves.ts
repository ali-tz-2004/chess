import { cellColorType, CellType, PositionsCheckedPiece, StatusBishopOrQueenType, StatusRookOrQueenType } from "../type/ChessTypes";
import {
  preventingCheckRookOrQueen,
  preventingCheckBishopOrQueen,
  allowMoveKing,
} from "./CheckHandler";
import { updateSelectionAndMoves } from "./ClearMove";

const firstCell = 0;
const lastCell = 8;

export const isRookOrQueen = (
  updatedCells: CellType[][],
  row: number,
  col: number
) => {
  const piece = updatedCells[row][col].piece;
  return piece === "Rook" || piece === "Queen";
};

export const isBishopOrQueen = (
  updatedCells: CellType[][],
  row: number,
  col: number
) => {
  const piece = updatedCells[row][col].piece;
  return piece === "Bishop" || piece === "Queen";
};

export const checkUpdatePice = (cells: CellType[][]): boolean => {
    return cells.some((row) => row.some((cell) => cell.isUpdatePice));
};

export const checkForAllowMoves = (cells: CellType[][]) => {
for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
    if (cells[i][j].isAllowMove) {
        return true;
    }
    }
}
return false;
};


export const handlePawnMoves = (
  updatedCells: CellType[][],
  firstIndex: number,
  secondIndex: number,
  direction: number,
  startRow: number,
  enemyColor: "black" | "white",
  positionsCheckedPiece?: PositionsCheckedPiece | undefined
) => {
  const selectedCell = updatedCells[firstIndex][secondIndex];

  if (
    firstIndex === startRow &&
    !updatedCells[firstIndex + direction][secondIndex].piece &&
    !updatedCells[firstIndex + 2 * direction][secondIndex].piece
  ) {
    if (positionsCheckedPiece) {
      if (
        preventingCheckRookOrQueen(
          updatedCells,
          firstIndex + direction,
          secondIndex,
          positionsCheckedPiece
        ) ||
        preventingCheckBishopOrQueen(
          updatedCells,
          firstIndex + direction,
          secondIndex,
          positionsCheckedPiece
        )
      ) {
        updatedCells[firstIndex + direction][secondIndex].isAllowMove =
          selectedCell.selected;
      }
      if (
        preventingCheckRookOrQueen(
          updatedCells,
          firstIndex + 2 * direction,
          secondIndex,
          positionsCheckedPiece
        ) ||
        preventingCheckBishopOrQueen(
          updatedCells,
          firstIndex + 2 * direction,
          secondIndex,
          positionsCheckedPiece
        )
      ) {
        updatedCells[firstIndex + 2 * direction][secondIndex].isAllowMove =
          selectedCell.selected;
      }
    } else {
      updatedCells[firstIndex + direction][secondIndex].isAllowMove =
        selectedCell.selected;
      updatedCells[firstIndex + 2 * direction][secondIndex].isAllowMove =
        selectedCell.selected;
    }
  }

  if (!updatedCells[firstIndex + direction][secondIndex].piece) {
    if (positionsCheckedPiece) {
      if (
        preventingCheckRookOrQueen(
          updatedCells,
          firstIndex + direction,
          secondIndex,
          positionsCheckedPiece
        ) ||
        preventingCheckBishopOrQueen(
          updatedCells,
          firstIndex + direction,
          secondIndex,
          positionsCheckedPiece
        )
      ) {
        updatedCells[firstIndex + direction][secondIndex].isAllowMove =
          selectedCell.selected;
      }
    } else
      updatedCells[firstIndex + direction][secondIndex].isAllowMove =
        selectedCell.selected;
  }

  if (
    secondIndex > 0 &&
    updatedCells[firstIndex + direction][secondIndex - 1].piece &&
    updatedCells[firstIndex + direction][secondIndex - 1].colorPiece ===
      enemyColor
  )
    if (positionsCheckedPiece) {
      let [row, col] = positionsCheckedPiece.positionPiceCheck;
      if (row === firstIndex + direction && col === secondIndex - 1) {
        updatedCells[firstIndex + direction][secondIndex - 1].isAllowMove =
          selectedCell.selected;
      }
    } else
      updatedCells[firstIndex + direction][secondIndex - 1].isAllowMove =
        selectedCell.selected;

  if (
    secondIndex < 7 &&
    updatedCells[firstIndex + direction][secondIndex + 1].piece &&
    updatedCells[firstIndex + direction][secondIndex + 1].colorPiece ===
      enemyColor
  ) {
    if (positionsCheckedPiece) {
      let [row, col] = positionsCheckedPiece.positionPiceCheck;

      if (row === firstIndex + direction && col === secondIndex + 1) {
        updatedCells[firstIndex + direction][secondIndex + 1].isAllowMove =
          selectedCell.selected;
      }
    } else
      updatedCells[firstIndex + direction][secondIndex + 1].isAllowMove =
        selectedCell.selected;
  }
};

export const handleRookMoves = (
  updatedCells: CellType[][],
  firstIndex: number,
  secondIndex: number,
  isAllow: boolean,
  startIndex: number,
  endIndex: number,
  isRow: boolean,
  step: number,
  enemyColor: "black" | "white",
  positionsCheckedPiece?: PositionsCheckedPiece | undefined
) => {
  const selectedCell = updatedCells[firstIndex][secondIndex];

  for (let i = startIndex; i !== endIndex; i += step) {
    const cell = isRow
      ? updatedCells[i][secondIndex]
      : updatedCells[firstIndex][i];

    if (cell.piece && cell.colorPiece !== enemyColor) break;

    if (positionsCheckedPiece && isAllow) {
      let [rowPiceCheck, colPiceCheck] =
        positionsCheckedPiece.positionPiceCheck;

      if (
        preventingCheckRookOrQueen(
          updatedCells,
          isRow ? i : firstIndex,
          isRow ? secondIndex : i,
          positionsCheckedPiece
        ) ||
        preventingCheckBishopOrQueen(
          updatedCells,
          isRow ? i : firstIndex,
          isRow ? secondIndex : i,
          positionsCheckedPiece
        ) ||
        (rowPiceCheck === (isRow ? i : firstIndex) &&
          colPiceCheck === (isRow ? secondIndex : i))
      ) {
        cell.isAllowMove = selectedCell.selected;
      }
    } else {
      cell.isAllowMove = selectedCell.selected;
    }

    if (cell.piece && cell.colorPiece === enemyColor) break;
  }
};

export const handleKnightMoves = (
  updatedCells: CellType[][],
  firstIndex: number,
  secondIndex: number,
  turn: "black" | "white",
  positionsCheckedPiece?: PositionsCheckedPiece | undefined
) => {
  const selectedCell = updatedCells[firstIndex][secondIndex];

  const knightMoves = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [2, -1],
    [2, 1],
    [1, -2],
    [1, 2],
  ];

  knightMoves.forEach(([rowOffset, colOffset]) => {
    const newRow = firstIndex + rowOffset;
    const newCol = secondIndex + colOffset;

    if (
      newRow >= firstCell &&
      newRow < lastCell &&
      newCol >= firstCell &&
      newCol < lastCell &&
      updatedCells[newRow][newCol].colorPiece !== turn
    ) {
      if (positionsCheckedPiece) {
        let [rowPiceCheck, colPiceCheck] =
          positionsCheckedPiece.positionPiceCheck;

        if (
          preventingCheckRookOrQueen(
            updatedCells,
            newRow,
            newCol,
            positionsCheckedPiece
          ) ||
          preventingCheckBishopOrQueen(
            updatedCells,
            newRow,
            newCol,
            positionsCheckedPiece
          ) ||
          (rowPiceCheck === newRow && colPiceCheck === newCol)
        ) {
          updatedCells[newRow][newCol].isAllowMove = selectedCell.selected;
        }
      } else {
        updatedCells[newRow][newCol].isAllowMove = selectedCell.selected;
      }
    }
  });
};

export const handleBishopMoves = (
  updatedCells: CellType[][],
  firstIndex: number,
  secondIndex: number,
  rowStep: number,
  colStep: number,
  turn: "black" | "white",
  enemyColor: "black" | "white",
  positionsCheckedPiece?: PositionsCheckedPiece | undefined
) => {
  let row = firstIndex;
  let col = secondIndex;

  const selectedCell = updatedCells[firstIndex][secondIndex];

  while (row >= 0 && row < 8 && col >= 0 && col < 8) {
    row += rowStep;
    col += colStep;

    if (row < 0 || row >= 8 || col < 0 || col >= 8) break;

    const cell = updatedCells[row][col];

    if (cell.piece) {
      if (cell.colorPiece === turn) break;

      if (positionsCheckedPiece) {
        let [rowPiceCheck, colPiceCheck] =
          positionsCheckedPiece.positionPiceCheck;

        if (
          preventingCheckRookOrQueen(
            updatedCells,
            row,
            col,
            positionsCheckedPiece
          ) ||
          preventingCheckBishopOrQueen(
            updatedCells,
            row,
            col,
            positionsCheckedPiece
          ) ||
          (rowPiceCheck === row && colPiceCheck === col)
        ) {
          cell.isAllowMove = selectedCell.selected;
        }
      } else {
        cell.isAllowMove = selectedCell.selected;
      }

      if (cell.colorPiece === enemyColor) break;
    } else {
      if (positionsCheckedPiece) {
        let [rowPiceCheck, colPiceCheck] =
          positionsCheckedPiece.positionPiceCheck;

        if (
          preventingCheckRookOrQueen(
            updatedCells,
            row,
            col,
            positionsCheckedPiece
          ) ||
          preventingCheckBishopOrQueen(
            updatedCells,
            row,
            col,
            positionsCheckedPiece
          ) ||
          (rowPiceCheck === row && colPiceCheck === col)
        ) {
          cell.isAllowMove = selectedCell.selected;
        }
      } else {
        cell.isAllowMove = selectedCell.selected;
      }
    }
  }
};

export const handleQueenMoves = (
  updatedCells: CellType[][],
  firstIndex: number,
  secondIndex: number,
  isAllow: boolean,
  turn: "black" | "white",
  enemyColor: "black" | "white",
  positionsCheckedPiece?: PositionsCheckedPiece | undefined
) => {
  handleRookMoves(
    updatedCells,
    firstIndex,
    secondIndex,
    isAllow,
    firstIndex - 1,
    -1,
    true,
    -1,
    enemyColor,
    positionsCheckedPiece
  ); // Up
  handleRookMoves(
    updatedCells,
    firstIndex,
    secondIndex,
    isAllow,
    firstIndex + 1,
    8,
    true,
    1,
    enemyColor,
    positionsCheckedPiece
  ); // Down
  handleRookMoves(
    updatedCells,
    firstIndex,
    secondIndex,
    isAllow,
    secondIndex + 1,
    8,
    false,
    1,
    enemyColor,
    positionsCheckedPiece
  ); // Right
  handleRookMoves(
    updatedCells,
    firstIndex,
    secondIndex,
    isAllow,
    secondIndex - 1,
    -1,
    false,
    -1,
    enemyColor,
    positionsCheckedPiece
  ); // Left

  handleBishopMoves(
    updatedCells,
    firstIndex,
    secondIndex,
    -1,
    -1,
    turn,
    enemyColor,
    positionsCheckedPiece
  ); // Top-left
  handleBishopMoves(
    updatedCells,
    firstIndex,
    secondIndex,
    1,
    1,
    turn,
    enemyColor,
    positionsCheckedPiece
  ); // Bottom-right
  handleBishopMoves(
    updatedCells,
    firstIndex,
    secondIndex,
    1,
    -1,
    turn,
    enemyColor,
    positionsCheckedPiece
  ); // Bottom-left
  handleBishopMoves(
    updatedCells,
    firstIndex,
    secondIndex,
    -1,
    1,
    turn,
    enemyColor,
    positionsCheckedPiece
  ); // Top-right
};

export const handleKingMoves = (
  updatedCells: CellType[][],
  firstIndex: number,
  secondIndex: number,
  isAllow: boolean,
  turn: "black" | "white",
  enemyColor: "black" | "white",
  positionsCheckedPiece?: PositionsCheckedPiece | undefined
) => {
  const selectedCell = updatedCells[firstIndex][secondIndex];

  const movesKing = [
    [-1, 0],
    [-1, -1],
    [-1, 1],
    [0, 1],
    [0, -1],
    [1, 0],
    [1, -1],
    [1, 1],
  ];

  movesKing.forEach(([rowOffset, colOffset]) => {
    const newRow = firstIndex + rowOffset;
    const newCol = secondIndex + colOffset;

    const handleIsActive = () => {
      if (isAllow) {
        if (!allowMoveKing(updatedCells, newRow, newCol, enemyColor, turn)) {
          updatedCells[newRow][newCol].isAllowMove = selectedCell.selected;
        }
      } else {
        updatedCells[newRow][newCol].isAllowMove = selectedCell.selected;
      }
    };

    if (
      newRow >= firstCell &&
      newRow < lastCell &&
      newCol >= firstCell &&
      newCol < lastCell
    ) {
      if (updatedCells[newRow][newCol]?.piece) {
        if (updatedCells[newRow][newCol]?.colorPiece !== turn) {
          handleIsActive();
        }
      } else {
        handleIsActive();
      }
    }
  });

  if (!selectedCell.isChange && !positionsCheckedPiece) {
    if (
      !updatedCells[firstIndex][secondIndex - 4].isChange &&
      updatedCells[firstIndex][secondIndex - 4].piece &&
      !updatedCells[firstIndex][secondIndex - 3].piece &&
      !updatedCells[firstIndex][secondIndex - 2].piece &&
      !updatedCells[firstIndex][secondIndex - 1].piece
    ) {
      if (isAllow) {
        if (
          !allowMoveKing(
            updatedCells,
            firstIndex,
            secondIndex - 2,
            enemyColor,
            turn
          )
        ) {
          updatedCells[firstIndex][secondIndex - 2].isAllowMove =
            selectedCell.selected;
        }
      } else {
        updatedCells[firstIndex][secondIndex - 2].isAllowMove =
          selectedCell.selected;
      }
    }

    if (
      !updatedCells[firstIndex][secondIndex + 3].isChange &&
      updatedCells[firstIndex][secondIndex + 3].piece &&
      !updatedCells[firstIndex][secondIndex + 2].piece &&
      !updatedCells[firstIndex][secondIndex + 1].piece
    ) {
      if (isAllow) {
        if (
          !allowMoveKing(
            updatedCells,
            firstIndex,
            secondIndex + 2,
            enemyColor,
            turn
          )
        ) {
          updatedCells[firstIndex][secondIndex + 2].isAllowMove =
            selectedCell.selected;
        }
      } else {
        updatedCells[firstIndex][secondIndex + 2].isAllowMove =
          selectedCell.selected;
      }
    }
  }
};


const checkDirection = (
    updatedCells: CellType[][],
    temp: number[][],
    firstIndex: number,
    secondIndex: number,
    statusRow: number,
    statusColumn: number,
    turn: "black" | "white",
  ): boolean => {
    let rowIndex = firstIndex;
    let columnIndex = secondIndex;
    let tempVirtual: number[][] = [];

    while (
      rowIndex + statusRow >= firstCell &&
      rowIndex + statusRow < lastCell &&
      columnIndex + statusColumn >= firstCell &&
      columnIndex + statusColumn < lastCell
    ) {
      rowIndex += statusRow;
      columnIndex += statusColumn;

      if (!statusRow || !statusColumn) {
        if (isRookOrQueen(updatedCells, firstIndex, secondIndex) && !updatedCells[rowIndex][columnIndex].piece) {
          tempVirtual.push([rowIndex, columnIndex]);
        }
      }

      else {
        if (isBishopOrQueen(updatedCells, firstIndex, secondIndex) && !updatedCells[rowIndex][columnIndex].piece) {
          tempVirtual.push([rowIndex, columnIndex]);
        }
      }


      const cell = updatedCells[rowIndex][columnIndex];
      if (cell?.colorPiece) {
        if (cell.piece === "King" && cell.colorPiece === turn) {
          temp = temp.concat(tempVirtual);
          return true;
        }
        break;
      }
    }

    tempVirtual = [];

    return false;
  };

  const resolveDirection = (
    updatedCells: CellType[][],
    temp: number[][],
    firstIndex: number,
    secondIndex: number,
    status: boolean,
    statusRow: number,
    statusColumn: number,
    isRookOrQueenProp: boolean = false,
    turn: "black" | "white",
    cells: CellType[][],
    setCells: (cells: CellType[][]) => void
  ): boolean => {
    let row = firstIndex;
    let column = secondIndex;

    temp.unshift([firstIndex, secondIndex]);

    while (
      row + statusRow >= firstCell &&
      row + statusRow < lastCell &&
      column + statusColumn >= firstCell &&
      column + statusColumn < lastCell
    ) {
      row += statusRow;
      column += statusColumn;

      const cell = updatedCells[row][column];

      if (cell.isAllowMove) {
        temp.push([row, column]);
      }

      if (cell?.colorPiece) {
        if ((isRookOrQueenProp ? isRookOrQueen(updatedCells, row, column) : isBishopOrQueen(updatedCells, row, column)) && cell.colorPiece !== turn) {
          updateSelectionAndMoves(temp, status, cells, setCells);//important
          return true;
        }
        return false;
      }
    }

    return false;
  };

  export const validAllowMove = (updatedCells: CellType[][], firstIndex: number, secondIndex: number,status: boolean, turn: "black" | "white",
    cells: CellType[][],
    setCells: (cells: CellType[][]) => void
  ): boolean => {
    let statusBishopOrQueen: StatusBishopOrQueenType = null;
    let statusRookOrQueen: StatusRookOrQueenType = null;

    let temp: number[][] = [];

    // Check all directions for King presence
    if (checkDirection(updatedCells, temp, firstIndex, secondIndex, -1, -1, turn)) statusBishopOrQueen = "topLeft";
    else if (checkDirection(updatedCells, temp, firstIndex, secondIndex, -1, 1, turn)) statusBishopOrQueen = "topRight";
    else if (checkDirection(updatedCells, temp, firstIndex, secondIndex, 1, -1, turn)) statusBishopOrQueen = "bottomLeft";
    else if (checkDirection(updatedCells, temp, firstIndex, secondIndex, 1, 1, turn)) statusBishopOrQueen = "bottomRight";

    else if (checkDirection(updatedCells, temp, firstIndex, secondIndex, 0, -1, turn)) statusRookOrQueen = "left";
    else if (checkDirection(updatedCells, temp, firstIndex, secondIndex, 0, 1, turn)) statusRookOrQueen = "right";
    else if (checkDirection(updatedCells, temp, firstIndex, secondIndex, -1, 0, turn)) statusRookOrQueen = "top";
    else if (checkDirection(updatedCells, temp, firstIndex, secondIndex, 1, 0, turn)) statusRookOrQueen = "bottom";

    switch (statusBishopOrQueen) {
      case "topLeft":
        return resolveDirection(updatedCells, temp, firstIndex, secondIndex, status, 1, 1, false, turn, cells, setCells);
      case "topRight":
        return resolveDirection(updatedCells, temp, firstIndex, secondIndex, status, 1, -1, false, turn, cells, setCells);
      case "bottomLeft":
        return resolveDirection(updatedCells, temp, firstIndex, secondIndex, status, -1, 1, false, turn, cells, setCells);
      case "bottomRight":
        return resolveDirection(updatedCells, temp, firstIndex, secondIndex, status, -1, -1, false, turn, cells, setCells);
    }

    switch (statusRookOrQueen) {
      case "left":
        return resolveDirection(updatedCells, temp, firstIndex, secondIndex, status, 0, 1, true, turn, cells, setCells);
      case "right":
        return resolveDirection(updatedCells, temp, firstIndex, secondIndex, status, 0, -1, true, turn, cells, setCells);
      case "top":
        return resolveDirection(updatedCells, temp, firstIndex, secondIndex, status, 1, 0, true, turn, cells, setCells);
      case "bottom":
        return resolveDirection(updatedCells, temp, firstIndex, secondIndex, status, -1, 0, true, turn, cells, setCells);
    }

    return false;
  };