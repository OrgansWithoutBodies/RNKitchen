import { useEffect } from "react";
import { WebSocketSubject } from "rxjs/webSocket";
export type WebSocketMessage = {
  action: string;
  id: number;
  instance?: { code: string };
  model: string;
  type: string;
  lookup_by?: number;
};
export const SocketStarter: WebSocketMessage = {
  type: "subscribe",
  id: 1,
  model: "BarcodeServer.Barcode",
  action: "retrieve",
  lookup_by: 1,
};

export function useWebSocketStarter(observable: WebSocketSubject<any>): void {
  useEffect(() => {
    observable.next(SocketStarter);

    return () => observable.complete();
  }, []);
}
