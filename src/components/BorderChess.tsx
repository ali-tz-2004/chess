export const BorderChess = () => {
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const rows = [8, 7, 6, 5, 4, 3, 2, 1];

  return (
    <div>
      <div className="fixed text-white flex top-0 left-8">
        {columns.map((x) => (
          <div className="md:p-columns p-columns-mobil">{x}</div>
        ))}
      </div>
      <div className="fixed text-white flex bottom-0 left-8">
        {columns.map((x) => (
          <div className="md:p-columns p-columns-mobil">{x}</div>
        ))}
      </div>
      <div className="fixed text-white left-0 top-8">
        {rows.map((x) => (
          <div className="md:p-rows p-rows-mobil">{x}</div>
        ))}
      </div>
      <div className="fixed text-white right-0 top-8">
        {rows.map((x) => (
          <div className="md:p-rows p-rows-mobil">{x}</div>
        ))}
      </div>
    </div>
  );
};
