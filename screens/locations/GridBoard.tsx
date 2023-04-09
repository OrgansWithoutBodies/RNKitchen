import { Circle, Line } from "@shopify/react-native-skia";
import React from "react";
import { BoardVec2, HexStr, ObjVec2, OffsetVec2 } from "../../structs/types";
import { Grid } from "./Grid";
//   TODO handle different piece shapes
export type BoardPiece = {
  center: BoardVec2;
  shape?: OffsetVec2[];
  color?: HexStr;
  label?: string;
};
export const combineTwoVecs = (vecA: ObjVec2, vecB: ObjVec2) => {
  return { x: vecA.x + vecB.x, y: vecA.y + vecB.y };
};
export const multiplyScalar = (vecA: ObjVec2, scalar: number) => {
  return { x: vecA.x * scalar, y: vecA.y * scalar };
};
export const positionOffsets = (
  offset: OffsetVec2,
  center: BoardVec2,
  gridSize: number
): BoardVec2 => {
  return combineTwoVecs(multiplyScalar(offset, gridSize), center) as BoardVec2;
};
// const activeGuard=(piece):piece is active
const activeColor = "white";
const defaultColor = "green";
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
        const piecePassiveColor = piece.color || defaultColor;
        const elements = piece.shape
          ? piece.shape.map((offset) =>
              positionOffsets(offset, piece.center, gridSize)
            )
          : [piece.center];
        return (
          <>
            {elements.map((element) => {
              const { x: cx, y: cy } = element;
              return (
                <Circle
                  cx={cx}
                  cy={cy}
                  r={(gridSize - padding) / 2}
                  color={isActive ? activeColor : piecePassiveColor}
                />
              );
            })}
          </>
        );
      })}
    </>
  );
}
