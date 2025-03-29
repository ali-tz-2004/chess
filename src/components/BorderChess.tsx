interface BorderChessType{
  id: number
}

export const BorderChess = ({id}:BorderChessType) => {
  const columnsTop = [
    {id: 1, name: "A"},
    {id: 2, name: "B"},
    {id: 3, name: "C"},
    {id: 4, name: "D"},
    {id: 5, name: "E"},
    {id: 6, name: "F"},
    {id: 7, name: "G"},
    {id: 8, name: "H"},
  ]

  const columnsBottom = [
    {id: 57, name: "A"},
    {id: 58, name: "B"},
    {id: 59, name: "C"},
    {id: 60, name: "D"},
    {id: 61, name: "E"},
    {id: 62, name: "F"},
    {id: 63, name: "G"},
    {id: 64, name: "H"},
  ]

  const rowsLeft = [
    {id: 1, name: "1"},
    {id: 9, name: "2"},
    {id: 17, name: "3"},
    {id: 25, name: "4"},
    {id: 33, name: "5"},
    {id: 41, name: "6"},
    {id: 49, name: "7"},
    {id: 57, name: "8"},
  ]

  const rowsRight = [
    {id: 8, name: "1"},
    {id: 16, name: "2"},
    {id: 24, name: "3"},
    {id: 32, name: "4"},
    {id: 40, name: "5"},
    {id: 48, name: "6"},
    {id: 56, name: "7"},
    {id: 64, name: "8"},
  ]

  return (
    <>
      <div className="absolute text-white -top-6">
        {columnsTop.find(x=>x.id === id)?.name}
      </div>
      <div className="absolute text-white -bottom-6">
        {columnsBottom.find(x=>x.id === id)?.name}
      </div>
      <div className="absolute text-white top-1/2 -translate-y-1/2 -left-4">
        {rowsLeft.find(x=>x.id === id)?.name}
      </div>
      <div className="absolute text-white top-1/2 -translate-y-1/2 -right-4">
        {rowsRight.find(x=>x.id === id)?.name}
      </div>
    </>
  );
};
