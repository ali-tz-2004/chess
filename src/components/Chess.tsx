import { useEffect, useRef, useState } from "react";
import { BorderChess } from "./BorderChess";
import { ChessPiece } from "./ChessPiece";
import { Images } from "../assets/images/images";
import Draggable from "react-draggable";

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

const initialPiecePlacement: (keyof (typeof Images)["black"] | null)[][] = [
  ["Rook", "Knight", "Bishop", "Queen", "King", "Bishop", "Knight", "Rook"],
  Array(8).fill("Pawn"),
  ...Array(4).fill(Array(8).fill(null)),
  Array(8).fill("Pawn"),
  ["Rook", "Knight", "Bishop", "Queen", "King", "Bishop", "Knight", "Rook"],
];

const initialPieceColors: (keyof typeof Images | null)[] = [
  "black",
  "black",
  null,
  null,
  null,
  null,
  "white",
  "white",
];

const convertPawPiece: (keyof (typeof Images)["black"])[] = [
  "Rook",
  "Knight",
  "Bishop",
  "Queen",
];

export const Chess = () => {
  const [cells, setCells] = useState<CellType[][]>([]);
  const [turn, setTurn] = useState<keyof typeof Images>("white");

  const countRow = 8;
  const countColumn = 8;

  const clearAllowMoveAndSelected = () => {
    let cell = [...cells];

    for (let i = 0; i < countRow; i++) {
      for (let j = 0; j < countColumn; j++) {
        cell[i][j].isAllowMove = false;
        cell[i][j].selected = false;
      }
    }
    setCells(cell);
  };

  const checkUpdatePice = (): boolean => {
    let cell = [...cells];
    for (let i = 0; i < countRow; i++) {
      for (let j = 0; j < countColumn; j++) {
        if (cell[i][j].isUpdatePice) return true;
      }
    }

    return false;
  };

  const changePieceHandler = (firstIndex: number, secondIndex: number) => {
    let cell = [...cells];

    if (cell[firstIndex][secondIndex].isUpdatePice || checkUpdatePice()) return;

    for (let i = 0; i < countRow; i++) {
      for (let j = 0; j < countColumn; j++) {
        if (firstIndex === i && secondIndex === j) continue;
        cell[i][j].isAllowMove = false;
        cell[i][j].selected = false;
      }
    }
    setCells(cell);

    const cellSelected = cell[firstIndex][secondIndex];

    if (cellSelected.colorPiece === turn) {
      cellSelected.selected = !cellSelected.selected;

      switch (cellSelected.colorPiece) {
        case "black":
          switch (cellSelected.piece) {
            case "Pawn":
              if (
                firstIndex === 1 &&
                !cell[firstIndex + 1][secondIndex].piece &&
                !cell[firstIndex + 2][secondIndex].piece
              ) {
                cell[firstIndex + 1][secondIndex].isAllowMove =
                  cellSelected.selected;
                cell[firstIndex + 2][secondIndex].isAllowMove =
                  cellSelected.selected;
              }
              if (!cell[firstIndex + 1][secondIndex].piece) {
                cell[firstIndex + 1][secondIndex].isAllowMove =
                  cellSelected.selected;
              }
              if (
                secondIndex !== 0 &&
                cell[firstIndex + 1][secondIndex - 1].piece &&
                cell[firstIndex + 1][secondIndex - 1].colorPiece === "white"
              ) {
                cell[firstIndex + 1][secondIndex - 1].isAllowMove =
                  cellSelected.selected;
              }
              if (
                secondIndex !== 7 &&
                cell[firstIndex + 1][secondIndex + 1].piece &&
                cell[firstIndex + 1][secondIndex + 1].colorPiece === "white"
              ) {
                cell[firstIndex + 1][secondIndex + 1].isAllowMove =
                  cellSelected.selected;
              }
              break;
            default:
              break;
          }
          break;
        case "white":
          switch (cellSelected.piece) {
            case "Pawn":
              if (
                firstIndex === 6 &&
                !cell[firstIndex - 1][secondIndex].piece &&
                !cell[firstIndex - 2][secondIndex].piece
              ) {
                cell[firstIndex - 1][secondIndex].isAllowMove =
                  cellSelected.selected;
                cell[firstIndex - 2][secondIndex].isAllowMove =
                  cellSelected.selected;
              }
              if (!cell[firstIndex - 1][secondIndex].piece) {
                cell[firstIndex - 1][secondIndex].isAllowMove =
                  cellSelected.selected;
              }
              if (
                secondIndex !== 0 &&
                cell[firstIndex - 1][secondIndex - 1].piece &&
                cell[firstIndex - 1][secondIndex - 1].colorPiece === "black"
              ) {
                cell[firstIndex - 1][secondIndex - 1].isAllowMove =
                  cellSelected.selected;
              }
              if (
                secondIndex !== 7 &&
                cell[firstIndex - 1][secondIndex + 1].piece &&
                cell[firstIndex - 1][secondIndex + 1].colorPiece === "black"
              ) {
                cell[firstIndex - 1][secondIndex + 1].isAllowMove =
                  cellSelected.selected;
              }
              break;
            default:
              break;
          }
          break;
      }
      setCells(cell);
    }
  };

  useEffect(() => {
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

      if (firstIndex === 0 && turn === "white") {
        cellsCopy[firstIndex][secondIndex].isUpdatePice = true;
        setCells(cellsCopy);
        return;
      }

      if (firstIndex === 7 && turn === "black") {
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
