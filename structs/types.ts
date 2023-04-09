import {
  components as GrocyAPIComponents,
  paths as GrocyAPIPaths,
} from "../schemas/out/schemas/src/grocy.openapi";
import {
  components as IOServerAPIComponents,
  paths as IOServerAPIPaths,
} from "../schemas/out/schemas/src/ioserver.openapi";
import { ProductId } from "../state/data.store";
import { HttpStatusCode } from "./responseCodes";
// import type { Recipe, FoodRecipe } from "../schemas/out/tandoor.api";
export type BrandedType<T = any, Brand extends string = string> = T & {
  __brand: Brand;
};

export type BrandedNumber<Brand extends string> = BrandedType<number, Brand>;
export type BrandedString<Brand extends string> = BrandedType<string, Brand>;
export type RecipeID = BrandedString<"Recipe">;
export interface RecipeBuddyRecipe {
  _id: RecipeID;
  url: string;
  name: string;
  imageUrl: string;
  // TODO how to handle ingredients without an associated product?
  ingredients: ProductId[];
  steps: string[];
}
export type ShoppingListIncomplete = (string | undefined)[];
export type ShoppingList = string[];

export type ObjVec2<T = number> = { x: T; y: T };
export type ObjVec3<T = number> = { x: T; y: T; z: T };
export type ArrVec2<T = number> = [T, T];
export type ArrVec3<T = number> = [T, T, T];

export type RGBChannelNumber = BrandedNumber<"RGBChannel">;
export type RGBChannelString = BrandedString<"RGBChannel">;

export type HexStr = `#${string}`;
export type RGBNumTriple = ArrVec3<RGBChannelNumber>;
export type RGBNumStr = `${number}, ${number}, ${number}`;

type BoardSpaceCoord = BrandedNumber<"BoardSpace">;
type OffsetSpaceCoord = BrandedNumber<"OffsetSpace">;
type ScreenSpaceCoord = BrandedNumber<"ScreenSpace">;

export type BoardVec2 = ObjVec2<BoardSpaceCoord>;
// any vec + offset vec = any vec, but offset vec is not any vec itself
export type OffsetVec2 = ObjVec2<OffsetSpaceCoord>;
export type ScreenVec2 = ObjVec2<ScreenSpaceCoord>;

export type MealSlot = "Lunch" | "Dinner";
export const mealColors: Record<MealSlot, HexStr> = {
  Dinner: "#FF0000",
  Lunch: "#00FF00",
};
export type Meal = {
  // TODO potentially multiple recipes for meal
  recipeID: RecipeID;
  slot: MealSlot;
  color: HexStr;
};
export type MealSet = {
  dots: Meal[];
  selected?: true;
  // TODO 'was food finished' bool
  // TODO potentially multiple recipes per meal
};
// TODO meal per-person
// TODO GenericUnit vs ConcreteUnit? Generic<Product>=Concrete -
export const Units = [
  "tablespoon",
  "teaspoon",
  "package",
  "cup",
  "pound",
  "pinch",
  "tsp",
  "tbsp",
  "clove",
  "ounce",
  "piece",
  "unit",
] as const;

export type NaiveExistingProductDetails = {
  inStockAmount: number;
  inStockUnit: (typeof Units)[number];
};
// TODO maybe just use this? https://github.com/kogosoftwarellc/open-api/blob/master/packages/openapi-types/index.ts
export interface OpenApiPostRequest {
  requestBody: {
    content: {
      "application/json": any;
      "application/x-www-form-urlencoded": any;
      "multipart/form-data": any;
    };
  };
  responses: {
    [code in HttpStatusCode]?: { content: { "application/json": any } };
  };
}
// export type OpenApiOperation
// GROCY
export type GrocyAPIComponentSchemas = GrocyAPIComponents["schemas"];

type UserEndpoint = `/user${string}`;
export type GrocyStockPaths = keyof GrocyAPIPaths;
export type GrocyStockPath = GrocyAPIPaths["/stock"];

export type GrocyProduct = GrocyAPIComponentSchemas["Product"];
export type GrocyQuantityUnit = GrocyAPIComponentSchemas["QuantityUnit"];
export type GrocyLocation = GrocyAPIComponentSchemas["Location"];
export type GrocyShoppingLocation =
  GrocyAPIComponentSchemas["ShoppingLocation"];
export type GrocyStockLocation = GrocyAPIComponentSchemas["StockLocation"];
// TODO whats the difference between StockLocation
export type GrocyTask = GrocyAPIComponentSchemas["Task"];
// TODO whats the difference between StockLocation & StockEntry
export type GrocyStockEntry = GrocyAPIComponentSchemas["StockEntry"];
export type GrocyShoppingListItem =
  GrocyAPIComponentSchemas["ShoppingListItem"];

export type GrocyStockJournal = GrocyAPIComponentSchemas["StockJournal"];
export type GrocyStockJournalSummary =
  GrocyAPIComponentSchemas["StockJournalSummary"];
export type GrocyCurrentStockResponse =
  GrocyAPIComponentSchemas["CurrentStockResponse"];

// IOServer
// TODO path for ws subscribe
// https://github.com/tfranzel/drf-spectacular/issues/667
// TODO generic "Print" enum/type?
// TODO npm method to download spec?
// export type IOServerPathsBarcode = IOServerAPIPaths["/barcode/"];
export type IOServerPaths = keyof IOServerAPIPaths;

export type IOServerPathsPrintShoppingList =
  IOServerAPIPaths["/printShoppingList"];
export type IOServerPathsPrintBarcode = IOServerAPIPaths["/printBarcode"];

export type IOServerPrintBarcodeRequestStructure =
  IOServerAPIComponents["schemas"]["BarcodePrintRequest"];
export type IOServerPrintShoppingListRequestStructure =
  IOServerAPIComponents["schemas"]["ShoppingListRequest"];

// TODO do something to verify these implement OpenApiPostRequest interface
export type IOServerPrintShoppingListPost =
  IOServerPathsPrintShoppingList["post"];
export type IOServerPrintBarcodeListPost = IOServerPathsPrintBarcode["post"];

// Tandoor
// TandoorTypes

// RecipeBuddy
// TODO PR for openapi generator
export type RecipeBuddyAPIPaths = "/api/recipes" | "/api/auth/login";
