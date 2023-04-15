import { Store, StoreConfig } from "@datorama/akita";
import { BoardPiece } from "../screens/locations/types";
import {
  NaiveExistingProductDetails,
  GrocyLocation,
  GrocyQuantityUnit,
  GrocyStockEntry,
  RecipeBuddyRecipe,
  GrocyProduct,
  MealSet,
  BrandedString,
  BrandedNumber,
  OffsetVec2,
  ObjVec2,
  StorageLocation,
  HexStr,
} from "../structs/types";
import {
  BACKYARD,
  BACK_SHED,
  gridSize,
  KITCHEN,
  PARTS_BIN_YELLOW_1,
} from "./pieces";

// TODO more specific
export type DateString = BrandedString<"Date">;
export type MealPlan = Record<DateString, MealSet>;
// TODO assign these
export type LocationId = BrandedNumber<"Location Id">;
export type PersonId = BrandedNumber<"Person Id">;
export type HolidayId = BrandedString<"Holiday">;
type Holiday = {
  id: HolidayId;
  name: string;
  dates: DateString[];
  description: string;
};
export type Person = { id: PersonId; name: string };
export type ProductId = BrandedNumber<"Product Id">;
export type EntryId = BrandedNumber<"Entry Id">;
export type ProductList = { productId: ProductId; countAtLocation: number }[];
export type ProductsInLocation = Record<LocationId, ProductList>;
export type HTTPUrl = `http://${string}` | `https://${string}`;
// TODO maybe add LocationCode here & treat it as purely a local object?
// TODO "bay" - one shelf has (potentially) multiple bays
// cons - would have to persist location data here

export interface DataState {
  family: Person[];
  boardPieces: BoardPiece[];
  token: string | null;
  name: string | null;
  ioServerUrl: HTTPUrl;
  recipeBuddyUrl?: HTTPUrl;
  stockEntries: GrocyStockEntry[];
  recipeBuddyAccessToken?: string;
  grocyUrl?: HTTPUrl;
  grocyAPIKey?: string;
  tandoorUrl?: HTTPUrl;
  recipes: RecipeBuddyRecipe[];
  shoppingList: (string | undefined)[];
  mealPlan: MealPlan;
  // TODO change this type
  existingProducts: Record<string, NaiveExistingProductDetails>;
  products: GrocyProduct[];
  locations: StorageLocation[];
  // TODO
  rooms: StorageLocation[];
  storageBays: StorageLocation[];
  quantityUnits: GrocyQuantityUnit[];
  // TODO link to cookbook?
  books: Book[];
}
// TODO move these to barcodes
export const LocCodePrefix = "LOC!" as const;
export const LocContainerCodePrefix = "LCON!" as const;
type LocContainers = [
  "LCAB",
  "BCAB1",
  "BCAB2",
  "BCAB3",
  "BCAB4",
  "BCAB5",
  "RCAB"
];
type Book = {
  isbn: string;

  title: string;
};
type LocRows = ["01", "02", "03", "04"];
export type LocCode<
  Container extends LocContainers[number],
  Row extends LocRows[number]
> = `${typeof LocCodePrefix}${Container}${Row}`;
export type LocContainerCode<
  Container extends LocContainers[number],
  Row extends LocRows[number]
> = `${typeof LocContainerCodePrefix}${Container}${Row}`;
const test: LocCode<any, any> = "LOC!LCAB01";
const LocationCodes: Record<LocContainerCode<any, any>, LocCode<any, any>[]> = {
  "LCON!LCABCONT": ["LOC!LCAB001", "LOC!LCAB002", "LOC!LCAB003", "LOC!LCAB004"],
  "LCON!BCAB1CONT": ["LOC!BCAB1001", "LOC!BCAB1002"],
  "LCON!BCAB2CONT": ["LOC!BCAB2001", "LOC!BCAB2002"],
  "LCON!BCAB3CONT": ["LOC!BCAB3001", "LOC!BCAB3002"],
  "LCON!BCAB4CONT": ["LOC!BCAB4001", "LOC!BCAB4002"],
  "LCON!BCAB5CONT": ["LOC!BCAB5001", "LOC!BCAB5002"],
  "LCON!RCABCONT": ["LOC!RCAB001", "LOC!RCAB002", "LOC!RCAB003"],
  "LCON!KFRIDGE": ["LOC!KFRID001", "LOC!KFRID002", "LOC!KFRID003"],
};
const rect = (size: ObjVec2) => {
  // size to array of offsets
};
const defaultPiece: BoardPiece = {
  center: { x: gridSize * 5, y: gridSize * 7 },
  shape: [{ x: 0, y: 0 }],
};
// TODO parenthetical specification - ie "1 (16 ounce) package"
// TODO hijack tandoor's ingredient parser
export function createInitialState(): DataState {
  return {
    boardPieces: [],
    token: null,
    name: null,
    existingProducts: {},
    products: [
      { id: 0, name: "egg", description: "test213" },
      { id: 1, name: "milk", description: "test213" },
      { id: 2, name: "sugar", description: "test213" },
    ],
    stockEntries: [
      { product_id: 1, location_id: 0, amount: 3, id: 0 },
      { product_id: 0, location_id: 0, amount: 3, id: 4 },
      { product_id: 2, location_id: 0, amount: 2, id: 1 },
      { product_id: 0, location_id: 3, amount: 4, id: 2 },
      { product_id: 2, location_id: 1, amount: 5, id: 3 },
    ],
    recipes: [],
    shoppingList: ["Marie Calendars Pot Pies"],
    locations: PARTS_BIN_YELLOW_1,
    quantityUnits: [],
    ioServerUrl: "http://192.168.88.242:8000",
    recipeBuddyUrl: "http://192.168.88.242:4000",
    mealPlan: {},
    family: [
      { id: "0", name: "test user" },
      { id: "1", name: "test mom" },
      { id: "2", name: "test dad" },
    ],
    books: [],
  };
}

@StoreConfig({ name: "data" })
export class DataStore extends Store<DataState> {
  constructor() {
    super(createInitialState());
  }
}

export const dataStore = new DataStore();
