import { ObjVec2, BoardVec2, OffsetVec2 } from "../../structs/types";
import { BoardPiece } from "./types";

export const positionOffsets = (
  offset: OffsetVec2,
  center: BoardVec2,
  gridSize: number
): BoardVec2 => {
  return combineTwoVecs(multiplyScalar(offset, gridSize), center) as BoardVec2;
};
export const combineTwoVecs = (vecA: ObjVec2, vecB: ObjVec2) => {
  return { x: vecA.x + vecB.x, y: vecA.y + vecB.y };
};
export const multiplyScalar = (vecA: ObjVec2, scalar: number) => {
  return { x: vecA.x * scalar, y: vecA.y * scalar };
};

const twoVecsSame = (vecA: ObjVec2, vecB: ObjVec2): boolean => {
  return vecA.x === vecB.x && vecA.y === vecB.y;
};
type Conflict = {
  conflictedPieceIndex: number;
} | null;
const checkTileConflictsTile = (
  cellA: BoardVec2,
  cellB: BoardVec2
): boolean => {
  return twoVecsSame(cellA, cellB);
};
export const checkCellConflictsPiece = (
  boardPiece: BoardPiece,
  cellPosition: BoardVec2,
  gridSize: number
): boolean => {
  const { shape, center } = boardPiece;

  for (const tileOffset of shape) {
    const piecePosition = positionOffsets(tileOffset, center, gridSize);
    const conflict = checkTileConflictsTile(piecePosition, cellPosition);

    if (conflict) {
      return conflict;
    }
  }
  return false;
};
const checkPieceConflictsPiece = (
  pieceA: BoardPiece,
  pieceB: BoardPiece,
  gridSize: number
): boolean => {
  for (const offset of pieceB.shape) {
    const offsetCenter = positionOffsets(offset, pieceB.center, gridSize);
    const conflict = checkCellConflictsPiece(pieceA, offsetCenter, gridSize);

    if (conflict) {
      return true;
    }
  }
  return false;
};

export const checkCellConflictsOnBoard = (
  allBoardPieces: BoardPiece[],
  activeCell: BoardVec2,
  // TODO once boardspace has units of 1 this wont be needed
  gridSize: number
): Conflict => {
  let ii = 0;
  for (const boardPiece of allBoardPieces) {
    const conflict = checkCellConflictsPiece(boardPiece, activeCell, gridSize);
    if (conflict) {
      return { conflictedPieceIndex: ii };
    }
    ii += 1;
  }
  return null;
};

// TODO piece can conflict w self
export const findPieceConflict = (
  allBoardPieces: BoardPiece[],
  activePiece: BoardPiece,
  // TODO once boardspace has units of 1 this wont be needed
  gridSize: number
): Conflict => {
  for (const tileOffset of activePiece.shape) {
    const piecePosition = positionOffsets(
      tileOffset,
      activePiece.center,
      gridSize
    );

    const conflict = checkCellConflictsOnBoard(
      allBoardPieces,
      piecePosition,
      gridSize
    );
    if (conflict) {
      return conflict;
    }
  }
  return null;
};
