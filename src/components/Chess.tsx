import { useEffect, useState } from "react";
import { BorderChess } from "./BorderChess";
import { ChessPiece } from "./ChessPiece";
import { Images } from "../assets/images/images";
import { convertPawPiece } from "../data/Piece";
import { Popup } from "./Popup";
import useStoreState from "../hooks/useStoreState";
import store from "storejs";
import { CellType, PositionsCheckedPiece, cellColorType } from "../type/ChessTypes";
import { checkForAllowMoves, checkUpdatePice, handleBishopMoves, handleKingMoves, handleKnightMoves, handlePawnMoves, handleQueenMoves, handleRookMoves, validAllowMove } from "../utils/Moves";
import { clearMovesAndSelection } from "../utils/ClearMove";
import { initialBase } from "../utils/InitialState";

export const Chess = () => {
  const [cells, setCells] = useStoreState<CellType[][]>("cells", []);
  const [turn, setTurn] = useStoreState<keyof typeof Images>("turn", "white");
  const [selected, setSelected] = useState<number[]>([]);
  const [positionsCheckedPiece, setPositionsCheckedPiece] = useState<PositionsCheckedPiece | undefined>();
  const [moveCount, setMoveCount] = useState(0);
  const [isClose, setIsClose] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isEqual, setIsEqual] = useState(false);

  const countRow = 8;
  const countColumn = 8;

  const enemyColor = turn === "black" ? "white" : "black";

  const updatePieceAllowMove = (firstIndex: number, secondIndex: number, isAllow: boolean = true) => {
    if (isClose) return;

    let updatedCells = [...cells];

    const selectedCell = updatedCells[firstIndex][secondIndex];

    if (checkUpdatePice(cells)) return;

    clearMovesAndSelection(cells, setCells, firstIndex, secondIndex, false);

    if (selectedCell.colorPiece !== turn) return;

    selectedCell.selected = !selectedCell.selected;

    if (selectedCell.piece === "Pawn") {
      const direction = turn === "black" ? 1 : -1;
      const startRow = turn === "black" ? 1 : 6;
      handlePawnMoves(updatedCells, firstIndex, secondIndex, direction, startRow, enemyColor, positionsCheckedPiece);
    } else if (selectedCell.piece === "Rook") {
      handleRookMoves(updatedCells, firstIndex, secondIndex, isAllow, firstIndex - 1, -1, true, -1, enemyColor, positionsCheckedPiece); // Up
      handleRookMoves(updatedCells, firstIndex, secondIndex, isAllow, firstIndex + 1, 8, true, 1, enemyColor, positionsCheckedPiece); // Down
      handleRookMoves(updatedCells, firstIndex, secondIndex, isAllow, secondIndex + 1, 8, false, 1, enemyColor, positionsCheckedPiece); // Right
      handleRookMoves(updatedCells, firstIndex, secondIndex, isAllow, secondIndex - 1, -1, false, -1, enemyColor, positionsCheckedPiece); // Left
    } else if (selectedCell.piece === "Knight") {
      handleKnightMoves(updatedCells, firstIndex, secondIndex, turn, positionsCheckedPiece);
    } else if (selectedCell.piece === "Bishop") {
      handleBishopMoves(updatedCells, firstIndex, secondIndex, -1, -1, turn, enemyColor, positionsCheckedPiece); // Top-left
      handleBishopMoves(updatedCells, firstIndex, secondIndex, 1, 1, turn, enemyColor, positionsCheckedPiece); // Bottom-right
      handleBishopMoves(updatedCells, firstIndex, secondIndex, 1, -1, turn, enemyColor, positionsCheckedPiece); // Bottom-left
      handleBishopMoves(updatedCells, firstIndex, secondIndex, -1, 1, turn, enemyColor, positionsCheckedPiece); // Top-right
    } else if (selectedCell.piece === "Queen") {
      handleQueenMoves(updatedCells, firstIndex, secondIndex, isAllow, turn, enemyColor, positionsCheckedPiece);
    } else if (selectedCell.piece === "King") {
      handleKingMoves(updatedCells, firstIndex, secondIndex, isAllow, turn, enemyColor, positionsCheckedPiece);
    } else {
      return;
    }

    if (isAllow) if (validAllowMove(updatedCells, firstIndex, secondIndex, selectedCell.selected, turn, cells, setCells)) {
      return;
    }

    setCells(updatedCells);
  };

  const movedHandler = (
    isAllowMove: boolean,
    firstIndex: number,
    secondIndex: number
  ): void => {
    if (isAllowMove) {
      const cellsCopy = [...cells];

      updateMoveCount(cellsCopy[selected[0]][selected[1]], cellsCopy[firstIndex][secondIndex]);

      cellsCopy[firstIndex][secondIndex].piece =
        cellsCopy[selected[0]][selected[1]].piece;
      cellsCopy[selected[0]][selected[1]].piece = null;
      cellsCopy[selected[0]][selected[1]].colorPiece = null;
      cellsCopy[firstIndex][secondIndex].colorPiece = turn;
      cellsCopy[firstIndex][secondIndex].isChange = true;

      if (
        turn === "white" &&
        cellsCopy[firstIndex][secondIndex].piece === "King"
      ) {
        if (selected[1] - 2 === secondIndex) {
          cellsCopy[7][0].piece = null;
          cellsCopy[7][3].piece = "Rook";
          cellsCopy[7][3].colorPiece = turn;
        } else if (selected[1] + 2 === secondIndex) {
          cellsCopy[7][7].piece = null;
          cellsCopy[7][5].piece = "Rook";
          cellsCopy[7][5].colorPiece = turn;
        }
      }

      if (
        turn === "black" &&
        cellsCopy[firstIndex][secondIndex].piece === "King"
      ) {
        if (selected[1] - 2 === secondIndex) {
          cellsCopy[0][0].piece = null;
          cellsCopy[0][3].piece = "Rook";
          cellsCopy[0][3].colorPiece = turn;
        } else if (selected[1] + 2 === secondIndex) {
          cellsCopy[0][7].piece = null;
          cellsCopy[0][5].piece = "Rook";
          cellsCopy[0][5].colorPiece = turn;
        }
      }

      clearMovesAndSelection(cells, setCells);

      if (
        firstIndex === 0 &&
        turn === "white" &&
        cellsCopy[firstIndex][secondIndex].piece === "Pawn"
      ) {
        cellsCopy[firstIndex][secondIndex].isUpdatePice = true;
      }

      if (
        firstIndex === 7 &&
        turn === "black" &&
        cellsCopy[firstIndex][secondIndex].piece === "Pawn"
      ) {
        cellsCopy[firstIndex][secondIndex].isUpdatePice = true;
      }

      if (isCheck(turn === "white" ? "black" : "white")) {
        console.log("Check!");
      } else {
        clearMovesAndSelection(cells, setCells, undefined, undefined, true);
        setPositionsCheckedPiece(undefined);
      }

      setCells(cellsCopy);
      if (!cellsCopy[firstIndex][secondIndex].isUpdatePice) {
        setTurn(turn === "white" ? "black" : "white");
      }
    } else if (cells[firstIndex][secondIndex].piece) {
      setSelected([firstIndex, secondIndex]);
    }
  };

  const updateMoveCount = (from: CellType, to: CellType) => {
    if (from.piece === "Pawn" || to.piece !== null) {
      setMoveCount(0);
    } else {
      setMoveCount(prev => prev + 1);
    }
  }

  const updatePow = (
    firstIndex: number,
    secondIndex: number,
    piece: keyof (typeof Images)["black"]
  ): void => {
    const cellsCopy = [...cells];
    cells[firstIndex][secondIndex].piece = piece;
    cells[firstIndex][secondIndex].isUpdatePice = false;

    setCells(cellsCopy);
    isCheck(turn === "white" ? "black" : "white");
    setTurn(turn === "white" ? "black" : "white");
  };

  const isCheck = (
    kingColor: "white" | "black",
    cellsParams: CellType[][] | undefined = undefined
  ): boolean => {
    const updatedCells = cellsParams ? cellsParams : [...cells];
    let kingPosition: [number, number] | null = null;

    for (let i = 0; i < countRow; i++) {
      for (let j = 0; j < countColumn; j++) {
        if (
          updatedCells[i][j].piece === "King" &&
          updatedCells[i][j].colorPiece === kingColor
        ) {
          kingPosition = [i, j];
          break;
        }
      }
      if (kingPosition) break;
    }

    if (!kingPosition) return false;

    const [kingRow, kingCol] = kingPosition;
    const enemyColor = kingColor === "white" ? "black" : "white";
    let isKingInCheck = false;
    let positionsCheckedPiece: PositionsCheckedPiece | undefined = undefined;

    for (let i = 0; i < countRow; i++) {
      for (let j = 0; j < countColumn; j++) {
        const cell = updatedCells[i][j];
        if (cell?.colorPiece === enemyColor) {
          clearMovesAndSelection(cells, setCells);
          updatePieceAllowMove(i, j, false);

          if (updatedCells[kingRow][kingCol].isAllowMove) {
            positionsCheckedPiece = {
              positionKing: [kingRow, kingCol],
              positionPiceCheck: [i, j],
            };
            updatedCells[kingRow][kingCol].isCheck = true;
            clearMovesAndSelection(cells, setCells, kingRow, kingCol, true);
            isKingInCheck = true;
          }
        }
      }
    }

    setPositionsCheckedPiece(positionsCheckedPiece);

    clearMovesAndSelection(cells, setCells);

    if (cellsParams) setCells(updatedCells);

    return isKingInCheck;
  };

  useEffect(() => {
    initialBase({ setCells, setTurn });
  }, []);

  const gameWinHandler = () =>{
    if (positionsCheckedPiece) {
      updatePieceAllowMove(positionsCheckedPiece.positionKing[0], positionsCheckedPiece.positionKing[1], true);

      if (checkForAllowMoves(cells)) {
        setIsEnd(false);
        clearMovesAndSelection(cells, setCells);
        return;
      }

      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (cells[i][j]?.colorPiece === turn) updatePieceAllowMove(i, j, true);
          if (checkForAllowMoves(cells)) {
            setIsEnd(false);
            clearMovesAndSelection(cells, setCells);
            return;
          }
        }
      }

      setIsEnd(true);
    }
  }

  useEffect(() => {
    gameWinHandler();
  }, [setCells, positionsCheckedPiece])

  const equalStalemate = () => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (cells[i][j]?.colorPiece === turn) {
          updatePieceAllowMove(i, j, true);
          if (checkForAllowMoves(cells)) {
            clearMovesAndSelection(cells, setCells);
            return false;
          }
        }
      }
    }
    return true;
  };

  const isInsufficientMaterial = (): boolean => {
    let whitePieces: string[] = [];
    let blackPieces: string[] = [];

    for (let row of cells) {
      for (let cell of row) {
        if (cell.piece) {
          if (cell.colorPiece === "white") {
            whitePieces.push(cell.piece);
          } else if (cell.colorPiece === "black") {
            blackPieces.push(cell.piece);
          }
        }
      }
    }

    const hasOnlyKingAnd = (pieces: string[], allowed: string[]) => {
      return pieces.length === 1 || (pieces.length === 2 && allowed.includes(pieces[1]));
    };

    if (
      (hasOnlyKingAnd(whitePieces, ["Bishop", "Knight"]) && blackPieces.length === 1) ||
      (hasOnlyKingAnd(blackPieces, ["Bishop", "Knight"]) && whitePieces.length === 1)
    ) {
      return true;
    }

    if (whitePieces.length === 3 && whitePieces.filter(p => p === "Knight").length === 2 && blackPieces.length === 1) {
      return true;
    }
    if (blackPieces.length === 3 && blackPieces.filter(p => p === "Knight").length === 2 && whitePieces.length === 1) {
      return true;
    }

    return false;
  }

  useEffect(() => {
    const isStalemate = equalStalemate();
    const isInsufficient = isInsufficientMaterial();

    setIsEqual(isStalemate || isInsufficient);
  }, [setCells, turn]);

  useEffect(() => {
    if (moveCount === 50) {
      setIsEqual(true);
    }
  }, [moveCount]);

  const resetGame = () => {
    clearMovesAndSelection(cells, setCells);
    setTurn("white");
    setSelected([]);
    setPositionsCheckedPiece(undefined);
    store.remove("turn");
    store.remove("cells")
    initialBase({ setCells, setTurn });
    setIsEnd(false);
    setIsEqual(false);
    setIsClose(false);
  }

  const closePopup = () => {
    setIsClose(true);
    setIsEnd(false);
    setIsEqual(false);
  }

  return (
    <>
      <div
        className={`h-custom-30 w-custom-30 bg-secondary grid grid-cols-8 grid-rows-8 p-8 2xl:scale-150 lg:scale-100 md:scale-50 scale-75 relative `}
      >
        {cells.map((cellChildren, firstIndex) =>
          cellChildren.map((x, secondIndex) => (
            <div
              key={x.id}
              className={`${x.bgColor
                } w-full h-full flex items-center justify-center relative ${x.isAllowMove ? "cursor-pointer" : ""
                } `}
              onClick={() => movedHandler(x.isAllowMove, firstIndex, secondIndex)}
            >
              {x.isAllowMove ? (
                <div className={`absolute w-2 h-2 bg-blue-400 rounded-xl`}></div>
              ) : null}
              {x.piece && x.colorPiece && (
                <div
                  className={`
                  ${x.colorPiece === turn ? "cursor-pointer" : ""} 
                  ${x.selected && !x.isCheck ? "bg-blue-500" : ""} 
                  ${x.isCheck && x.selected ? "bg-purple-500" : ""} 
                  ${x.isCheck && !x.selected ? "bg-red-400" : ""}
                  `
                  }
                  onClick={() => updatePieceAllowMove(firstIndex, secondIndex)}
                >
                  <ChessPiece piece={x.piece} color={x.colorPiece} />
                </div>
              )}
              {x.isUpdatePice ? (
                <div className="w-52 h-full absolute bg-secondary top-16 right-0 z-10 flex">
                  {convertPawPiece.map((y, index) => (
                    <div
                      onClick={() => updatePow(firstIndex, secondIndex, y)}
                      className="pointer"
                      key={index}
                    >
                      <ChessPiece
                        piece={y}
                        color={turn}
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))
        )}
        <BorderChess />

      </div>

      {(isEnd || isEqual) && (
        <div className="flex flex-col items-center justify-center h-screen">
          <Popup title="end game"
            description={isEqual && !isEnd
              ? "The game was tied."
              : turn === "white"
                ? "The black piece won"
                : "The white piece won"
            }
            messageClose="close" isOpen={isEnd || isEqual} onClose={closePopup}
            messageReset="reset" onReset={resetGame}
          />
        </div>
      )}
      <button className="mt-4 w-24 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 absolute top-0" onClick={resetGame}>
        reset game
      </button>
    </>
  );
};
