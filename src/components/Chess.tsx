import { useEffect, useState } from "react";

type cellColorType = "bg-cellPrimary" | "bg-cellSecondary";

interface CellType {
  id: number;
  color: cellColorType;
}

export const Chess = () => {
  const [cells, setCells] = useState<CellType[][]>([]);
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const rows = [1, 2, 3, 4, 5, 6, 7, 8];

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
    <div className="h-custom-30 w-custom-30 bg-secondary grid grid-cols-8 grid-rows-8 p-8 relative">
      {cells.map((cellChildren) =>
        cellChildren.map((x) => (
          <div
            key={x.id}
            className={`${x.color} w-full h-full text-green-600`}
          ></div>
        ))
      )}
      <div className="absolute w-full h-full px-8 py-8">
        <div className="absolute text-white flex top-0">
          {columns.map((x) => (
            <div className="columns">{x}</div>
          ))}
        </div>
        <div className="absolute text-white flex bottom-0">
          {columns.map((x) => (
            <div className="columns">{x}</div>
          ))}
        </div>
        <div className="absolute text-white left-0">
          {rows.map((x) => (
            <div className="rows">{x}</div>
          ))}
        </div>
        <div className="absolute text-white right-0">
          {rows.map((x) => (
            <div className="rows">{x}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
