import {
  BoardVec2,
  ObjVec2,
  OffsetVec2,
  StorageLocation,
} from "../structs/types";
import { LocationId } from "./data.store";
// TODO account for nested - 'numshelves'?
// TODO doors to lead to other areas
// TODO can assign tasks to objects/containers incl said object
// TODO 2d iterator
// TODO book list via ISBN list
export const gridSize = 50;
const array = (dims: ObjVec2, shiftOrigin = { x: 0, y: 0 }): OffsetVec2[] => {
  const entries: OffsetVec2[] = [];
  for (const xx of new Array(dims.x).fill(0).keys()) {
    for (const yy of new Array(dims.y).fill(0).keys()) {
      entries.push({ x: xx + shiftOrigin.x, y: yy + shiftOrigin.y });
    }
  }
  return entries;
};
const pieceArray = (
  arrangementArray: ObjVec2,
  individualShape: ObjVec2 = { x: 1, y: 1 }
): OffsetVec2[][] => {
  const entries: OffsetVec2[][] = [];
  for (const xx of new Array(arrangementArray.x).fill(0).keys()) {
    for (const yy of new Array(arrangementArray.y).fill(0).keys()) {
      entries.push(array(individualShape, { x: xx, y: yy }));
    }
  }
  console.log("TEST123", entries);
  return entries;
};
const square = array({ x: 2, y: 2 });

export const KITCHEN: StorageLocation[] = [
  {
    id: 0,
    name: "Fridge",
    description: "test1234512312312",
    piece: {
      color: "gray",
      center: { x: gridSize * 9, y: gridSize * 7 },
      shape: square,
    },
  },
  {
    id: 1,
    name: "Cabinet",
    description: "test1234512312312",
    piece: {
      color: "#9c6300",
      center: { x: gridSize * 9, y: gridSize * 4 },
      shape: square,
    },
  },
  {
    id: 2,
    name: "Other Cabinet",
    description: "test1234512312312",

    piece: {
      color: "#9c6300",
      center: { x: gridSize * 3, y: gridSize * 4 },
      shape: square,
    },
  },
  {
    id: 3,
    name: "Shelves",
    description: "test1234512312312",
    piece: {
      color: "#9c6300",
      center: { x: gridSize * 5, y: gridSize * 4 },
      shape: array({ x: 4, y: 1 }),
    },
  },
  {
    id: 4,
    name: "Cutting Board",
    description: "test1234512312312",
    piece: {
      color: "#9c6300",
      center: { x: gridSize * 6, y: gridSize * 7 },
      shape: square,
    },
  },
  {
    id: 5,
    name: "Counter",
    description: "test1234512312312",
    piece: {
      color: "#9c6300",
      center: { x: gridSize * 3, y: gridSize * 7 },
      shape: array({ x: 2, y: 4 }),
    },
  },
  {
    id: 6,
    name: "Sink",
    description: "test1234512312312",
    piece: {
      color: "Blue",
      center: { x: gridSize * 6, y: gridSize * 10 },
      shape: array({ x: 2, y: 1 }),
    },
  },
];
const garageWidth = 10;
export const GARAGE: StorageLocation[] = [
  {
    id: 0,
    name: "Freezer",
    description: "test1234512312312",
    piece: {
      color: "gray",
      center: { x: gridSize * 6, y: gridSize * 1 },
      shape: array({ x: 1, y: 1 }),
    },
  },
  {
    id: 1,
    name: "SideDoor",
    description: "test1234512312312",
    piece: {
      color: "gray",
      center: { x: gridSize * (garageWidth + 1), y: gridSize * 2 },
      shape: array({ x: 1, y: 1 }),
    },
  },
  {
    id: 2,
    name: "InnerDoor",
    description: "test1234512312312",
    piece: {
      color: "gray",
      center: { x: gridSize * 2, y: gridSize * 1 },
      shape: array({ x: 1, y: 1 }),
    },
  },
  {
    id: 3,
    name: "GarageDoor",
    description: "test1234512312312",
    piece: {
      color: "gray",
      center: { x: gridSize * 1, y: gridSize * 10 },
      shape: array({ x: garageWidth, y: 1 }),
    },
  },

  {
    id: 4,
    name: "ToolChest",
    description: "test1234512312312",
    piece: {
      color: "red",
      center: { x: gridSize * 6, y: gridSize * 9 },
      shape: array({ x: 2, y: 1 }),
    },
  },
  {
    id: 5,
    name: "Shelf",
    description: "test1234512312312",
    piece: {
      color: "gray",
      center: { x: gridSize * 6, y: gridSize * 7 },
      shape: array({ x: 1, y: 2 }),
    },
  },
  {
    id: 6,
    name: "Shelf",
    description: "test1234512312312",
    piece: {
      color: "gray",
      center: { x: gridSize * 6, y: gridSize * 5 },
      shape: array({ x: 1, y: 2 }),
    },
  },
  {
    id: 6,
    name: "Shelf",
    description: "test1234512312312",
    piece: {
      color: "gray",
      center: { x: gridSize * 4, y: gridSize * 7 },
      shape: array({ x: 1, y: 2 }),
    },
  },
  {
    id: 6,
    name: "Box Stack",
    description: "Stack of Boxes",
    piece: {
      color: "gray",
      center: { x: gridSize * 4, y: gridSize * 5 },
      shape: array({ x: 1, y: 2 }),
    },
  },
  {
    id: 5,
    name: "ToolWall",
    description: "test1234512312312",
    piece: {
      color: "maroon",
      center: { x: gridSize * garageWidth, y: gridSize * 3 },
      shape: array({ x: 1, y: 2 }),
    },
  },
  {
    id: 5,
    name: "ToolPile",
    description: "test1234512312312",
    piece: {
      color: "maroon",
      center: { x: gridSize * garageWidth, y: gridSize * 9 },
      shape: array({ x: 1, y: 1 }),
    },
  },
  {
    id: 7,
    name: "CleaningShelf",
    description: "test1234512312312",
    piece: {
      color: "cyan",
      center: { x: gridSize * 1, y: gridSize * 1 },
      shape: array({ x: 1, y: 2 }),
    },
  },
];
export const BACKYARD: StorageLocation[] = [
  {
    id: 0,
    name: "InsideDoor",
    description: "test1234512312312",
    piece: {
      color: "gray",
      center: { x: gridSize * 1, y: gridSize * 5 },
      shape: array({ x: 1, y: 2 }),
    },
  },
  {
    id: 0,
    name: "Plants",
    description: "Alcove by dining room table",
    piece: {
      color: "green",
      center: { x: gridSize * 1, y: gridSize * 3 },
      shape: array({ x: 1, y: 1 }),
    },
  },
  {
    id: 0,
    name: "Plants",
    description: "rhododendrons? on round thing under umbrella",
    piece: {
      color: "green",
      center: { x: gridSize * 6, y: gridSize * 3 },
      shape: array({ x: 1, y: 1 }),
    },
  },
  {
    id: 0,
    name: "Plants",
    description: "cactuses mostly",
    piece: {
      color: "green",
      center: { x: gridSize * 5, y: gridSize * 4 },
      shape: array({ x: 3, y: 1 }),
    },
  },
  {
    id: 0,
    name: "Plants",
    description: "RoseBed",
    piece: {
      color: "pink",
      center: { x: gridSize * 1, y: gridSize * 1 },
      shape: array({ x: 3, y: 1 }),
    },
  },
  {
    id: 0,
    name: "Plants",
    description: "RoseBed",
    piece: {
      color: "pink",
      center: { x: gridSize * 5, y: gridSize * 1 },
      shape: [
        ...array({ x: 3, y: 1 }),
        ...array({ x: 1, y: 4 }, { x: 3, y: 0 }),
      ],
    },
  },
  {
    id: 0,
    name: "Plants",
    description: "RoseBed",
    piece: {
      color: "pink",
      center: { x: gridSize * 8, y: gridSize * 6 },
      shape: array({ x: 1, y: 3 }),
    },
  },
  {
    id: 0,
    name: "Table",
    description: "Rectangular",
    piece: {
      color: "#DDDDDD",
      center: { x: gridSize * 6, y: gridSize * 6 },
      shape: array({ x: 1, y: 2 }),
    },
  },
];
export const BACK_SHED: StorageLocation[] = [
  {
    id: 0,
    name: "Door",
    description: "test1234512312312",
    piece: {
      color: "gray",
      center: { x: gridSize * 5, y: gridSize * 13 },
      shape: array({ x: 2, y: 1 }),
    },
  },
  {
    id: 0,
    name: "BathTub",
    description: "test1234512312312",
    piece: {
      color: "white",
      center: { x: gridSize * 10, y: gridSize * 7 },
      shape: array({ x: 2, y: 5 }),
    },
  },
  {
    id: 0,
    name: "Shelf",
    description: "test1234512312312",
    piece: {
      color: "#cf9911",
      center: { x: gridSize * 7, y: gridSize * 2 },
      shape: array({ x: 2, y: 2 }),
    },
  },
  {
    id: 0,
    name: "CatBoxStack",
    description: "test1234512312312",
    piece: {
      color: "yellow",
      center: { x: gridSize * 7, y: gridSize * 5 },
      shape: array({ x: 1, y: 1 }),
    },
  },
  {
    id: 0,
    name: "CatBoxStack",
    description: "test1234512312312",
    piece: {
      color: "yellow",
      center: { x: gridSize * 8, y: gridSize * 5 },
      shape: array({ x: 1, y: 1 }),
    },
  },
  {
    id: 0,
    name: "CatBoxStack",
    description: "test1234512312312",
    piece: {
      color: "yellow",
      center: { x: gridSize * 8, y: gridSize * 6 },
      shape: array({ x: 1, y: 1 }),
    },
  },
  {
    id: 0,
    name: "CatBoxStack",
    description: "test1234512312312",
    piece: {
      color: "yellow",
      center: { x: gridSize * 7, y: gridSize * 6 },
      shape: array({ x: 1, y: 1 }),
    },
  },
  {
    id: 0,
    name: "BigStackedShelves",
    description: "test1234512312312",
    piece: {
      color: "#555555",
      center: { x: gridSize * 7, y: gridSize * 8 },
      shape: array({ x: 2, y: 4 }),
    },
  },
];
// {y:5,x:6}x{y:3,x:3}(big)
export const PARTS_BIN_YELLOW_1: StorageLocation[] = pieceArray({
  x: 8,
  y: 8,
}).map((piece, ii) => {
  return {
    id: ii as LocationId,
    name: `TEST${ii}`,
    description: "TEST",
    piece: {
      color: "#FF0000",
      shape: piece.map((val) => ({ x: val.x + 1, y: val.y + 1 })),
      center: { x: 0 * gridSize, y: 0 * gridSize } as BoardVec2,
    },
  };
});
