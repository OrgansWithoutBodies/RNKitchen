import { Circle, Line } from "@shopify/react-native-skia";
import React from "react";
import { ObjVec2 } from "../../structs/types";
import { Grid } from "./Grid";
//   TODO handle different piece shapes
export type BoardPiece = { center: ObjVec2; shape?: ObjVec2[] };
// const activeGuard=(piece):piece is active
export function GridBoard({
  pieces,
  nLines,
  gridSize,
  height,
  width,
  activePiece = null,
  offsetPerc = 0,
}: {
  pieces: BoardPiece[];
  nLines: ObjVec2;
  gridSize: number;
  height: number;
  width: number;
  offsetPerc?: number;
  activePiece?: number | null;
  //   TODO handle
  // onPieceTouch/
  // onPieceDrag/
  // onPieceMove/
  // what to do when dragging piece into spot occupied by other pieces,
  // here's where logic for capture/prevent movement takes place
  // onDragConflicts/
  // etc
}): JSX.Element {
  const percRadiusPadding = 0.2;
  const padding = gridSize * percRadiusPadding;
  if (!pieces) {
    return <></>;
  }
  return (
    <>
      <Grid
        offsetPerc={offsetPerc}
        nLines={nLines}
        gridSize={gridSize}
        height={height}
        width={width}
      />
      {pieces.map((piece, ii) => {
        const isActive = activePiece === ii;
        const { x: cx, y: cy } = piece.center;
        return (
          <Circle
            cx={cx}
            cy={cy}
            r={(gridSize - padding) / 2}
            color={isActive ? "white" : "green"}
          />
        );
      })}
    </>
  );
}
