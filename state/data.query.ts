import { Query } from "@datorama/akita";
import { webSocket } from "rxjs/webSocket";
import { map, filter, combineLatest, Observable } from "rxjs";
import {
  DataState,
  dataStore,
  DataStore,
  LocCode,
  LocCodePrefix,
  LocContainerCode,
  LocContainerCodePrefix,
  StorageLocation,
} from "./data.store";
import { SocketStarter } from "../hooks/useWebSocket";

export class DataQuery extends Query<DataState> {
  public shoppingList = this.select("shoppingList");
  public existingProducts = this.select("existingProducts");
  public recipes = this.select("recipes");
  public locations = this.select("locations");

  public barcodeWebSocket = webSocket<{
    action: string;
    id: number;
    instance?: { code: string };
    model: string;
    type: string;
  }>({
    // TODO derive this from this.select('ioServerUrl')
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

  public scannedLocation: Observable<StorageLocation> = combineLatest([
    this.locations,
    this.scannedLocationCode,
    this.scannedLocationContainerCode,
  ]).pipe(
    map(([locations, locationCode, locationContainerCode]) => {
      console.log(locations, locationCode, locationContainerCode);
      // TODO Grocy LocationCode UserField?
      locations.find((loc) => loc.id === locationCode);
    })
  );
  public lastEmittedCodeType = this.scannedBarcode;

  constructor(protected store: DataStore) {
    super(store);
  }
}
export const dataQuery = new DataQuery(dataStore);
