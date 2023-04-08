"use strict";
exports.__esModule = true;
exports.useWebSocketStarter = exports.SocketStarter = void 0;
var react_1 = require("react");
exports.SocketStarter = {
    type: "subscribe",
    id: 1,
    model: "BarcodeServer.Barcode",
    action: "retrieve",
    lookup_by: 1
};
function useWebSocketStarter(observable) {
    (0, react_1.useEffect)(function () {
        observable.next(exports.SocketStarter);
        return function () { return observable.complete(); };
    }, []);
}
exports.useWebSocketStarter = useWebSocketStarter;
