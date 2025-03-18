import { initialPieceColors, initialPiecePlacement } from "../data/Piece";
import { cellColorType, CellType } from "../type/ChessTypes";
import store from "storejs";

type InitialBaseParams = {
    setCells: (cells: CellType[][]) => void;
    setTurn: (turn: "black" | "white") => void;
};

const countRow = 8;
const countColumn = 8;
  
export const initialBase = ({ setCells, setTurn }: InitialBaseParams) => {
    const storedCells = store.get("cells") as CellType[][];
  
    if (storedCells && storedCells.length > 0) {
      setCells(storedCells);
      setTurn(store.get("turn"));
      return;
    }
  
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
  