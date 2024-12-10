import { useEffect, useState } from "react";

type cellColorType = "bg-cellPrimary" | "bg-cellSecondary";

interface CellType {
  id: number;
  color: cellColorType;
}

export const Chess = () => {
  const [cells, setCells] = useState<CellType[]>([]);

  useEffect(() => {
    let tempList: CellType[] = [];
    const countCells = 64;

    let isOdd = false;

    for (let i = 0; i < countCells; i++) {
      if (i === 8 || i == 24 || i == 40 || i == 56) {
        isOdd = true;
      }
      let id = i;
      let color: cellColorType =
        (i % 2) - (isOdd ? 1 : 0) === 0 ? "bg-cellSecondary" : "bg-cellPrimary";

      let temp: CellType = {
        id: id,
        color: color,
      };

      tempList.push(temp);

      if (i === 15 || i === 31 || i === 47 || i === 63) isOdd = false;
    }

    setCells(tempList);
  }, []);

  return (
    <div className="h-custom-30 w-custom-30 bg-secondary grid grid-cols-8 grid-rows-8 p-4">
      {cells.map((x) => (
        <div
          key={x.id}
          className={`${x.color} w-full h-full text-green-600`}
        ></div>
      ))}
    </div>
  );
};
