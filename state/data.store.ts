import { Store, StoreConfig } from "@datorama/akita";
import {
  NaiveExistingProductDetails,
  GrocyLocation,
  GrocyQuantityUnit,
  GrocyStockEntry,
  RecipeBuddyRecipe,
  GrocyProduct,
} from "../structs/types";
export type BrandedType<T = any, Brand extends string = string> = T & {
  __brand: Brand;
};
export type BrandedNumber<Brand extends string> = BrandedType<number, Brand>;
export type BrandedString<Brand extends string> = BrandedType<string, Brand>;

// TODO assign these
export type LocationId = BrandedNumber<"Location Id">;
export type ProductId = BrandedNumber<"Product Id">;
export type EntryId = BrandedNumber<"Entry Id">;
export type ProductsInLocation = Record<
  LocationId,
  { productId: ProductId; countAtLocation: number }[]
>;
export type HTTPUrl = `http://${string}` | `https://${string}`;
// TODO maybe add LocationCode here & treat it as purely a local object?
// cons - would have to persist location data here
export type StorageLocation = GrocyLocation & { parentLocationId?: LocationId };
export interface DataState {
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
  // TODO change this type
  existingProducts: Record<string, NaiveExistingProductDetails>;
  products: GrocyProduct[];
  locations: StorageLocation[];
  quantityUnits: GrocyQuantityUnit[];
}

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

// TODO parenthetical specification - ie "1 (16 ounce) package"
export function createInitialState(): DataState {
  return {
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
      { product_id: 2, location_id: 0, amount: 2, id: 0 },
      { product_id: 0, location_id: 3, amount: 4, id: 0 },
      { product_id: 2, location_id: 1, amount: 5, id: 0 },
    ],
    recipes: [],
    shoppingList: ["Marie Calendars Pot Pies"],
    locations: [
      { id: 0, name: "Fridge", description: "test1234512312312" },
      { id: 1, name: "Cabinet", description: "test1234512312312" },
      { id: 2, name: "Other Cabinet", description: "test1234512312312" },
      { id: 3, name: "Freezer", description: "test1234512312312" },
    ],
    quantityUnits: [],
    ioServerUrl: "http://192.168.88.242:8000",
    recipeBuddyUrl: "http://192.168.88.242:4000",
  };
}

@StoreConfig({ name: "data" })
export class DataStore extends Store<DataState> {
  constructor() {
    super(createInitialState());
  }
}

export const dataStore = new DataStore();
