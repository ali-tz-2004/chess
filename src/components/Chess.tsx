import { useEffect, useRef, useState } from "react";
import { BorderChess } from "./BorderChess";
import { ChessPiece } from "./ChessPiece";
import { Images } from "../assets/images/images";
import {
  initialPiecePlacement,
  initialPieceColors,
  convertPawPiece,
} from "../data/Piece";

type cellColorType = "bg-cellPrimary" | "bg-cellSecondary";

interface CellType {
  id: number;
  bgColor: cellColorType;
  piece: keyof (typeof Images)["black"] | null;
  colorPiece: keyof typeof Images | null;
  selected: boolean;
  isAllowMove: boolean;
  isUpdatePice: boolean;
}

export const Chess = () => {
  const [cells, setCells] = useState<CellType[][]>([]);
  const [turn, setTurn] = useState<keyof typeof Images>("white");

  const countRow = 8;
  const countColumn = 8;

  const clearAllowMoveAndSelected = (
    firstIndex: number | undefined = undefined,
    secondIndex: number | undefined = undefined
  ) => {
    let cell = [...cells];

    for (let i = 0; i < countRow; i++) {
      for (let j = 0; j < countColumn; j++) {
        if (firstIndex === i && secondIndex === j) continue;
        cell[i][j].isAllowMove = false;
        cell[i][j].selected = false;
      }
    }
    setCells(cell);
  };

  const checkUpdatePice = (): boolean => {
    return cells.some((row) => row.some((cell) => cell.isUpdatePice));
  };

  const changePieceHandler = (firstIndex: number, secondIndex: number) => {
    let updatedCells = [...cells];

    if (checkUpdatePice()) return;

    clearAllowMoveAndSelected(firstIndex, secondIndex);

    const selectedCell = updatedCells[firstIndex][secondIndex];

    if (selectedCell.colorPiece !== turn) return;

    selectedCell.selected = !selectedCell.selected;

    const handlePawnMoves = (
      direction: number,
      startRow: number,
      enemyColor: keyof typeof Images
    ) => {
      if (
        firstIndex === startRow &&
        !updatedCells[firstIndex + direction][secondIndex].piece &&
        !updatedCells[firstIndex + 2 * direction][secondIndex].piece
      ) {
        updatedCells[firstIndex + direction][secondIndex].isAllowMove =
          selectedCell.selected;
        updatedCells[firstIndex + 2 * direction][secondIndex].isAllowMove =
          selectedCell.selected;
      }

      if (!updatedCells[firstIndex + direction][secondIndex].piece) {
        updatedCells[firstIndex + direction][secondIndex].isAllowMove =
          selectedCell.selected;
      }

      if (
        secondIndex > 0 &&
        updatedCells[firstIndex + direction][secondIndex - 1].piece &&
        updatedCells[firstIndex + direction][secondIndex - 1].colorPiece ===
          enemyColor
      ) {
        updatedCells[firstIndex + direction][secondIndex - 1].isAllowMove =
          selectedCell.selected;
      }

      if (
        secondIndex < 7 &&
        updatedCells[firstIndex + direction][secondIndex + 1].piece &&
        updatedCells[firstIndex + direction][secondIndex + 1].colorPiece ===
          enemyColor
      ) {
        updatedCells[firstIndex + direction][secondIndex + 1].isAllowMove =
          selectedCell.selected;
      }
    };

    const handleRookMoves = (enemyColor: keyof typeof Images) => {
      for (let i = firstIndex - 1; i >= 0; i--) {
        if (
          updatedCells[i][secondIndex].piece &&
          updatedCells[i][secondIndex].colorPiece !== enemyColor
        ) {
          break;
        }
        updatedCells[i][secondIndex].isAllowMove = selectedCell.selected;

        if (
          updatedCells[i][secondIndex].piece &&
          updatedCells[i][secondIndex].colorPiece === enemyColor
        )
          break;
      }

      for (let i = firstIndex + 1; i < 8; i++) {
        if (
          updatedCells[i][secondIndex].piece &&
          updatedCells[i][secondIndex].colorPiece !== enemyColor
        ) {
          break;
        }

        updatedCells[i][secondIndex].isAllowMove = selectedCell.selected;

        if (
          updatedCells[i][secondIndex].piece &&
          updatedCells[i][secondIndex].colorPiece === enemyColor
        )
          break;
      }

      for (let i = secondIndex + 1; i < 8; i++) {
        if (
          updatedCells[firstIndex][i].piece &&
          updatedCells[firstIndex][i].colorPiece !== enemyColor
        ) {
          break;
        }

        updatedCells[firstIndex][i].isAllowMove = selectedCell.selected;

        if (
          updatedCells[firstIndex][i].piece &&
          updatedCells[firstIndex][i].colorPiece === enemyColor
        )
          break;
      }

      for (let i = secondIndex - 1; i >= 0; i--) {
        if (
          updatedCells[firstIndex][i].piece &&
          updatedCells[firstIndex][i].colorPiece !== enemyColor
        ) {
          break;
        }

        updatedCells[firstIndex][i].isAllowMove = selectedCell.selected;

        if (
          updatedCells[firstIndex][i].piece &&
          updatedCells[firstIndex][i].colorPiece === enemyColor
        )
          break;
      }
    };

    if (selectedCell.piece === "Pawn") {
      if (turn === "black") {
        handlePawnMoves(1, 1, "white");
      } else if (turn === "white") {
        handlePawnMoves(-1, 6, "black");
      }
    } else if (selectedCell.piece === "Rook") {
      if (turn === "black") {
        handleRookMoves("white");
      } else if (turn === "white") {
        handleRookMoves("black");
      }
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
        };

        tempList[i].push(temp);
        id++;
      }
    }

    setCells(tempList);
  };

  useEffect(() => {
    initialBase();
  }, []);

  const [selected, setSelected] = useState<number[]>([]);

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
      cellsCopy[firstIndex][secondIndex].colorPiece = turn;
      clearAllowMoveAndSelected();

      if (
        firstIndex === 0 &&
        turn === "white" &&
        cellsCopy[firstIndex][secondIndex].piece === "Pawn"
      ) {
        cellsCopy[firstIndex][secondIndex].isUpdatePice = true;
        setCells(cellsCopy);
        return;
      }

      if (
        firstIndex === 7 &&
        turn === "black" &&
        cellsCopy[firstIndex][secondIndex].piece === "Pawn"
      ) {
        cellsCopy[firstIndex][secondIndex].isUpdatePice = true;
        setCells(cellsCopy);
        return;
      }

      setCells(cellsCopy);
      setTurn(turn === "white" ? "black" : "white");
    } else {
      setSelected([firstIndex, secondIndex]);
    }
  };

  function updatePow(
    firstIndex: number,
    secondIndex: number,
    piece: keyof (typeof Images)["black"]
  ): void {
    const cellsCopy = [...cells];
    cells[firstIndex][secondIndex].piece = piece;
    cells[firstIndex][secondIndex].isUpdatePice = false;

    setTurn(turn === "white" ? "black" : "white");
    setCells(cellsCopy);
  }

  return (
    <div
      className={`h-custom-30 w-custom-30 bg-secondary grid grid-cols-8 grid-rows-8 p-8 2xl:scale-150 lg:scale-100 md:scale-50 scale-75 relative `}
    >
      {cells.map((cellChildren, firstIndex) =>
        cellChildren.map((x, secondIndex) => (
          <div
            key={x.id}
            className={`${
              x.bgColor
            } w-full h-full flex items-center justify-center relative ${
              x.isAllowMove ? "cursor-pointer" : ""
            } `}
            onClick={() => movedHandler(x.isAllowMove, firstIndex, secondIndex)}
          >
            {x.isAllowMove ? (
              <div className={`absolute w-2 h-2 bg-blue-400 rounded-xl`}></div>
            ) : null}
            {x.piece && x.colorPiece && (
              <div
                className={`${x.colorPiece === turn ? "cursor-pointer" : ""}  ${
                  x.selected ? "bg-blue-400" : ""
                }`}
                onClick={() => changePieceHandler(firstIndex, secondIndex)}
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
                    <ChessPiece piece={y} color={turn} />
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
