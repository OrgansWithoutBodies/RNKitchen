import { Group } from "@shopify/react-native-skia";
import React from "react";
import { BoardVec2, HexStr, ObjVec2 } from "../../structs/types";
import { Grid } from "./Grid";
import { BoardPiece } from "./types";
import { combineTwoVecs, positionOffsets } from "./vecs";

// const activeGuard=(piece):piece is active
const activeColor = "white";
const defaultColor = "green";
export type GridBoardPieceProps = {
  boardPieces: BoardPiece[];
  activePiece?: number | null;
};

export type GridBoardStyleProps = {
  nLines: ObjVec2;
  gridSize: number;
  height: number;
  width: number;
  offsetPerc?: number;
};
type CompassPoint = "N" | "E" | "S" | "W";

export type TileTemplateProps = {
  // neighboringTiles only cares about own shape for now
  neighboringTiles: Record<CompassPoint, boolean>;
  cx: number;
  cy: number;

  resolvedColor: HexStr;
};
export type TileTemplate = (props: TileTemplateProps) => JSX.Element;
const getNeighboringTiles = (
  elements: BoardVec2[],
  gridSize: number,
  elementIndex: number
) => {
  const element = elements[elementIndex];
  return {
    E: elements.includes(
      combineTwoVecs(element, {
        x: -1 * gridSize,
        y: 0,
      } as BoardVec2) as BoardVec2
    ),
    N: elements.includes(
      combineTwoVecs(element, {
        x: 0,
        y: 1 * gridSize,
      } as BoardVec2) as BoardVec2
    ),
    S: elements.includes(
      combineTwoVecs(element, {
        x: 0,
        y: -1 * gridSize,
      } as BoardVec2) as BoardVec2
    ),
    W: elements.includes(
      combineTwoVecs(element, {
        x: 1 * gridSize,
        y: 0,
      } as BoardVec2) as BoardVec2
    ),
  };
};
export function GridBoard({
  boardPieces,
  nLines,
  gridSize,
  height,
  width,
  Tile,
  activePiece,
  offsetPerc = 0,
}: GridBoardStyleProps &
  GridBoardPieceProps & {
    Tile: TileTemplate;
    // TODO handle
    // onPieceTouch/
    // onPieceDrag/
    // onPieceMove/
    // what to do when dragging piece into spot occupied by other pieces,
    // here's where logic for capture/prevent movement takes place
    // onDragConflicts/
    // etc
  }): JSX.Element {
  return (
    <Group>
      <Grid
        offsetPerc={offsetPerc}
        nLines={nLines}
        gridSize={gridSize}
        height={height}
        width={width}
      />
      {boardPieces.map((piece, ii) => {
        const isActive = activePiece === ii;
        const piecePassiveColor = piece.color || defaultColor;
        const elements = piece.shape
          ? piece.shape.map((offset) =>
              positionOffsets(offset, piece.center, gridSize)
            )
          : [piece.center];
        return (
          <>
            {elements.map((element, ii) => {
              const { x: cx, y: cy } = element;
              return (
                <Tile
                  key={`tile-${ii}`}
                  neighboringTiles={getNeighboringTiles(elements, gridSize, ii)}
                  resolvedColor={
                    isActive ? (activeColor as any) : piecePassiveColor
                  }
                  cx={cx}
                  cy={cy}
                />
              );
            })}
          </>
        );
      })}
    </Group>
  );
}
