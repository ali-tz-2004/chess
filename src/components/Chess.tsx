import { useEffect, useState } from "react";
import { BorderChess } from "./BorderChess";

type cellColorType = "bg-cellPrimary" | "bg-cellSecondary";

interface CellType {
  id: number;
  color: cellColorType;
}

export const Chess = () => {
  const [cells, setCells] = useState<CellType[][]>([]);

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
        let temp: CellType = {
          id: id,
          color: color,
        };
        tempList[i].push(temp);
        id++;
      }
    }

    setCells(tempList);
  }, []);

  return (
    <div className="h-custom-30 w-custom-30 bg-secondary grid grid-cols-8 grid-rows-8 p-8 relative md:scale-100 scale-50">
      {cells.map((cellChildren) =>
        cellChildren.map((x) => (
          <div key={x.id} className={`${x.color} w-full h-full`}></div>
        ))
      )}
      <BorderChess />
    </div>
  );
};
