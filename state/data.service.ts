import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ToastAndroid } from "react-native";
import {
  dataStore,
  DataStore,
  DateString,
  HTTPUrl,
  LocationId,
  MealPlan,
  ProductId,
  StorageLocation,
} from "./data.store";
import {
  NaiveExistingProductDetails,
  GrocyProduct,
  GrocyStockPaths,
  IOServerPaths,
  RecipeBuddyAPIPaths,
  RecipeBuddyRecipe,
  IOServerPrintBarcodeRequestStructure,
  IOServerPrintShoppingListRequestStructure,
  OpenApiPostRequest,
  Meal,
  RecipeID,
  MealSlot,
  mealColors,
} from "../structs/types";
import * as ss from "superstruct";
import { ArrayRecipeBuddyRecipeValidator } from "../structs/validators/validators";
import { BoardPiece } from "../screens/locations/GridBoard";
export class DataService {
  constructor(private dataStore: DataStore) {}

  public addToExistingProducts(
    itemName: string,
    itemDetails: NaiveExistingProductDetails
  ) {
    this.dataStore.update((store) => {
      return {
        ...store,
        existingProducts: {
          ...store.existingProducts,
          [itemName]: itemDetails,
        },
      };
    });
  }
  public addStock(product: ProductId, location: LocationId, amount: number) {
    this.dataStore.update((store) => {
      return {
        ...store,
        stockEntries: [
          ...store.stockEntries,
          { product_id: product, location_id: location, amount },
        ],
      };
    });
  }

  public addToShoppingList(item: string | undefined) {
    this.dataStore.update((store) => {
      return { ...store, shoppingList: [...store.shoppingList, item] };
    });
  }

  public editShoppingListItem(ii: number, item: string | undefined) {
    this.dataStore.update((store) => {
      const mutableShoppingList = store.shoppingList;

      return {
        ...store,
        shoppingList: [
          ...mutableShoppingList.slice(0, ii),
          item || undefined,
          ...mutableShoppingList.slice(ii + 1),
        ],
      };
    });
  }

  public removeFromShoppingList(ii: number) {
    this.dataStore.update((store) => {
      const mutableShoppingList = store.shoppingList;

      return {
        ...store,
        shoppingList: [
          ...mutableShoppingList.slice(0, ii),
          ...mutableShoppingList.slice(ii + 1),
        ],
      };
    });
  }

  public setRecipeBuddyAccessToken(token: string) {
    this.dataStore.update((store) => {
      return { ...store, recipeBuddyAccessToken: token };
    });
  }
  public setRecipes(recipes: RecipeBuddyRecipe[]) {
    this.dataStore.update((store) => {
      return { ...store, recipes };
    });
  }

  //   TODO be able to handle interchangeable backends
  public async getData<
    TExpected = any,
    TPath = string,
    TData extends AxiosRequestConfig = any
  >(
    rootUrl: HTTPUrl,
    path: TPath,
    data: TData
  ): Promise<AxiosResponse<TExpected, any>> {
    const test = await axios
      .get(rootUrl + path, data)
      .catch(() => ToastAndroid.show("Bad Request!", ToastAndroid.SHORT));
    return test;
  }
  // TODO - should we differentiate between Locations & Containers?
  public addLocation(parentLocation?: LocationId) {
    const { locations } = this.dataStore.getValue();
    // TODO make sure all have ids w validator
    const locationIds = locations
      .filter((location) => location.id !== undefined)
      .map((location) => location.id) as number[];
    const maxId = Math.max(...locationIds);
    this.dataStore.update((state) => {
      const newLocation: StorageLocation = {
        id: maxId + 1,
        parentLocationId: parentLocation,
      };
      return { ...state, locations: [...state.locations, newLocation] };
    });
  }

  public getRecipesFromTandoor() {}

  public async getRecipesFromRecipeBuddy() {
    const { recipeBuddyUrl, recipeBuddyAccessToken: accessToken } =
      this.dataStore.getValue();
    const relativePath: RecipeBuddyAPIPaths = "/api/recipes";
    const loginPath: RecipeBuddyAPIPaths = "/api/auth/login";
    try {
      if (!accessToken) {
        const { data } = await axios.post(recipeBuddyUrl + loginPath, {
          username: "v",
          password: "testpass",
        });

        this.setRecipeBuddyAccessToken(data.access_token);
      }
      const authHeader = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      if (recipeBuddyUrl) {
        try {
          const { data: receivedData } = await this.getData<
            RecipeBuddyRecipe[]
          >(recipeBuddyUrl, relativePath, authHeader);
          try {
            ss.assert(receivedData, ArrayRecipeBuddyRecipeValidator);
            const recipes: RecipeBuddyRecipe[] = receivedData;
            this.setRecipes(recipes);
          } catch (error) {
            ToastAndroid.show("Weird Recipe Structure!", ToastAndroid.BOTTOM);
          }
        } catch {
          ToastAndroid.show("Is Recipe Buddy Running?", ToastAndroid.BOTTOM);
        }
      } else {
        ToastAndroid.show("Recipe Buddy URL Not Set!", ToastAndroid.BOTTOM);
      }
    } catch {
      ToastAndroid.show(
        "Couldnt Authorize To Recipe Buddy",
        ToastAndroid.BOTTOM
      );
    }
  }
  //  IOServer
  //   TODO be able to handle interchangeable backends
  // TODO be able to specify based on OperationType
  public static async postOpenApiData<
    TOperation extends OpenApiPostRequest,
    // TODO TPath should contain TOperation within it
    TPath extends string
  >(rootUrl: HTTPUrl, path: TPath, data: TOperation["requestBody"]) {
    axios.post(rootUrl + path, data);
  }

  public async postData<TPath, TData>(
    rootUrl: HTTPUrl,
    path: TPath,
    data: TData
  ) {
    axios
      .post(rootUrl + path, data)
      .catch(() => ToastAndroid.show("Bad Request!", ToastAndroid.SHORT));
  }

  public sendShoppingListToThermalPrinter() {
    const { shoppingList, ioServerUrl } = this.dataStore.getValue();
    const relativePath: IOServerPaths = "/printShoppingList";
    // TODO openapi typing for data
    const data = {
      list: shoppingList.filter((val) => val !== undefined) as string[],
    };

    this.postData<
      IOServerPaths,
      IOServerPrintShoppingListRequestStructure["data"]
    >(ioServerUrl, relativePath, data);
  }
  public sendBarcodeToStickerPrinter(barcodes: string[]) {
    const { ioServerUrl } = this.dataStore.getValue();

    const relativePath: IOServerPaths = "/printBarcode";
    this.postData<IOServerPaths, IOServerPrintBarcodeRequestStructure["data"]>(
      ioServerUrl,
      relativePath,
      { barcodes }
    );
  }

  // GROCY
  public getProductsFromGrocy() {
    const relativePath: GrocyStockPaths = "/stock";
    const products: GrocyProduct[] = [];
  }

  public setPlannedMeals(mealPlan: MealPlan) {
    this.dataStore.update({ mealPlan });
  }

  public addBoardPiece(boardPiece: BoardPiece) {
    this.dataStore.update(({ boardPieces }) => ({
      boardPieces: [...boardPieces, boardPiece],
    }));
  }

  public removeBoardPiece(boardPieceIndex: number) {
    this.dataStore.update(({ boardPieces }) => {
      const mutableBoardPieces = [...boardPieces].filter(
        (_, ii) => ii !== boardPieceIndex
      );

      return {
        boardPieces: mutableBoardPieces,
      };
    });
  }

  // TODO maybe make boardpiece center the cell index?
  public moveBoardPiece(pieceIndex: number, center: BoardPiece["center"]) {
    this.dataStore.update(({ boardPieces }) => {
      const givenPiece = boardPieces[pieceIndex];
      const movedPiece = { ...givenPiece, center };
      const newBoardPieces = [...boardPieces];
      newBoardPieces[pieceIndex] = movedPiece;
      console.log("TEST123", pieceIndex, newBoardPieces);
      return {
        boardPieces: newBoardPieces,
      };
    });
  }

  public static convertRecipeToMeal(recipe: RecipeBuddyRecipe) {}

  // TODO what do if mealslot is already taken
  public addRecipeToPlan(
    date: DateString,
    recipeID: RecipeID,
    mealSlot: MealSlot
  ) {
    const { mealPlan: mealPlanImmutable } = this.dataStore.getValue();
    const mealPlan = { ...mealPlanImmutable };
    const meal: Meal = {
      color: mealColors[mealSlot],
      slot: mealSlot,
      recipeID,
    };
    if (Object.keys(mealPlan).includes(date)) {
      mealPlan[date].dots.push(meal);
    } else {
      mealPlan[date] = { dots: [meal] };
    }
    this.dataStore.update({ mealPlan });
  }
}
export const dataService = new DataService(dataStore);
