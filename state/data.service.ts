import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ToastAndroid } from "react-native";
import { dataStore, DataStore, HTTPUrl } from "./data.store";
import {
  ExistingProductDetails,
  GrocyProduct,
  GrocyStockPaths,
  IOServerPaths,
  IOServerPrintBarcodeDataStructure,
  RecipeBuddyAPIPaths,
  RecipeBuddyRecipe,
} from "../structs/types";
import * as ss from "superstruct";
import { ArrayRecipeBuddyRecipeValidator } from "../structs/validators";
export class DataService {
  constructor(private dataStore: DataStore) {}

  public addToExistingProducts(
    itemName: string,
    itemDetails: ExistingProductDetails
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
  public async sendData<TPath, TData>(
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
    const data: IOServerPrintBarcodeDataStructure = {
      list: shoppingList.filter((val) => val !== undefined) as string[],
    };

    this.sendData(ioServerUrl, relativePath, data);
  }
  public sendBarcodeToStickerPrinter(barcodes: string[]) {
    const { ioServerUrl } = this.dataStore.getValue();

    const relativePath: IOServerPaths = "/printBarcode";
    this.sendData(ioServerUrl, relativePath, barcodes);
  }

  // GROCY
  public getProductsFromGrocy() {
    const relativePath: GrocyStockPaths = "/stock";
    const products: GrocyProduct[] = [];
  }
}
export const dataService = new DataService(dataStore);
