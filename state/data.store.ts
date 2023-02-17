import { Store, StoreConfig } from "@datorama/akita";
import {
  ExistingProductDetails,
  GrocyLocation,
  GrocyQuantityUnit,
  RecipeBuddyRecipe,
} from "../structs/types";
export type HTTPUrl = `http://${string}` | `https://${string}`;
export type StorageLocation = GrocyLocation & { parentLocationId: string };
export interface DataState {
  token: string;
  name: string;
  ioServerUrl: HTTPUrl;
  recipeBuddyUrl?: HTTPUrl;
  recipeBuddyAccessToken?: string;
  grocyUrl?: HTTPUrl;
  grocyAPIKey?: string;
  tandoorUrl?: HTTPUrl;
  recipes: RecipeBuddyRecipe[];
  shoppingList: (string | undefined)[];
  existingProducts: Record<string, ExistingProductDetails>;
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
export const existingProducts: Record<string, ExistingProductDetails> = {};
export function createInitialState(): DataState {
  return {
    token: "",
    name: "",
    recipes: [],
    shoppingList: ["Marie Calendars Pot Pies"],
    existingProducts,
    locations: [],
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
