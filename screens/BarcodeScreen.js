"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_native_1 = require("react-native");
var Themed_1 = require("../components/Themed");
var react_2 = require("react");
var useWebSocket_1 = require("../hooks/useWebSocket");
var data_query_1 = require("../state/data.query");
var useAkita_1 = require("../state/useAkita");
// TODO lookup non-loc barcodes in that openfood thingamajig
function BarcodeScreen() {
    // Start subscription to websocket
    var barcodeWebsocketObservable = data_query_1.dataQuery["barcodeWebSocket"];
    (0, useWebSocket_1.useWebSocketStarter)(barcodeWebsocketObservable);
    var barcodes = { "12345": "test", "23456": "test123" };
    var barcode = (0, useAkita_1.useData)(["scannedLocationCode"])[0].scannedLocationCode;
    var _a = (0, react_1.useState)(false), isRelocating = _a[0], setIsRelocating = _a[1];
    var _b = (0, react_1.useState)(null), relocateCode = _b[0], setRelocateCode = _b[1];
    var _c = (0, react_1.useState)(null), newBarcodeInfo = _c[0], setNewBarcodeInfo = _c[1];
    return (<Themed_1.View style={styles.container}>
      {newBarcodeInfo && <Themed_1.Text>{newBarcodeInfo}</Themed_1.Text>}

      {barcode &&
            (barcodes[barcode] ? (<>
            <Themed_1.Text>
              FOUND {barcode} - {barcodes[barcode]}
            </Themed_1.Text>
            <Themed_1.Button title="Consume"/>
            <Themed_1.Button title="Purchase"/>
            <Themed_1.Button title="Relocate" onPress={function () { return setIsRelocating(!isRelocating); }}/>
            <Themed_1.View>
              {isRelocating && (<Themed_1.Text>SCAN TARGET LOCATION CODE: {relocateCode}</Themed_1.Text>)}
            </Themed_1.View>
          </>) : (<>
            <Themed_1.Text>NOT FOUND {barcode} </Themed_1.Text>
            <react_native_1.TextInput editable maxLength={40} onChangeText={function (text) { return setNewBarcodeInfo(text); }} value={newBarcodeInfo} style={{ width: 100, height: 40, backgroundColor: "white" }}/>
          </>))}
    </Themed_1.View>);
}
exports["default"] = BarcodeScreen;
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    title: {
        fontSize: 20,
        fontWeight: "bold"
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%"
    }
});
