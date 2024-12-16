import { Images } from "../assets/images/images";

interface BorderChessProp {
  turn: keyof typeof Images;
}

export const BorderChess = ({ turn }: BorderChessProp) => {
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const rows = [8, 7, 6, 5, 4, 3, 2, 1];

  return (
    <div
      className={`absolute w-full h-full p-8 ${
        turn === "black" ? "rotate-180" : ""
      }`}
    >
      <div className="absolute text-white flex top-0">
        {columns.map((x) => (
          <div className="md:p-columns p-columns-mobil">{x}</div>
        ))}
      </div>
      <div className="absolute text-white flex bottom-0">
        {columns.map((x) => (
          <div className="md:p-columns p-columns-mobil">{x}</div>
        ))}
      </div>
      <div className="absolute text-white left-0">
        {rows.map((x) => (
          <div className="md:p-rows p-rows-mobil">{x}</div>
        ))}
      </div>
      <div className="absolute text-white right-0">
        {rows.map((x) => (
          <div className="md:p-rows p-rows-mobil">{x}</div>
        ))}
      </div>
    </div>
  );
};
