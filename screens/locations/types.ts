import type { BoardVec2, OffsetVec2, HexStr } from "../../structs/types";

export type ActiveItem = {
  activePiece: number | null;
  setActivePiece: (activePiece: number | null) => void;
};
export type BoardPiece = {
  center: BoardVec2;
  shape: OffsetVec2[];
  color?: HexStr;
  label?: string;
};
export type MoveWouldConflictHandler = (props: {
  completeMove: () => void;
  conflictPiece: BoardPiece;
}) => void;
