import { Query } from "@datorama/akita";
import { webSocket } from "rxjs/webSocket";
import { map, filter, combineLatest, Observable } from "rxjs";
import {
  DataState,
  dataStore,
  DataStore,
  LocationId,
  LocCode,
  LocCodePrefix,
  LocContainerCode,
  LocContainerCodePrefix,
  ProductId,
  ProductsInLocation,
  StorageLocation,
} from "./data.store";
import { SocketStarter, WebSocketMessage } from "../hooks/useWebSocket";
// TODO start splitting this up

const CodePrefix = {
  Location: LocCodePrefix,
  LocationContainer: LocContainerCodePrefix,
} as const;

export class DataQuery extends Query<DataState> {
  public shoppingList = this.select("shoppingList");
  public boardPieces = this.select("boardPieces");

  public existingProducts = this.select("existingProducts");
  public recipes = this.select("recipes");
  public locations = this.select("locations");
  public stockEntries = this.select("stockEntries");
  public products = this.select("products");
  public mealPlan = this.select("mealPlan");

  public barcodeWebSocket = webSocket<WebSocketMessage>({
    // TODO derive this from this.select('ioServerUrl') - will need to close & reopen if this ever changes
    url: "ws://" + "192.168.88.242:8000" + "/ws/subscribe/",
    WebSocketCtor: WebSocket,
  });
  public scannedBarcode = this.barcodeWebSocket.pipe(
    map((value) => {
      if (value["instance"]) {
        const parsedCode = value["instance"]["code"];

        return parsedCode;
      }
      return null;
    }),
    filter((code) => code !== null)
  );
  public scannedLocationCode = this.scannedBarcode.pipe(
    filter((code) => {
      return code!.startsWith(LocCodePrefix);
    })
  );
  public scannedLocationContainerCode = this.scannedBarcode.pipe(
    filter((code) => {
      return code!.startsWith(LocContainerCodePrefix);
    })
  );
  public scannedLocation: Observable<StorageLocation | undefined> =
    combineLatest([
      this.locations,
      this.scannedLocationCode,
      this.scannedLocationContainerCode,
    ]).pipe(
      map(([locations, locationCode, locationContainerCode]) => {
        console.log(locations, locationCode, locationContainerCode);
        // TODO Grocy LocationCode UserField?
        return locations.find((loc) => loc.id === locationCode);
      })
    );
  public lastEmittedCodeType = this.scannedBarcode;

  public productsInLocations = combineLatest([
    this.locations,
    this.stockEntries,
    this.products,
  ]).pipe(
    // TODO this is just a join, sure theres a better pattern
    map(([locations, stockEntries, products]) => {
      const entriesMap: ProductsInLocation = {};
      stockEntries.forEach((entry) => {
        if (!entriesMap[entry.location_id as LocationId]) {
          entriesMap[entry.location_id as LocationId] = [
            {
              productId: entry.product_id as ProductId,
              countAtLocation: entry.amount!,
            },
          ];
        } else {
          entriesMap[entry.location_id as LocationId].push({
            productId: entry.product_id as ProductId,
            countAtLocation: entry.amount!,
          });
        }
      });
      return entriesMap;
    })
  );
  constructor(protected store: DataStore) {
    super(store);
  }
}
export const dataQuery = new DataQuery(dataStore);
