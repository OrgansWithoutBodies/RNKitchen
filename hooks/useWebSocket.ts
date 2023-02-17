export const SocketStarter = {
  type: "subscribe",
  id: 1,
  model: "BarcodeServer.Barcode",
  action: "retrieve",
  lookup_by: 1,
} as const;

export function useWebSocket(onMessage, onClose, onError): WebSocket {
  var socket = new WebSocket(
    "ws://" + "192.168.88.242:8000" + "/ws/subscribe/"
  );
  socket.onmessage = (val) => onMessage(val);
  socket.onclose = (val) => onClose(val);
  socket.onerror = (val) => onError(val);
  socket.onopen = () => {
    socket.send(JSON.stringify(SocketStarter));
  };
  return socket;
}
