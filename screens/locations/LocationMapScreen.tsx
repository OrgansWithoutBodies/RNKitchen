import {
  Skia,
  BlendMode,
  SkRect,
  Canvas,
  TouchHandler,
} from "@shopify/react-native-skia";
import React, { useState } from "react";
import {
  Button,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
  Text,
} from "react-native";

import { dataService } from "../../state/data.service";
import { useData } from "../../state/useAkita";
import {
  BoardVec2,
  BrandedNumber,
  HexStr,
  ObjVec2,
  ScreenVec2,
} from "../../structs/types";

import {
  combineTwoVecs,
  BoardPiece,
  GridBoard,
  positionOffsets,
} from "./GridBoard";

const screenCoordToBoardCoord = (
  screenCoord: ScreenVec2,
  gridSize: number
): BoardVec2 => {
  return {
    x: Math.round(screenCoord.x / gridSize) * gridSize,
    y: Math.round(screenCoord.y / gridSize) * gridSize,
  } as BoardVec2;
};
const twoVecsSame = (vecA: ObjVec2, vecB: ObjVec2): boolean => {
  return vecA.x === vecB.x && vecA.y === vecB.y;
};
const checkCellConflictsPiece = (
  boardPieces: BoardPiece[],
  cellPosition: BoardVec2,
  gridSize: number
) => {
  const conflictedPieceIndex = boardPieces.findIndex((piece) => {
    const { shape, center } = piece;
    if (shape) {
      const anyShapeOverlap = shape
        .map((centerOffset) => {
          const piecePosition = positionOffsets(
            centerOffset,
            piece.center,
            gridSize
          );
          const overlap = twoVecsSame(piecePosition, cellPosition);
          return overlap;
        })
        .reduce((prev, current) => prev || current);
      return anyShapeOverlap;
    }

    return twoVecsSame(center, cellPosition);
  });
  if (conflictedPieceIndex === -1) {
    return null;
  }
  console.log(conflictedPieceIndex);
  return { conflictedPieceIndex };
};
const checkPieceConflictsPiece = (
  boardPieces: BoardPiece[],
  originalPiece: BoardPiece,
  gridSize: number
): {
  conflictedPieceIndex: number;
} | null => {
  if (originalPiece.shape) {
    for (const offset of originalPiece.shape) {
      const offsetCenter = positionOffsets(
        offset,
        originalPiece.center,
        gridSize
      );
      const conflict = checkCellConflictsPiece(
        boardPieces,
        offsetCenter,
        gridSize
      );
      console.log("TEST123-overlap", conflict);

      if (conflict) {
        return conflict;
      }
    }
    return null;
  }

  return checkCellConflictsPiece(boardPieces, originalPiece.center, gridSize);
};
const paint = Skia.Paint();
paint.setAntiAlias(true);
paint.setBlendMode(BlendMode.Multiply);
type PiecePressHandler = (piece: BoardPiece) => void;
type MoveWouldConflictHandler = (props: {
  completeMove: () => void;
  conflictPiece: BoardPiece;
}) => void;
// TODO hookify
// pass board state to invoked area - maybe context handler?
const useBoard: () => {
  onMoveWouldConflict: MoveWouldConflictHandler;
  onPiecePress: PiecePressHandler;
  pieces: BoardPiece[];
} = () => {
  const onMoveWouldConflict = () => {};
  return { onMoveWouldConflict };
};
const getRandomColor = (): HexStr => {
  const channelSize = 16;
  const charCode = new Array(6)
    .fill(0)
    .map(() => Math.round(Math.random() * channelSize).toString(16))
    .reduce((prev, curr) => prev + curr);

  return `#${charCode}`;
};
export function ControllerButton({
  onPress,
  backgroundColor,
  label,
}: {
  onPress: () => void;
  backgroundColor: string;
  label: string;
}): JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      style={{ ...styles.buttonStyle, backgroundColor }}
    >
      <Text>{label}</Text>
    </Pressable>
  );
}
// each location has a schema of a boardstate with pantry entries
export const RoomMapScreen = () => {
  // for each storageLocation in room - for each (top-level) location, add a (object) with a dot which shows products in that location on tap
  const [
    { boardPieces, productsInLocations: locationProducts, locations, products },
  ] = useData(["productsInLocations", "locations", "products", "boardPieces"]);
  const [size, setSize] = useState(1);

  const [activePiece, setActivePiece] = useState<number | null>(null);

  const addPiece = () => {
    dataService.addBoardPiece({
      center: { x: 0, y: 0 },
      shape: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ],
      color: getRandomColor(),
    });

    setActivePiece(boardPieces.length);
  };
  const removeActivePiece = () => {
    console.log("TEST123-removing", activePiece);
    if (activePiece) {
      dataService.removeBoardPiece(activePiece);
    }

    setActivePiece(null);
  };

  const onMoveWouldConflict: MoveWouldConflictHandler = ({}) => {};
  const { width, height } = Dimensions.get("window");
  const pixPerStep = 50;
  const nLines = {
    x: Math.ceil(width / pixPerStep),
    y: Math.ceil(height / pixPerStep),
  };

  const onMove = (activeId: number, movePosition: BoardVec2) =>
    dataService.moveBoardPiece(activeId, movePosition);
  const onMoveActivePiece = (
    screenCoord: ScreenVec2,
    gridSize: number
    // activePiece: number,
    // boardPieces: BoardPiece[]
  ) => {
    if (!activePiece) {
      return;
    }
    const activeObj = boardPieces[activePiece];
    const movePosition = screenCoordToBoardCoord(screenCoord, gridSize);
    const potentialObject = { ...activeObj, center: movePosition };
    const conflicts = checkPieceConflictsPiece(
      boardPieces,
      potentialObject,
      gridSize
    );
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
  const touchHandler: TouchHandler = (val) => {
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
      if (touches) {
        if (touches.length === 1) {
          const onCheckPieceLocked = (activePiece: number) => false;
          // TODO this is supposed to be a way to limit the board positions this piece can be dragged todragAllowed
          const onDragAllowed = () => true;

          const isLocked = onCheckPieceLocked(activePiece);
          const dragAllowed = onDragAllowed();
          if (dragAllowed && !isLocked) {
            onMoveActivePiece(firstTouch, pixPerStep);
          }
        }
      }
    } else {
      if (touches) {
        const onTouchPiece = (pieceIndex: number) => {
          setActivePiece(pieceIndex);
        };
        const onPressWithoutActive = () => {
          const movePosition = screenCoordToBoardCoord(firstTouch, pixPerStep);

          const hits = checkCellConflictsPiece(
            boardPieces,
            movePosition,
            pixPerStep
          );
          // console.log("TEST123-no active", hits);
          if (hits) {
            const { conflictedPieceIndex } = hits;
            onTouchPiece(conflictedPieceIndex);
          }
        };
        onPressWithoutActive();
      }
    }
  };
  const rect: SkRect = { height, width, x: 0, y: 0 };
  // TODO ? https://www.npmjs.com/package/react-native-draggable

  return (
    // TODO xstate machine for turning touch sequences into events
    // TODO debounce events?
    // TODO store layout
    // TODO moveable/zoomable viewport
    <>
      <View>
        <Text style={{ color: "white" }}>
          {activePiece && `Active Object: ${activePiece}`}
        </Text>
      </View>
      <View style={styles.controller}>
        <ControllerButton
          onPress={() => setActivePiece(null)}
          backgroundColor={activePiece !== null ? "yellow" : "grey"}
          label="~"
        />
        <ControllerButton
          onPress={() => addPiece()}
          backgroundColor={"green"}
          label="+"
        />
        <ControllerButton
          onPress={() => removeActivePiece()}
          backgroundColor={"red"}
          label="-"
        />
      </View>
      <Canvas style={{ flex: 1 }} onTouch={touchHandler}>
        <GridBoard
          activePiece={activePiece}
          pieces={boardPieces}
          offsetPerc={0.5}
          nLines={nLines}
          gridSize={pixPerStep}
          height={height}
          width={width}
        />
      </Canvas>
    </>
  );
};

const styles = StyleSheet.create({
  controller: {
    flexDirection: "row",

    alignItems: "stretch",
    justifyContent: "center",
    width: "100%",
  },
  buttonStyle: {
    margin: 10,
    padding: 5,
    borderRadius: 3,
    width: 160,
    alignItems: "center",
  },
});
