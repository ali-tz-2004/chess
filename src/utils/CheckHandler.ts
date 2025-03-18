import { CellType, PositionsCheckedPiece } from "../type/ChessTypes";
import { isBishopOrQueen, isRookOrQueen } from "./Moves";

const firstCell = 0;
const lastCell = 8;

export const preventingCheckBishopOrQueen = (
  updatedCells: CellType[][],
  positionRowPawn: number,
  positionColumnPawn: number,
  positionsCheckedPiece?: PositionsCheckedPiece | undefined
) => {
  if (
    positionsCheckedPiece &&
    isBishopOrQueen(
      updatedCells,
      positionsCheckedPiece.positionPiceCheck[0],
      positionsCheckedPiece.positionPiceCheck[1]
    )
  ) {
    const { positionKing, positionPiceCheck } = positionsCheckedPiece;
    const validPositions: number[][] = [];
    const directionRow = Math.sign(positionKing[0] - positionPiceCheck[0]);
    const directionCol = Math.sign(positionKing[1] - positionPiceCheck[1]);

    if (Math.abs(directionRow) === Math.abs(directionCol)) {
      let [row, col] = positionPiceCheck;

      while (row !== positionKing[0] && col !== positionKing[1]) {
        row += directionRow;
        col += directionCol;
        validPositions.push([row, col]);
      }
    }

    return validPositions.some(
      ([row, col]) => row === positionRowPawn && col === positionColumnPawn
    );
  }

  return false;
};

export const preventingCheckRookOrQueen = (
  updatedCells: CellType[][],
  positionRowPawn: number,
  positionColumnPawn: number,
  positionsCheckedPiece?: PositionsCheckedPiece | undefined
) => {
  if (
    positionsCheckedPiece &&
    isRookOrQueen(
      updatedCells,
      positionsCheckedPiece.positionPiceCheck[0],
      positionsCheckedPiece.positionPiceCheck[1]
    )
  ) {
    const { positionKing, positionPiceCheck } = positionsCheckedPiece;
    const validPositions = [];
    const directionRow = Math.sign(positionKing[0] - positionPiceCheck[0]);
    const directionCol = Math.sign(positionKing[1] - positionPiceCheck[1]);

    if (directionRow === 0 || directionCol === 0) {
      let [row, col] = positionPiceCheck;

      while (row !== positionKing[0] || col !== positionKing[1]) {
        row += directionRow;
        col += directionCol;
        validPositions.push([row, col]);
      }
    }

    return validPositions.some(
      ([row, col]) => row === positionRowPawn && col === positionColumnPawn
    );
  }

  return false;
};


const checkWithBishopOrQueen = (updatedCells: CellType[][], row: number, col: number, enemyColor: "black" | "white") => {
  let j = col;
  for (let i = row; i >= firstCell && j >= firstCell; i--, j--) {
    if (updatedCells[i][j]?.colorPiece && row !== i) {
      if (updatedCells[i][j].piece === "King") continue;
      if (updatedCells[i][j].colorPiece === enemyColor && isBishopOrQueen(updatedCells, i, j)) {
        return true;
      }
      break;
    }
  }

  j = col;
  for (let i = row; i >= firstCell && j < lastCell; i--, j++) {
    if (updatedCells[i][j]?.colorPiece && row !== i) {
      if (updatedCells[i][j].piece === "King") continue;
      if (updatedCells[i][j].colorPiece === enemyColor && isBishopOrQueen(updatedCells, i, j)) {
        return true;
      }
      break;
    }
  }

  j = col;
  for (let i = row; i < lastCell && j < lastCell; i++, j++) {
    if (updatedCells[i][j]?.colorPiece && row !== i) {
      if (updatedCells[i][j].piece === "King") continue;
      if (updatedCells[i][j].colorPiece === enemyColor && isBishopOrQueen(updatedCells, i, j)) {
        return true;
      }
      break;
    }
  }

  j = col;
  for (let i = row; i < lastCell && j >= firstCell; i++, j--) {
    if (updatedCells[i][j]?.colorPiece && row !== i) {
      if (updatedCells[i][j].piece === "King") continue;
      if (updatedCells[i][j].colorPiece === enemyColor && isBishopOrQueen(updatedCells, i, j)) {
        return true;
      }
      break;
    }
  }

  return false;
}

const checkWithRookOrQueen = (updatedCells: CellType[][], row: number, col: number, enemyColor: "black" | "white") => {
  for (let i = row; i >= firstCell; i--) {
    if (updatedCells[i][col]?.colorPiece && i !== row) {
      if (updatedCells[i][col].piece === "King") continue;
      if (updatedCells[i][col].colorPiece === enemyColor && isRookOrQueen(updatedCells, i, col)) {
        return true;
      }
      break;
    }
  }

  for (let i = col; i < lastCell; i++) {
    if (updatedCells[row][i]?.colorPiece && i !== col) {
      if (updatedCells[row][i].piece === "King") continue;
      if (updatedCells[row][i].colorPiece === enemyColor && isRookOrQueen(updatedCells, row, i)) {
        return true;
      }
      break;
    }
  }

  for (let i = row; i < lastCell; i++) {
    if (updatedCells[i][col]?.colorPiece && i !== row) {
      if (updatedCells[i][col].piece === "King") continue;
      if (updatedCells[i][col].colorPiece === enemyColor && isRookOrQueen(updatedCells, i, col)) {
        return true;
      }
      break;
    }
  }

  for (let i = col; i >= firstCell; i--) {
    if (updatedCells[row][i]?.colorPiece && i !== col) {
      if (updatedCells[row][i].piece === "King") continue;
      if (updatedCells[row][i].colorPiece === enemyColor && isRookOrQueen(updatedCells, row, i)) {
        return true;
      }
      break;
    }
  }

  return false;
}

const checkWithKnight = (updatedCells: CellType[][], row: number, col: number, enemyColor: "black" | "white") => {
  const knightMoves = [
    [-2, 1],
    [-2, -1],
    [-1, -2],
    [-1, 2],
    [1, 2],
    [1, -2],
    [2, 1],
    [2, -1]
  ];

  for (let i = 0; i < knightMoves.length; i++) {
    const [moveRow, moveCol] = knightMoves[i];
    const rowTemp = row + moveRow;
    const colTemp = col + moveCol;

    if ((rowTemp >= lastCell || rowTemp < firstCell) || (colTemp >= lastCell || colTemp < firstCell)) continue;

    if (updatedCells[rowTemp][colTemp]?.colorPiece === enemyColor && updatedCells[rowTemp][colTemp]?.piece === "Knight") {
      return true;
    }
  }

  return false;
}

const checkWithPawn = (updatedCells: CellType[][], row: number, col: number, enemyColor: "black" | "white", turn: "black" | "white") => {
  if (turn === "white") {
    let rowTemp = row - 1;
    let colTemp = col + 1;

    if (rowTemp > firstCell && colTemp < lastCell) {
      if (updatedCells[rowTemp][colTemp].colorPiece === enemyColor && updatedCells[rowTemp][colTemp].piece === "Pawn") {
        return true;
      }
    }

    rowTemp = row - 1;
    colTemp = col - 1;

    if (rowTemp >= firstCell && colTemp >= firstCell) {
      if (updatedCells[rowTemp][colTemp].colorPiece === enemyColor && updatedCells[rowTemp][colTemp].piece === "Pawn") {
        return true;
      }
    }
  } else {
    let rowTemp = row + 1;
    let colTemp = col + 1;

    if (rowTemp < lastCell && colTemp < lastCell) {
      if (updatedCells[rowTemp][colTemp].colorPiece === enemyColor && updatedCells[rowTemp][colTemp].piece === "Pawn") {
        return true;
      }
    }

    rowTemp = row + 1;
    colTemp = col - 1;

    if (rowTemp < lastCell && colTemp >= firstCell) {
      if (updatedCells[rowTemp][colTemp].colorPiece === enemyColor && updatedCells[rowTemp][colTemp].piece === "Pawn") {
        return true;
      }
    }
  }

  return false;
}

const checkWithKing = (updatedCells: CellType[][], row: number, col: number, enemyColor: "black" | "white") => {
  const moves = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ]

  for (let i = 0; i < moves.length; i++) {
    const [moveRow, moveCol] = moves[i];
    const rowTemp = row + moveRow;
    const colTemp = col + moveCol;

    if ((rowTemp >= lastCell || rowTemp < firstCell) || (colTemp >= lastCell || colTemp < firstCell)) continue;

    if (updatedCells[rowTemp][colTemp]?.piece === "King" && updatedCells[rowTemp][colTemp]?.colorPiece === enemyColor) {
      return true;
    }
  }

  return false;
}


export const allowMoveKing = (updatedCells: CellType[][], row: number, col: number, enemyColor: "black" | "white", turn: "black" | "white") => {
  if (row < firstCell && col >= lastCell) return false;

  const isCheckedByOtherPieces = [
    checkWithBishopOrQueen,
    checkWithRookOrQueen,
    checkWithKnight,
    checkWithKing
  ].some(check => check(updatedCells, row, col, enemyColor));

  const isCheckedByPawn = checkWithPawn(updatedCells, row, col, enemyColor, turn);

  return isCheckedByOtherPieces || isCheckedByPawn;
}

