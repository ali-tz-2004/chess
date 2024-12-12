import { useEffect, useState } from "react";
import { BorderChess } from "./BorderChess";
import { ChessPiece } from "./ChessPiece";
import { Images } from "../assets/images/images";
import Draggable from "react-draggable";

type cellColorType = "bg-cellPrimary" | "bg-cellSecondary";

interface CellType {
  id: number;
  color: cellColorType;
  piece: keyof (typeof Images)["black"] | null;
  colorPiece: keyof typeof Images | null;
  selected: boolean;
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

export const Chess = () => {
  const [cells, setCells] = useState<CellType[][]>([]);
  const [turn, setTurn] = useState<keyof typeof Images>("white");

  const changePieceHandler = (
    id: number,
    firstIndex: number,
    secondIndex: number,
    colorPrice: keyof typeof Images | null
  ) => {
    debugger;
    let cell = cells.filter((x) => x.filter((y) => y.id === id));

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (firstIndex === i && secondIndex === j) continue;
        cell[i][j].selected = false;
      }
    }
    setCells(cell);

    if (cell[firstIndex][secondIndex].colorPiece === turn) {
      cell[firstIndex][secondIndex].selected =
        !cell[firstIndex][secondIndex].selected;
      setCells(cell);
    }
  };

  useEffect(() => {
    let tempList: CellType[][] = [];
    let id = 1;

    for (let i = 0; i < 8; i++) {
      tempList[i] = [];
      for (let j = 0; j < 8; j++) {
        let color: cellColorType =
          (j % 2) - (i % 2 === 0 ? 1 : 0) === 0
            ? "bg-cellPrimary"
            : "bg-cellSecondary";

        const piece = initialPiecePlacement[i][j];
        const colorPiece = initialPieceColors[i];

        let temp: CellType = {
          id: id,
          color: color,
          piece: piece,
          colorPiece: colorPiece,
          selected: false,
        };

        tempList[i].push(temp);
        id++;
      }
    }

    setCells(tempList);
  }, []);

  return (
    <div
      className="h-custom-30 w-custom-30 bg-secondary grid grid-cols-8 grid-rows-8 p-8 relative
    2xl:scale-150 lg:scale-100 md:scale-50 scale-75 "
    >
      {cells.map((cellChildren, firstIndex) =>
        cellChildren.map((x, secondIndex) => (
          <div key={x.id} className={`${x.color} w-full h-full z-10`}>
            {x.piece && x.colorPiece && (
              <div
                className={`${x.colorPiece === turn ? "cursor-pointer" : ""}  ${
                  x.selected ? "bg-blue-400" : ""
                }`}
                onClick={() =>
                  changePieceHandler(
                    x.id,
                    firstIndex,
                    secondIndex,
                    x.colorPiece
                  )
                }
              >
                <ChessPiece piece={x.piece} color={x.colorPiece} />
              </div>
            )}
          </div>
        ))
      )}
      <BorderChess />
    </div>
  );
};
