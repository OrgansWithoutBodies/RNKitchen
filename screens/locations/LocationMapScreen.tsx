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
import { BrandedNumber, ObjVec2 } from "../../structs/types";

import { BoardPiece, GridBoard } from "./GridBoard";

type BoardSpaceCoord = BrandedNumber<"BoardSpace">;
type ScreenSpaceCoord = BrandedNumber<"ScreenSpace">;

type BoardVec2 = ObjVec2<BoardSpaceCoord>;
type ScreenVec2 = ObjVec2<ScreenSpaceCoord>;
const screenCoordToBoardCoord = (
  screenCoord: ScreenVec2,
  gridSize: number
): BoardVec2 => {
  return {
    x: Math.round(screenCoord.x / gridSize) * gridSize,
    y: Math.round(screenCoord.y / gridSize) * gridSize,
  } as BoardVec2;
};
const checkConflict = (boardPieces: BoardPiece[], movePosition: BoardVec2) => {
  const foundIndex = boardPieces.findIndex(
    (piece) =>
      piece.center.x === movePosition.x && piece.center.y === movePosition.y
  );
  if (foundIndex === -1) {
    return null;
  }
  return { foundIndex };
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

// each location has a schema of a boardstate with pantry entries
export const RoomMapScreen = () => {
  // for each storageLocation in room - for each (top-level) location, add a (object) with a dot which shows products in that location on tap
  const [
    { boardPieces, productsInLocations: locationProducts, locations, products },
  ] = useData(["productsInLocations", "locations", "products", "boardPieces"]);
  const [size, setSize] = useState(1);

  const [activePiece, setActivePiece] = useState<number | null>(null);

  const addPiece = () => {
    dataService.addBoardPiece({ center: { x: 0, y: 0 } });

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
    const movePosition = screenCoordToBoardCoord(screenCoord, gridSize);
    const conflicts = checkConflict(boardPieces, movePosition);
    const completeMove = () => onMove(activePiece, movePosition);
    if (conflicts) {
      const { foundIndex } = conflicts;
      const conflictPiece = boardPieces[foundIndex];
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
          onMoveActivePiece(firstTouch, pixPerStep);
        }
      }
    } else {
      if (touches) {
        const onTouchPiece = (pieceIndex: number) => {
          setActivePiece(pieceIndex);
        };
        const onPressWithoutActive = () => {
          const movePosition = screenCoordToBoardCoord(firstTouch, pixPerStep);

          const hits = checkConflict(boardPieces, movePosition);
          console.log("TEST123-no active", hits);
          if (hits) {
            const { foundIndex } = hits;
            onTouchPiece(foundIndex);
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
    // TODO raycast
    <>
      <View style={styles.container}>
        <Pressable
          onPress={() => {
            addPiece();
          }}
          style={{ ...styles.buttonStyle, backgroundColor: "green" }}
        >
          <Text>+</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setActivePiece(null);
          }}
          style={{ ...styles.buttonStyle, backgroundColor: "yellow" }}
        >
          <Text>~</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            removeActivePiece();
          }}
          style={{ ...styles.buttonStyle, backgroundColor: "red" }}
        >
          <Text>x</Text>
        </Pressable>
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
  container: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",
  },
  buttonStyle: {
    margin: 10,
    padding: 5,
    borderRadius: 3,
    width: "30%",
    alignItems: "center",
    // width: "20px",
  },
});
