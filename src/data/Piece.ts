import { Images } from "../assets/images/images";

export const initialPiecePlacement: (
  | keyof (typeof Images)["black"]
  | null
)[][] = [
  ["Rook", "Knight", "Bishop", "Queen", "King", "Bishop", "Knight", "Rook"],
  Array(8).fill("Pawn"),
  ...Array(4).fill(Array(8).fill(null)),
  Array(8).fill("Pawn"),
  ["Rook", "Knight", "Bishop", "Queen", "King", "Bishop", "Knight", "Rook"],
];

export const initialPieceColors: (keyof typeof Images | null)[] = [
  "black",
  "black",
  null,
  null,
  null,
  null,
  "white",
  "white",
];

export const convertPawPiece: (keyof (typeof Images)["black"])[] = [
  "Rook",
  "Knight",
  "Bishop",
  "Queen",
];
