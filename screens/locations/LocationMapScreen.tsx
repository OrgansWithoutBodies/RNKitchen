import { Skia, BlendMode, Canvas, Circle } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { Dimensions, Pressable, StyleSheet, View, Text } from "react-native";

import { buildTouchHandler } from "./useBoard";

import { dataService } from "../../state/data.service";
import { useData } from "../../state/useAkita";
import { GrocyProduct, HexStr } from "../../structs/types";

import {
  GridBoard,
  GridBoardPieceProps,
  GridBoardStyleProps,
  TileTemplate,
  TileTemplateProps,
} from "./GridBoard";
import { ActiveItem, MoveWouldConflictHandler } from "./types";
import {
  LocationId,
  ProductList,
  StorageLocation,
} from "../../state/data.store";

const paint = Skia.Paint();
paint.setAntiAlias(true);
paint.setBlendMode(BlendMode.Multiply);

// TODO hookify
// pass board state to invoked area - maybe context handler?
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
  disabled = false,
}: ControllerButtonType): JSX.Element {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={{
        ...styles.buttonStyle,
        backgroundColor: disabled ? "grey" : backgroundColor,
      }}
    >
      <Text>{label}</Text>
    </Pressable>
  );
}

const getDefaultTile: (rad: number, props: TileTemplateProps) => JSX.Element = (
  rad,
  { cx, cy, resolvedColor }
) => {
  return <Circle cx={cx} cy={cy} r={rad} color={resolvedColor} />;
};

export function WholeScreenMap({
  activePiece,
  setActivePiece,
  boardPieces,
  gridSize,
  // TODO be able to pass custom handler & prioritize that over this flag
  allowConflicts = false,
}: { allowConflicts?: boolean } & ActiveItem &
  GridBoardPieceProps &
  Pick<GridBoardStyleProps, "gridSize">) {
  const onMoveWouldConflict: MoveWouldConflictHandler = allowConflicts
    ? ({ completeMove }) => {
        completeMove();
      }
    : ({}) => {};
  const { width, height } = Dimensions.get("window");
  const nLines = {
    x: Math.ceil(width / gridSize),
    y: Math.ceil(height / gridSize),
  };

  const percRadiusPadding = 0.2;
  const templateRadius = (gridSize * (1 - percRadiusPadding)) / 2;

  const Tile: TileTemplate = (props) => getDefaultTile(templateRadius, props);
  const touchHandler = buildTouchHandler(
    boardPieces,
    gridSize,
    activePiece,
    onMoveWouldConflict,
    setActivePiece
  );
  return (
    // TODO xstate machine for turning touch sequences into events
    // TODO debounce events?
    // TODO store layout
    // TODO moveable/zoomable viewport
    <Canvas style={{ flex: 1 }} onTouch={touchHandler}>
      <GridBoard
        activePiece={activePiece}
        boardPieces={boardPieces}
        offsetPerc={0.5}
        nLines={nLines}
        gridSize={gridSize}
        height={height}
        width={width}
        Tile={Tile}
      />
    </Canvas>
  );
}
function ActiveDetails({
  activePiece,
  boardPieces,
}: {} & ActiveItem & GridBoardPieceProps): JSX.Element {
  const activeGuard = (activePiece: number | null): activePiece is number => {
    return activePiece !== null;
  };
  const isActive = activeGuard(activePiece);
  const activeObj = isActive ? boardPieces[activePiece] : null;

  const label = isActive ? boardPieces[activePiece].label : null;
  const labelBlurb = isActive && label ? `| ${label}` : "";

  const newLocal = activePiece && `Active Object: ${activePiece} ${labelBlurb}`;
  return (
    <View>
      <Text style={{ color: "white" }}>{newLocal}</Text>
    </View>
  );
}

function ActiveLocation({
  activePiece,

  location,
  placedProducts,
  products,
}: {
  location: StorageLocation;
  placedProducts: ProductList | null;
  products: GrocyProduct[];
} & ActiveItem &
  GridBoardPieceProps): JSX.Element {
  const activeGuard = (activePiece: number | null): activePiece is number => {
    return activePiece !== null;
  };
  const isActive = activeGuard(activePiece);

  return (
    <View>
      <>
        <Text style={{ color: "white" }}>{location.name}</Text>
        <Text style={{ color: "white" }}>{location.description}</Text>
        {placedProducts &&
          placedProducts.map((product) => {
            return (
              <Text style={{ color: "white" }}>
                {products[product.productId].name}
              </Text>
            );
          })}
      </>
    </View>
  );
}

type ControllerButtonType = {
  onPress: () => void;
  backgroundColor: string;
  label: string;
  disabled?: boolean;
};
export function Controller({
  activePiece,
  setActivePiece,
  boardPieces,
  buttons,
}: GridBoardPieceProps & ActiveItem & { buttons: ControllerButtonType[] }) {
  return (
    <View>
      <View style={styles.controller}>
        {buttons.map((button) => {
          return <ControllerButton {...button} />;
        })}
      </View>
    </View>
  );
}
// each location has a schema of a boardstate with pantry entries
// export const DemoDraggableScreen = () => {
export const TestingMapScreen = () => {
  // for each storageLocation in room - for each (top-level) location, add a (object) with a dot which shows products in that location on tap
  const [{ boardPieces }] = useData(["boardPieces"]);
  const pixPerStep = 50;

  const [activePiece, setActivePiece] =
    useState<ActiveItem["activePiece"]>(null);
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
    if (activePiece) {
      dataService.removeBoardPiece(activePiece);
    }

    setActivePiece(null);
  };
  const deselectActive = () => setActivePiece(null);
  const addLabelToPiece = () =>
    dataService.addLabelToPiece(activePiece!, "TEST");
  return (
    // TODO why does making this into a view break the canvas
    <>
      <Controller
        activePiece={activePiece}
        setActivePiece={setActivePiece}
        boardPieces={boardPieces}
        buttons={[
          {
            disabled: activePiece === null,
            onPress: () => deselectActive(),
            backgroundColor: "yellow",
            label: "~",
          },
          {
            disabled: activePiece === null,
            // todo typeguard for this active piece
            onPress: () => addLabelToPiece(),
            backgroundColor: "blue",
            label: "?",
          },
          {
            onPress: () => addPiece(),
            backgroundColor: "green",
            label: "+",
          },
          {
            onPress: () => removeActivePiece(),
            backgroundColor: "red",
            label: "-",
          },
        ]}
      />
      <WholeScreenMap
        activePiece={activePiece}
        setActivePiece={setActivePiece}
        boardPieces={boardPieces}
        gridSize={pixPerStep}
      />
    </>
  );
};
export const RoomMapScreen = () => {
  // for each storageLocation in room - for each (top-level) location, add a (object) with a dot which shows products in that location on tap
  const [{ locations, productsInLocations, products }] = useData([
    "locations",
    "productsInLocations",
    "products",
  ]);
  const pixPerStep = 50;

  const [activeId, setActiveId] = useState<LocationId | null>(null);
  const setActiveHandler = (activePiece: ActiveItem["activePiece"]) => {
    return setActiveId(locations[activePiece!].id);
  };

  const removeActivePiece = () => {
    if (activeId) {
      dataService.removeLocation(activeId);
    }
    setActiveId(null);
  };
  const deselectActive = () => setActiveId(null);
  const boardPieces = locations.map(({ piece }) => piece);
  return (
    // TODO why does making this into a view break the canvas
    <>
      {activeId !== null ? (
        <ActiveLocation
          activePiece={activeId}
          setActivePiece={setActiveHandler}
          boardPieces={boardPieces}
          location={locations[activeId]}
          products={products}
          placedProducts={productsInLocations[activeId] || null}
        />
      ) : (
        <></>
      )}
      <Controller
        activePiece={activeId}
        setActivePiece={setActiveId}
        boardPieces={boardPieces}
        buttons={[
          {
            disabled: activeId === null,
            onPress: () => deselectActive(),
            backgroundColor: "yellow",
            label: "~",
          },
          {
            onPress: () => removeActivePiece(),
            backgroundColor: "red",
            label: "-",
          },
        ]}
      />
      <WholeScreenMap
        activePiece={activeId}
        setActivePiece={setActiveId}
        boardPieces={boardPieces}
        gridSize={pixPerStep}
      />
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
