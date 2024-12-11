import { Images } from "../assets/images/images";

export const ChessPiece = ({
  piece,
  color,
}: {
  piece: keyof (typeof Images)["black"];
  color: keyof typeof Images;
}) => <img src={Images[color][piece]} alt={`${color} ${piece}`} />;
