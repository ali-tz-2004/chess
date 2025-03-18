import { Images } from "../assets/images/images";

export type cellColorType = "bg-cellPrimary" | "bg-cellSecondary";

export interface CellType {
  id: number;
  bgColor: cellColorType;
  piece: keyof (typeof Images)["black"] | null;
  colorPiece: keyof typeof Images | null;
  selected: boolean;
  isAllowMove: boolean;
  isUpdatePice: boolean;
  isChange: boolean;
  isCheck: boolean;
}

export interface PositionsCheckedPiece {
  positionKing: number[];
  positionPiceCheck: number[];
}

export type StatusBishopOrQueenType = "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | null;

export type StatusRookOrQueenType = "top" | "right" | "bottom" | "left" | null;