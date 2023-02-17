import {
  components as GrocyAPIComponents,
  paths as GrocyAPIPaths,
} from "../schemas/out/schemas/src/grocy.openapi";
import {
  components as IOServerAPIComponents,
  paths as IOServerAPIPaths,
} from "../schemas/out/schemas/src/ioserver.openapi";
// import type { Recipe, FoodRecipe } from "../schemas/out/tandoor.api";

export interface RecipeBuddyRecipe {
  _id: string;
  url: string;
  name: string;
  imageUrl: string;
  ingredients: string[];
  steps: string[];
}
export type ShoppingListIncomplete = (string | undefined)[];
export type ShoppingList = string[];

export type MealDivision = "Lunch" | "Dinner";
export const mealColors: Record<MealDivision, string> = {
  Dinner: "red",
  Lunch: "green",
};
export type Meal = {
  dots: {
    recipeID: string;
    key: MealDivision;
    color: string;
  }[];
};
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

export type ExistingProductDetails = {
  inStockAmount: number;
  inStockUnit: (typeof Units)[number];
};

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
export type GrocyStockEntry = GrocyAPIComponentSchemas["StockEntry"];
export type GrocyShoppingListItem =
  GrocyAPIComponentSchemas["ShoppingListItem"];
export type GrocyStockJournal = GrocyAPIComponentSchemas["StockJournal"];
export type GrocyStockJournalSummary =
  GrocyAPIComponentSchemas["StockJournalSummary"];
export type GrocyCurrentStockResponse =
  GrocyAPIComponentSchemas["CurrentStockResponse"];

// IOServer
export type IOServerPaths = keyof IOServerAPIPaths;
export type IOServerPathsPrintShoppingList =
  IOServerAPIPaths["/printShoppingList"];
export type IOServerPathsPrintBarcode = IOServerAPIPaths["/printBarcode"];
export type IOServerPathsBarcode = IOServerAPIPaths["/barcode/"];
export type IOServerPrintBarcodeDataStructure = {
  list: string[];
};
// Tandoor
// TandoorTypes

// RecipeBuddy
export type RecipeBuddyAPIPaths = "/api/recipes" | "/api/auth/login";
