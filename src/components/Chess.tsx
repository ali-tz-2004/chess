import { useEffect, useRef, useState } from "react";
import { BorderChess } from "./BorderChess";
import { ChessPiece } from "./ChessPiece";
import { Images } from "../assets/images/images";
import {
  initialPiecePlacement,
  initialPieceColors,
  convertPawPiece,
} from "../data/Piece";
import { Popup } from "./Popup";


type cellColorType = "bg-cellPrimary" | "bg-cellSecondary";

export interface CellType {
  id: number;
  bgColor: cellColorType;
  piece: keyof (typeof Images)["black"] | null;
  colorPiece: keyof typeof Images | null;
  selected: boolean;
  isAllowMove: boolean;
  isUpdatePice: boolean;
  isChange: boolean;
  isCheck: boolean;
}

export interface PositionsCheckedPiece {
  positionKing: number[];
  positionPiceCheck: number[];
}

export const Chess = () => {
  const [cells, setCells] = useState<CellType[][]>([]);
  const [turn, setTurn] = useState<keyof typeof Images>("white");
  const [selected, setSelected] = useState<number[]>([]);
  const [positionsCheckedPiece, setPositionsCheckedPiece] = useState<PositionsCheckedPiece | undefined>();

  const countRow = 8;
  const countColumn = 8;

  const clearAllowMoveAndSelected = (
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

  const clearAllowMoveAndSelectedList = (
    index: number[][],
    status: boolean
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

  const checkUpdatePice = (): boolean => {
    return cells.some((row) => row.some((cell) => cell.isUpdatePice));
  };


  const updatePieceAllowMove = (firstIndex: number, secondIndex: number, isAllow: boolean = true) => {
    let updatedCells = [...cells];

    const selectedCell = updatedCells[firstIndex][secondIndex];
    const firstCell = 0;
    const lastCell = 8;

    const isRookOrQueen = (row: number, col: number) => {
      const piece = updatedCells[row][col].piece;
      return piece === "Rook" || piece === "Queen";
    };

    const isBishopOrQueen = (row: number, col: number) => {
      const piece = updatedCells[row][col].piece;
      return piece === "Bishop" || piece === "Queen";
    };

    const validAllowMove = (status: boolean): boolean => {
      let statusBishopOrQueen: "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | null = null;
      let statusRookOrQueen: "top" | "right" | "bottom" | "left" | null = null;

      let temp: number[][] = [];
      let tempVirtual: number[][] = [];

      const checkDirection = (
        statusRow: number,
        statusColumn: number
      ): boolean => {
        let rowIndex = firstIndex;
        let columnIndex = secondIndex;

        while (
          rowIndex + statusRow >= firstCell &&
          rowIndex + statusRow < lastCell &&
          columnIndex + statusColumn >= firstCell &&
          columnIndex + statusColumn < lastCell
        ) {
          rowIndex += statusRow;
          columnIndex += statusColumn;

          if (!statusRow || !statusColumn) {
            if (isRookOrQueen(firstIndex, secondIndex) && !updatedCells[rowIndex][columnIndex].piece) {
              tempVirtual.push([rowIndex, columnIndex]);
            }
          }

          else {
            if (isBishopOrQueen(firstIndex, secondIndex) && !updatedCells[rowIndex][columnIndex].piece) {
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
        statusRow: number,
        statusColumn: number,
        isRookOrQueenProp: boolean = false
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
            if ((isRookOrQueenProp ? isRookOrQueen(row, column) : isBishopOrQueen(row, column)) && cell.colorPiece !== turn) {
              clearAllowMoveAndSelectedList(temp, status);
              return true;
            }
            return false;
          }
        }

        return false;
      };

      // Check all directions for King presence
      if (checkDirection(-1, -1)) statusBishopOrQueen = "topLeft";
      else if (checkDirection(-1, 1)) statusBishopOrQueen = "topRight";
      else if (checkDirection(1, -1)) statusBishopOrQueen = "bottomLeft";
      else if (checkDirection(1, 1)) statusBishopOrQueen = "bottomRight";

      else if (checkDirection(0, -1)) statusRookOrQueen = "left";
      else if (checkDirection(0, 1)) statusRookOrQueen = "right";
      else if (checkDirection(-1, 0)) statusRookOrQueen = "top";
      else if (checkDirection(1, 0)) statusRookOrQueen = "bottom";

      switch (statusBishopOrQueen) {
        case "topLeft":
          return resolveDirection(1, 1);
        case "topRight":
          return resolveDirection(1, -1);
        case "bottomLeft":
          return resolveDirection(-1, 1);
        case "bottomRight":
          return resolveDirection(-1, -1);
      }

      switch (statusRookOrQueen) {
        case "left":
          return resolveDirection(0, 1, true);
        case "right":
          return resolveDirection(0, -1, true);
        case "top":
          return resolveDirection(1, 0, true);
        case "bottom":
          return resolveDirection(-1, 0, true);
      }

      return false;
    };


    if (checkUpdatePice()) return;

    clearAllowMoveAndSelected(firstIndex, secondIndex);


    if (selectedCell.colorPiece !== turn) return;

    selectedCell.selected = !selectedCell.selected;
    const enemyColor = turn === "black" ? "white" : "black";


    const preventingCheckRookOrQueen = (positionRowPawn: number, positionColumnPawn: number) => {
      if (positionsCheckedPiece && isRookOrQueen(positionsCheckedPiece.positionPiceCheck[0], positionsCheckedPiece.positionPiceCheck[1])) {
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

        return validPositions.some(([row, col]) => row === positionRowPawn && col === positionColumnPawn);
      }

      return false;
    };

    const preventingCheckBishopOrQueen = (positionRowPawn: number, positionColumnPawn: number) => {
      if (positionsCheckedPiece && isBishopOrQueen(positionsCheckedPiece.positionPiceCheck[0], positionsCheckedPiece.positionPiceCheck[1])) {
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

        return validPositions.some(([row, col]) => row === positionRowPawn && col === positionColumnPawn);
      }

      return false;
    }

    const handlePawnMoves = (direction: number, startRow: number) => {
      if (
        firstIndex === startRow &&
        !updatedCells[firstIndex + direction][secondIndex].piece &&
        !updatedCells[firstIndex + 2 * direction][secondIndex].piece
      ) {
        if (positionsCheckedPiece) {
          if (preventingCheckRookOrQueen(firstIndex + direction, secondIndex) || preventingCheckBishopOrQueen(firstIndex + direction, secondIndex)) {
            updatedCells[firstIndex + direction][secondIndex].isAllowMove = selectedCell.selected;
          }
          if (preventingCheckRookOrQueen(firstIndex + 2 * direction, secondIndex) || preventingCheckBishopOrQueen(firstIndex + 2 * direction, secondIndex)) {
            updatedCells[firstIndex + 2 * direction][secondIndex].isAllowMove = selectedCell.selected;
          }
        } else {
          updatedCells[firstIndex + direction][secondIndex].isAllowMove = selectedCell.selected;
          updatedCells[firstIndex + 2 * direction][secondIndex].isAllowMove = selectedCell.selected;
        }
      }

      if (!updatedCells[firstIndex + direction][secondIndex].piece) {
        if (positionsCheckedPiece) {
          if (preventingCheckRookOrQueen(firstIndex + direction, secondIndex) || preventingCheckBishopOrQueen(firstIndex + direction, secondIndex)) {
            updatedCells[firstIndex + direction][secondIndex].isAllowMove =
              selectedCell.selected;
          }
        } else updatedCells[firstIndex + direction][secondIndex].isAllowMove = selectedCell.selected;
      }

      if (
        secondIndex > 0 &&
        updatedCells[firstIndex + direction][secondIndex - 1].piece &&
        updatedCells[firstIndex + direction][secondIndex - 1].colorPiece === enemyColor
      )
        if (positionsCheckedPiece) {
          let [row, col] = positionsCheckedPiece.positionPiceCheck;
          if (row === firstIndex + direction && col === secondIndex - 1) {
            updatedCells[firstIndex + direction][secondIndex - 1].isAllowMove = selectedCell.selected;
          }
        } else updatedCells[firstIndex + direction][secondIndex - 1].isAllowMove = selectedCell.selected;

      if (
        secondIndex < 7 &&
        updatedCells[firstIndex + direction][secondIndex + 1].piece &&
        updatedCells[firstIndex + direction][secondIndex + 1].colorPiece === enemyColor
      ) {
        if (positionsCheckedPiece) {
          let [row, col] = positionsCheckedPiece.positionPiceCheck;

          if (row === firstIndex + direction && col === secondIndex + 1) {
            updatedCells[firstIndex + direction][secondIndex + 1].isAllowMove = selectedCell.selected;
          }
        } else updatedCells[firstIndex + direction][secondIndex + 1].isAllowMove = selectedCell.selected;
      }
    };

    const handleRookMoves = (
      startIndex: number,
      endIndex: number,
      isRow: boolean,
      step: number
    ) => {
      for (let i = startIndex; i !== endIndex; i += step) {
        const cell = isRow
          ? updatedCells[i][secondIndex]
          : updatedCells[firstIndex][i];

        if (cell.piece && cell.colorPiece !== enemyColor) break;

        if (positionsCheckedPiece && isAllow) {
          let [rowPiceCheck, colPiceCheck] = positionsCheckedPiece.positionPiceCheck;

          if (preventingCheckRookOrQueen(isRow ? i : firstIndex, isRow ? secondIndex : i) || preventingCheckBishopOrQueen(isRow ? i : firstIndex, isRow ? secondIndex : i) ||
            (rowPiceCheck === (isRow ? i : firstIndex) && colPiceCheck === (isRow ? secondIndex : i))) {
            cell.isAllowMove = selectedCell.selected;
          }
        } else {
          cell.isAllowMove = selectedCell.selected;
        }

        if (cell.piece && cell.colorPiece === enemyColor) break;
      }
    };

    const handleKnightMoves = () => {
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
            let [rowPiceCheck, colPiceCheck] = positionsCheckedPiece.positionPiceCheck;

            if (preventingCheckRookOrQueen(newRow, newCol) || preventingCheckBishopOrQueen(newRow, newCol) || (rowPiceCheck === newRow && colPiceCheck === newCol)) {
              updatedCells[newRow][newCol].isAllowMove = selectedCell.selected;
            }
          } else {
            updatedCells[newRow][newCol].isAllowMove = selectedCell.selected;

          }
        }
      });
    };

    const handleBishopMoves = (rowStep: number, colStep: number) => {
      debugger;
      let row = firstIndex;
      let col = secondIndex;

      while (row >= 0 && row < 8 && col >= 0 && col < 8) {
        row += rowStep;
        col += colStep;

        if (row < 0 || row >= 8 || col < 0 || col >= 8) break;

        const cell = updatedCells[row][col];

        if (cell.piece) {
          if (cell.colorPiece === turn) break;

          if (positionsCheckedPiece) {
            let [rowPiceCheck, colPiceCheck] = positionsCheckedPiece.positionPiceCheck;

            if (preventingCheckRookOrQueen(row, col) || preventingCheckBishopOrQueen(row, col) || (rowPiceCheck === row && colPiceCheck === col)) {
              cell.isAllowMove = selectedCell.selected;
            }
          } else {
            cell.isAllowMove = selectedCell.selected;
          }

          if (cell.colorPiece === enemyColor) break;
        } else {
          if (positionsCheckedPiece) {
            let [rowPiceCheck, colPiceCheck] = positionsCheckedPiece.positionPiceCheck;

            if (preventingCheckRookOrQueen(row, col) || preventingCheckBishopOrQueen(row, col) || (rowPiceCheck === row && colPiceCheck === col)) {
              cell.isAllowMove = selectedCell.selected;
            }
          } else {
            cell.isAllowMove = selectedCell.selected;
          }
        }
      }
    };

    const allowMoveKing = (row: number, col: number) => {
      if (row < firstCell && col >= lastCell) return false;
      const checkWithBishopOrQueen = () => {
        let j = col;
        for (let i = row; i >= firstCell && j >= firstCell; i--, j--) {
          if (updatedCells[i][j]?.colorPiece && row !== i) {
            if (updatedCells[i][j].piece === "King") continue;
            if (updatedCells[i][j].colorPiece === enemyColor && isBishopOrQueen(i, j)) {
              return true;
            }
            break;
          }
        }

        j = col;
        for (let i = row; i >= firstCell && j < lastCell; i--, j++) {
          if (updatedCells[i][j]?.colorPiece && row !== i) {
            if (updatedCells[i][j].piece === "King") continue;
            if (updatedCells[i][j].colorPiece === enemyColor && isBishopOrQueen(i, j)) {
              return true;
            }
            break;
          }
        }

        j = col;
        for (let i = row; i < lastCell && j < lastCell; i++, j++) {
          if (updatedCells[i][j]?.colorPiece && row !== i) {
            if (updatedCells[i][j].piece === "King") continue;
            if (updatedCells[i][j].colorPiece === enemyColor && isBishopOrQueen(i, j)) {
              return true;
            }
            break;
          }
        }

        j = col;
        for (let i = row; i < lastCell && j >= firstCell; i++, j--) {
          if (updatedCells[i][j]?.colorPiece && row !== i) {
            if (updatedCells[i][j].piece === "King") continue;
            if (updatedCells[i][j].colorPiece === enemyColor && isBishopOrQueen(i, j)) {
              return true;
            }
            break;
          }
        }

        return false;
      }

      const checkWithRookOrQueen = () => {
        for (let i = row; i >= firstCell; i--) {
          if (updatedCells[i][col]?.colorPiece && i !== row) {
            if (updatedCells[i][col].piece === "King") continue;
            if (updatedCells[i][col].colorPiece === enemyColor && isRookOrQueen(i, col)) {
              return true;
            }
            break;
          }
        }

        for (let i = col; i < lastCell; i++) {
          if (updatedCells[row][i]?.colorPiece && i !== col) {
            if (updatedCells[row][i].piece === "King") continue;
            if (updatedCells[row][i].colorPiece === enemyColor && isRookOrQueen(row, i)) {
              return true;
            }
            break;
          }
        }

        for (let i = row; i < lastCell; i++) {
          if (updatedCells[i][col]?.colorPiece && i !== row) {
            if (updatedCells[i][col].piece === "King") continue;
            if (updatedCells[i][col].colorPiece === enemyColor && isRookOrQueen(i, col)) {
              return true;
            }
            break;
          }
        }

        for (let i = col; i >= firstCell; i--) {
          if (updatedCells[row][i]?.colorPiece && i !== col) {
            if (updatedCells[row][i].piece === "King") continue;
            if (updatedCells[row][i].colorPiece === enemyColor && isRookOrQueen(row, i)) {
              return true;
            }
            break;
          }
        }

        return false;
      }

      const checkWithKnight = () => {

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

      const checkWithPawn = () => {
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

      const checkWithKing = () => {
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



      if (checkWithBishopOrQueen()) return true;
      if (checkWithRookOrQueen()) return true;
      if (checkWithKnight()) return true;
      if (checkWithPawn()) return true;
      if (checkWithKing()) return true;

      return false;
    }

    const handleKingMoves = () => {
      const moves = [
        [-1, 0],
        [-1, -1],
        [-1, 1],
        [0, 1],
        [0, -1],
        [1, 0],
        [1, -1],
        [1, 1],
      ];

      moves.forEach(([rowOffset, colOffset]) => {
        const newRow = firstIndex + rowOffset;
        const newCol = secondIndex + colOffset;

        const handleIsActive = () => {
          if (isAllow) {
            if (!allowMoveKing(newRow, newCol)) {
              updatedCells[newRow][newCol].isAllowMove = selectedCell.selected;
            }
          } else {
            updatedCells[newRow][newCol].isAllowMove = selectedCell.selected;
          }
        }

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

      if (!selectedCell.isChange) {
        if (
          !updatedCells[firstIndex][secondIndex - 4].isChange &&
          !updatedCells[firstIndex][secondIndex - 3].piece &&
          !updatedCells[firstIndex][secondIndex - 2].piece &&
          !updatedCells[firstIndex][secondIndex - 1].piece
        ) {
          if (isAllow) {
            if (!allowMoveKing(firstIndex, secondIndex - 2)) {
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
          !updatedCells[firstIndex][secondIndex + 2].piece &&
          !updatedCells[firstIndex][secondIndex + 1].piece) {
          if (isAllow) {
            if (!allowMoveKing(firstIndex, secondIndex + 2)) {
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

    const handleQueenMoves = () => {
      handleRookMoves(firstIndex - 1, -1, true, -1); // Up
      handleRookMoves(firstIndex + 1, 8, true, 1); // Down
      handleRookMoves(secondIndex + 1, 8, false, 1); // Right
      handleRookMoves(secondIndex - 1, -1, false, -1); // Left

      handleBishopMoves(-1, -1); // Top-left
      handleBishopMoves(1, 1); // Bottom-right
      handleBishopMoves(1, -1); // Bottom-left
      handleBishopMoves(-1, 1); // Top-right
    };

    if (selectedCell.piece === "Pawn") {
      const direction = turn === "black" ? 1 : -1;
      const startRow = turn === "black" ? 1 : 6;
      handlePawnMoves(direction, startRow);
    } else if (selectedCell.piece === "Rook") {
      handleRookMoves(firstIndex - 1, -1, true, -1); // Up
      handleRookMoves(firstIndex + 1, 8, true, 1); // Down
      handleRookMoves(secondIndex + 1, 8, false, 1); // Right
      handleRookMoves(secondIndex - 1, -1, false, -1); // Left
    } else if (selectedCell.piece === "Knight") {
      handleKnightMoves();
    } else if (selectedCell.piece === "Bishop") {
      handleBishopMoves(-1, -1); // Top-left
      handleBishopMoves(1, 1); // Bottom-right
      handleBishopMoves(1, -1); // Bottom-left
      handleBishopMoves(-1, 1); // Top-right
    } else if (selectedCell.piece === "Queen") {
      handleQueenMoves();
    } else if (selectedCell.piece === "King") {
      handleKingMoves();
    } else {
      return;
    }

    if (isAllow) if (validAllowMove(selectedCell.selected)) {
      return;
    }

    setCells(updatedCells);
  };

  const initialBase = () => {
    let tempList: CellType[][] = [];
    let id = 1;

    for (let i = 0; i < countRow; i++) {
      tempList[i] = [];
      for (let j = 0; j < countColumn; j++) {
        let color: cellColorType =
          (j % 2) - (i % 2 === 0 ? 1 : 0) === 0
            ? "bg-cellPrimary"
            : "bg-cellSecondary";

        const piece = initialPiecePlacement[i][j];
        const colorPiece = initialPieceColors[i];

        let temp: CellType = {
          id: id,
          bgColor: color,
          piece: piece,
          colorPiece: colorPiece,
          selected: false,
          isAllowMove: false,
          isUpdatePice: false,
          isChange: false,
          isCheck: false,
        };

        tempList[i].push(temp);
        id++;
      }
    }

    setCells(tempList);
  };

  const movedHandler = (
    isAllowMove: boolean,
    firstIndex: number,
    secondIndex: number
  ): void => {
    if (isAllowMove) {
      const cellsCopy = [...cells];
      cellsCopy[firstIndex][secondIndex].piece =
        cellsCopy[selected[0]][selected[1]].piece;
      cellsCopy[selected[0]][selected[1]].piece = null;
      cellsCopy[selected[0]][selected[1]].colorPiece = null;
      cellsCopy[firstIndex][secondIndex].colorPiece = turn;
      cellsCopy[firstIndex][secondIndex].isChange = true;

      if (
        turn === "white" &&
        cellsCopy[firstIndex][secondIndex].piece === "King"
      ) {
        if (selected[1] - 2 === secondIndex) {
          cellsCopy[7][0].piece = null;
          cellsCopy[7][3].piece = "Rook";
          cellsCopy[7][3].colorPiece = turn;
        } else if (selected[1] + 2 === secondIndex) {
          cellsCopy[7][7].piece = null;
          cellsCopy[7][5].piece = "Rook";
          cellsCopy[7][5].colorPiece = turn;
        }
      }

      if (
        turn === "black" &&
        cellsCopy[firstIndex][secondIndex].piece === "King"
      ) {
        if (selected[1] - 2 === secondIndex) {
          cellsCopy[0][0].piece = null;
          cellsCopy[0][3].piece = "Rook";
          cellsCopy[0][3].colorPiece = turn;
        } else if (selected[1] + 2 === secondIndex) {
          cellsCopy[0][7].piece = null;
          cellsCopy[0][5].piece = "Rook";
          cellsCopy[0][5].colorPiece = turn;
        }
      }

      clearAllowMoveAndSelected();

      if (
        firstIndex === 0 &&
        turn === "white" &&
        cellsCopy[firstIndex][secondIndex].piece === "Pawn"
      ) {
        cellsCopy[firstIndex][secondIndex].isUpdatePice = true;
      }

      if (
        firstIndex === 7 &&
        turn === "black" &&
        cellsCopy[firstIndex][secondIndex].piece === "Pawn"
      ) {
        cellsCopy[firstIndex][secondIndex].isUpdatePice = true;
      }

      if (isCheck(turn === "white" ? "black" : "white")) {
        console.log("Check!");
      } else {
        clearAllowMoveAndSelected(undefined, undefined, true);
        setPositionsCheckedPiece(undefined);
      }

      setCells(cellsCopy);
      setTurn(turn === "white" ? "black" : "white");
    } else if (cells[firstIndex][secondIndex].piece) {
      setSelected([firstIndex, secondIndex]);
    }
  };

  const updatePow = (
    firstIndex: number,
    secondIndex: number,
    piece: keyof (typeof Images)["black"]
  ): void => {
    const cellsCopy = [...cells];
    cells[firstIndex][secondIndex].piece = piece;
    cells[firstIndex][secondIndex].isUpdatePice = false;

    setCells(cellsCopy);
  };

  const isCheck = (
    kingColor: "white" | "black"
  ): boolean => {
    const updatedCells = [...cells];
    let kingPosition: [number, number] | null = null;

    for (let i = 0; i < countRow; i++) {
      for (let j = 0; j < countColumn; j++) {
        if (
          updatedCells[i][j].piece === "King" &&
          updatedCells[i][j].colorPiece === kingColor
        ) {
          kingPosition = [i, j];
          break;
        }
      }
      if (kingPosition) break;
    }

    if (!kingPosition) return false;

    const [kingRow, kingCol] = kingPosition;
    const enemyColor = kingColor === "white" ? "black" : "white";
    let isKingInCheck = false;
    let positionsCheckedPiece: PositionsCheckedPiece | undefined = undefined;

    for (let i = 0; i < countRow; i++) {
      for (let j = 0; j < countColumn; j++) {
        const cell = updatedCells[i][j];
        if (cell?.colorPiece === enemyColor) {
          clearAllowMoveAndSelected();
          updatePieceAllowMove(i, j, false);

          if (updatedCells[kingRow][kingCol].isAllowMove) {
            positionsCheckedPiece = {
              positionKing: [kingRow, kingCol],
              positionPiceCheck: [i, j],
            };
            updatedCells[kingRow][kingCol].isCheck = true;
            clearAllowMoveAndSelected(kingRow, kingCol, true);
            isKingInCheck = true;
          }
        }
      }
    }

    setPositionsCheckedPiece(positionsCheckedPiece);

    clearAllowMoveAndSelected();

    return isKingInCheck;
  };

  useEffect(() => {
    initialBase();
  }, []);

  const [isEnd, setIsEnd] = useState(false);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (positionsCheckedPiece && !hasRunRef.current) {
      hasRunRef.current = true;
      let isAllowMove = false;
      updatePieceAllowMove(positionsCheckedPiece.positionKing[0], positionsCheckedPiece.positionKing[1], true);

      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (cells[i][j].isAllowMove) {
            isAllowMove = true;
            break;
          }
        }
      }

      clearAllowMoveAndSelected();
      setIsEnd(!isAllowMove);
    }
    if (!positionsCheckedPiece) {
      hasRunRef.current = false;
    }
  }, [cells, positionsCheckedPiece])

  const resetGame = () => {
    clearAllowMoveAndSelected();
    setTurn("white");
    setSelected([]);
    setPositionsCheckedPiece(undefined);
    hasRunRef.current = false;
    initialBase();
    setIsEnd(false);
  }

  return (
    <>
      <div
        className={`h-custom-30 w-custom-30 bg-secondary grid grid-cols-8 grid-rows-8 p-8 2xl:scale-150 lg:scale-100 md:scale-50 scale-75 relative `}
      >
        {cells.map((cellChildren, firstIndex) =>
          cellChildren.map((x, secondIndex) => (
            <div
              key={x.id}
              className={`${x.bgColor
                } w-full h-full flex items-center justify-center relative ${x.isAllowMove ? "cursor-pointer" : ""
                } `}
              onClick={() => movedHandler(x.isAllowMove, firstIndex, secondIndex)}
            >
              {x.isAllowMove ? (
                <div className={`absolute w-2 h-2 bg-blue-400 rounded-xl`}></div>
              ) : null}
              {x.piece && x.colorPiece && (
                <div
                  className={`
                  ${x.colorPiece === turn ? "cursor-pointer" : ""} 
                  ${x.selected && !x.isCheck ? "bg-blue-500" : ""} 
                  ${x.isCheck && x.selected ? "bg-purple-500" : ""} 
                  ${x.isCheck && !x.selected ? "bg-red-400" : ""}
                  `
                  }
                  onClick={() => updatePieceAllowMove(firstIndex, secondIndex)}
                >
                  <ChessPiece piece={x.piece} color={x.colorPiece} />
                </div>
              )}
              {x.isUpdatePice ? (
                <div className="w-52 h-full absolute bg-secondary top-16 right-0 z-10 flex">
                  {convertPawPiece.map((y) => (
                    <div
                      onClick={() => updatePow(firstIndex, secondIndex, y)}
                      className="pointer"
                    >
                      <ChessPiece
                        piece={y}
                        color={turn === "black" ? "white" : "black"}
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))
        )}
        <BorderChess />
      </div>
      {isEnd && (
        <div className="flex flex-col items-center justify-center h-screen">
          <Popup title="end game" description={`${turn === "white" ? "black": "white"} is win`} messageClose="reset" isOpen={isEnd} onClose={resetGame} />
        </div>
      )}
    </>
  );
};
