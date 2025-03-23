import { Images } from "../assets/images/images";
import { motion } from "framer-motion";


export const ChessPiece = ({
  piece,
  color,
}: {
  piece: keyof (typeof Images)["black"];
  color: keyof typeof Images;
}) => (
  <motion.img
    src={Images[color][piece]}
    alt={`${color} ${piece}`}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.1 }}
    className="w-full h-full"
  />
);