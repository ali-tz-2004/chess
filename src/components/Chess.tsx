import { useEffect, useState } from "react";
import { BorderChess } from "./BorderChess";
import { ChessPiece } from "./ChessPiece";
import { Images } from "../assets/images/images";
import {
  initialPiecePlacement,
  initialPieceColors,
  convertPawPiece,
} from "../data/Piece";

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

  const checkUpdatePice = (): boolean => {
    return cells.some((row) => row.some((cell) => cell.isUpdatePice));
  };

  const updatePieceAllowMove = (firstIndex: number, secondIndex: number) => {
    let updatedCells = [...cells];

    if (checkUpdatePice()) return;

    clearAllowMoveAndSelected(firstIndex, secondIndex);

    const selectedCell = updatedCells[firstIndex][secondIndex];

    if (selectedCell.colorPiece !== turn) return;

    selectedCell.selected = !selectedCell.selected;
    const enemyColor = turn === "black" ? "white" : "black";

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

    const preventingCheckRookOrQueenWithPawn = (positionRowPawn: number) => {
      if (positionsCheckedPiece) {
        return positionsCheckedPiece.positionKing[0] === positionsCheckedPiece.positionPiceCheck[0] &&
          isRookOrQueen(positionsCheckedPiece.positionPiceCheck[0], positionsCheckedPiece.positionPiceCheck[1]) &&
          positionsCheckedPiece.positionKing[0] === positionRowPawn &&
          ((positionsCheckedPiece.positionKing[1] > positionsCheckedPiece.positionPiceCheck[1] && secondIndex < positionsCheckedPiece.positionKing[1]) ||
            (positionsCheckedPiece.positionKing[1] < positionsCheckedPiece.positionPiceCheck[1] && secondIndex < positionsCheckedPiece.positionPiceCheck[1]))
      }
    }

    const preventingCheckBishopOrQueenWithPawn = (positionRowPawn: number, positionColumnPawn: number) => {
      let validPositions: number[][] = [];

      if (positionsCheckedPiece && isBishopOrQueen(positionsCheckedPiece.positionPiceCheck[0], positionsCheckedPiece.positionPiceCheck[1])) {
        if (positionsCheckedPiece.positionKing[0] < positionsCheckedPiece.positionPiceCheck[0] && positionsCheckedPiece.positionKing[1] > positionsCheckedPiece.positionPiceCheck[1]) {
          let positionRowCheck = positionsCheckedPiece.positionPiceCheck[0];
          let positionColumnCheck = positionsCheckedPiece.positionPiceCheck[1];

          while (positionRowCheck > positionsCheckedPiece.positionKing[0] && positionColumnCheck < positionsCheckedPiece.positionKing[1]) {
            positionRowCheck--;
            positionColumnCheck++;
            validPositions.push([positionRowCheck, positionColumnCheck]);
          }
        } else if (positionsCheckedPiece.positionKing[0] < positionsCheckedPiece.positionPiceCheck[0] && positionsCheckedPiece.positionKing[1] < positionsCheckedPiece.positionPiceCheck[1]) {
          let positionRowCheck = positionsCheckedPiece.positionPiceCheck[0];
          let positionColumnCheck = positionsCheckedPiece.positionPiceCheck[1];

          while (positionRowCheck > positionsCheckedPiece.positionKing[0] && positionColumnCheck > positionsCheckedPiece.positionKing[1]) {
            positionRowCheck--;
            positionColumnCheck--;
            validPositions.push([positionRowCheck, positionColumnCheck]);
          }
        } else if (positionsCheckedPiece.positionKing[0] > positionsCheckedPiece.positionPiceCheck[0] && positionsCheckedPiece.positionKing[1] < positionsCheckedPiece.positionPiceCheck[1]) {
          let positionRowCheck = positionsCheckedPiece.positionPiceCheck[0];
          let positionColumnCheck = positionsCheckedPiece.positionPiceCheck[1];

          while (positionRowCheck < positionsCheckedPiece.positionKing[0] && positionColumnCheck > positionsCheckedPiece.positionKing[1]) {
            positionRowCheck++;
            positionColumnCheck--;
            validPositions.push([positionRowCheck, positionColumnCheck]);
          }
        } else if (positionsCheckedPiece.positionKing[0] > positionsCheckedPiece.positionPiceCheck[0] && positionsCheckedPiece.positionKing[1] > positionsCheckedPiece.positionPiceCheck[1]) {
          let positionRowCheck = positionsCheckedPiece.positionPiceCheck[0];
          let positionColumnCheck = positionsCheckedPiece.positionPiceCheck[1];

          while (positionRowCheck < positionsCheckedPiece.positionKing[0] && positionColumnCheck < positionsCheckedPiece.positionKing[1]) {
            positionRowCheck++;
            positionColumnCheck++;
            validPositions.push([positionRowCheck, positionColumnCheck]);
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
          if (preventingCheckRookOrQueenWithPawn(firstIndex + direction) || preventingCheckBishopOrQueenWithPawn(firstIndex + direction, secondIndex)) {
            updatedCells[firstIndex + direction][secondIndex].isAllowMove = selectedCell.selected;
          }
          if (preventingCheckRookOrQueenWithPawn(firstIndex + 2 * direction) || preventingCheckBishopOrQueenWithPawn(firstIndex + 2 * direction, secondIndex)) {
            updatedCells[firstIndex + 2 * direction][secondIndex].isAllowMove = selectedCell.selected;
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
          if (preventingCheckRookOrQueenWithPawn(firstIndex + direction) || preventingCheckBishopOrQueenWithPawn(firstIndex + direction, secondIndex)) {
            updatedCells[firstIndex + direction][secondIndex].isAllowMove =
              selectedCell.selected;
          }
        } else {
          updatedCells[firstIndex + direction][secondIndex].isAllowMove =
            selectedCell.selected;
        }
      }

      if (
        secondIndex > 0 &&
        updatedCells[firstIndex + direction][secondIndex - 1].piece &&
        updatedCells[firstIndex + direction][secondIndex - 1].colorPiece === enemyColor
      ) {
        if (!positionsCheckedPiece) updatedCells[firstIndex + direction][secondIndex - 1].isAllowMove = selectedCell.selected;
      }

      if (
        secondIndex < 7 &&
        updatedCells[firstIndex + direction][secondIndex + 1].piece &&
        updatedCells[firstIndex + direction][secondIndex + 1].colorPiece === enemyColor
      ) {
        if (!positionsCheckedPiece) updatedCells[firstIndex + direction][secondIndex + 1].isAllowMove = selectedCell.selected;
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

        cell.isAllowMove = selectedCell.selected;

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
          updatedCells[newRow][newCol].isAllowMove = selectedCell.selected;
        }
      });
    };

    const handleBishopMoves = (rowStep: number, colStep: number) => {
      let row = firstIndex;
      let col = secondIndex;

      while (row >= 0 && row < 8 && col >= 0 && col < 8) {
        row += rowStep;
        col += colStep;

        if (row < 0 || row >= 8 || col < 0 || col >= 8) break;

        const cell = updatedCells[row][col];

        if (cell.piece) {
          if (cell.colorPiece === turn) break;

          cell.isAllowMove = selectedCell.selected;

          if (cell.colorPiece === enemyColor) break;
        } else {
          cell.isAllowMove = selectedCell.selected;
        }
      }
    };

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

        if (
          newRow >= firstCell &&
          newRow < lastCell &&
          newCol >= firstCell &&
          newCol < lastCell &&
          updatedCells[newRow][newCol].colorPiece !== turn
        ) {
          updatedCells[newRow][newCol].isAllowMove = selectedCell.selected;
        }
      });

      if (!selectedCell.isChange) {
        if (
          !updatedCells[firstIndex][secondIndex - 4].isChange &&
          !updatedCells[firstIndex][secondIndex - 3].piece &&
          !updatedCells[firstIndex][secondIndex - 2].piece &&
          !updatedCells[firstIndex][secondIndex - 1].piece
        ) {
          updatedCells[firstIndex][secondIndex - 2].isAllowMove =
            selectedCell.selected;
        }

        if (
          !updatedCells[firstIndex][secondIndex + 3].isChange &&
          !updatedCells[firstIndex][secondIndex + 2].piece &&
          !updatedCells[firstIndex][secondIndex + 1].piece
        ) {
          updatedCells[firstIndex][secondIndex + 2].isAllowMove =
            selectedCell.selected;
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
    } else {
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
    kingColor: "white" | "black",
    cellsParams: CellType[][] | undefined = undefined
  ): boolean => {
    const updatedCells = cellsParams ?? [...cells];
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
        if (cell.colorPiece === enemyColor) {
          clearAllowMoveAndSelected();
          updatePieceAllowMove(i, j);

          if (updatedCells[kingRow][kingCol].isAllowMove) {
            positionsCheckedPiece = {
              positionKing: [kingRow, kingCol],
              positionPiceCheck: [i, j],
            };
            updatedCells[kingRow][kingCol].isCheck = true;
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

  return (
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
                className={`${x.colorPiece === turn ? "cursor-pointer" : ""}  ${x.selected ? "bg-blue-400" : ""
                  }${x.isCheck ? "bg-red-400" : ""}`}
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
  );
};
