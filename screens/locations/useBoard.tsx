import { TouchHandler } from "@shopify/react-native-skia";
import { dataService } from "../../state/data.service";
import { ScreenVec2, ObjVec2, BoardVec2 } from "../../structs/types";
import { ActiveItem, BoardPiece, MoveWouldConflictHandler } from "./types";
import { checkCellConflictsOnBoard, findPieceConflict } from "./vecs";

const useActiveTouch = (
  activePiece,
  touches,
  boardPieces,
  gridSize,
  onMoveWouldConflict: MoveWouldConflictHandler
) => {
  if (touches) {
    if (touches.length === 1) {
      const firstTouch = touches[0] as ObjVec2 as ScreenVec2;
      const onCheckPieceLocked = (activePiece: number) => false;
      // TODO this is supposed to be a way to limit the board positions this piece can be dragged todragAllowed
      const onDragAllowed = () => true;

      const isLocked = onCheckPieceLocked(activePiece);
      const dragAllowed = onDragAllowed();
      if (dragAllowed && !isLocked) {
        onMoveActivePiece(
          firstTouch,
          gridSize,
          activePiece,
          boardPieces,
          onMoveWouldConflict
        );
      }
    }
  }
};

const screenCoordToBoardCoord = (
  screenCoord: ScreenVec2,
  gridSize: number
): BoardVec2 => {
  return {
    x: Math.round(screenCoord.x / gridSize) * gridSize,
    y: Math.round(screenCoord.y / gridSize) * gridSize,
  } as BoardVec2;
};

const onMoveActivePiece = (
  screenCoord: ScreenVec2,
  gridSize: number,
  activePiece: number,
  boardPieces: BoardPiece[],
  onMoveWouldConflict: MoveWouldConflictHandler
) => {
  if (!activePiece) {
    return;
  }
  const activeObj = boardPieces[activePiece];
  const movePosition = screenCoordToBoardCoord(screenCoord, gridSize);
  const potentialObject = { ...activeObj, center: movePosition };
  const conflicts = findPieceConflict(boardPieces, potentialObject, gridSize);
  const completeMove = () => onMove(activePiece, movePosition);
  if (conflicts) {
    const { conflictedPieceIndex } = conflicts;
    const conflictPiece = boardPieces[conflictedPieceIndex];
    if (conflictPiece) {
      onMoveWouldConflict({ completeMove, conflictPiece });
    }
  } else {
    completeMove();
  }
};
const removeActivePiece = ({ setActivePiece, activePiece }: ActiveItem) => {
  if (activePiece) {
    dataService.removeBoardPiece(activePiece);
  }

  setActivePiece(null);
};

const onPressWithoutActive = (
  firstTouch: ScreenVec2,
  boardPieces: BoardPiece[],
  gridSize: number,
  setActivePiece: ActiveItem["setActivePiece"]
) => {
  const movePosition = screenCoordToBoardCoord(firstTouch, gridSize);

  const conflicts = checkCellConflictsOnBoard(
    boardPieces,
    movePosition,
    gridSize
  );
  if (conflicts) {
    const { conflictedPieceIndex } = conflicts;
    onTouchPiece(conflictedPieceIndex, setActivePiece);
  }
};
const onTouchPiece = (
  pieceIndex: number,
  setActivePiece: ActiveItem["setActivePiece"]
) => {
  setActivePiece(pieceIndex);
};

export const buildTouchHandler: (
  boardPieces: BoardPiece[],
  gridSize: number,
  activePiece: number | null,
  onMoveWouldConflict: MoveWouldConflictHandler,
  setActivePiece: ActiveItem["setActivePiece"]
) => TouchHandler = (
  boardPieces,
  gridSize,
  activePiece,
  onMoveWouldConflict,
  setActivePiece
) => {
  return (val) => {
    const touches = val[0];
    if (!touches) {
      return;
    }
    const firstTouch = touches[0] as ObjVec2 | undefined as
      | ScreenVec2
      | undefined;
    if (!firstTouch) {
      return;
    }
    if (activePiece) {
      useActiveTouch(
        activePiece,
        touches,
        boardPieces,
        gridSize,
        onMoveWouldConflict
      );
    } else {
      if (touches) {
        onPressWithoutActive(firstTouch, boardPieces, gridSize, setActivePiece);
      }
    }
  };
};
const onMove = (activeId: number, movePosition: BoardVec2) =>
  dataService.moveBoardPiece(activeId, movePosition);

type HandlesGivenToConstructor = {
  onMoveWouldConflict: MoveWouldConflictHandler;
};
// type PiecePressHandler = (piece: BoardPiece) => void;

export const useBoardProvider: (handles: HandlesGivenToConstructor) => {
  //   onPiecePress: PiecePressHandler;
  pieces: BoardPiece[];
} = (handles) => {
  const { onMoveWouldConflict } = handles;

  //   this is the top level hander
  // const sceneHandler
  //   TODO return event stream?
  return { onMoveWouldConflict };
};
