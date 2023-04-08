"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.dataQuery = exports.DataQuery = void 0;
var akita_1 = require("@datorama/akita");
var webSocket_1 = require("rxjs/webSocket");
var rxjs_1 = require("rxjs");
var data_store_1 = require("./data.store");
// TODO start splitting this up
var CodePrefix = {
    Location: data_store_1.LocCodePrefix,
    LocationContainer: data_store_1.LocContainerCodePrefix
};
var DataQuery = /** @class */ (function (_super) {
    __extends(DataQuery, _super);
    function DataQuery(store) {
        var _this = _super.call(this, store) || this;
        _this.store = store;
        _this.shoppingList = _this.select("shoppingList");
        _this.existingProducts = _this.select("existingProducts");
        _this.recipes = _this.select("recipes");
        _this.locations = _this.select("locations");
        _this.stockEntries = _this.select("stockEntries");
        _this.products = _this.select("products");
        _this.mealPlan = _this.select("mealPlan");
        _this.barcodeWebSocket = (0, webSocket_1.webSocket)({
            // TODO derive this from this.select('ioServerUrl') - will need to close & reopen if this ever changes
            url: "ws://" + "192.168.88.242:8000" + "/ws/subscribe/",
            WebSocketCtor: WebSocket
        });
        _this.scannedBarcode = _this.barcodeWebSocket.pipe((0, rxjs_1.map)(function (value) {
            if (value["instance"]) {
                var parsedCode = value["instance"]["code"];
                return parsedCode;
            }
            return null;
        }), (0, rxjs_1.filter)(function (code) { return code !== null; }));
        _this.scannedLocationCode = _this.scannedBarcode.pipe((0, rxjs_1.filter)(function (code) {
            return code.startsWith(data_store_1.LocCodePrefix);
        }));
        _this.scannedLocationContainerCode = _this.scannedBarcode.pipe((0, rxjs_1.filter)(function (code) {
            return code.startsWith(data_store_1.LocContainerCodePrefix);
        }));
        _this.scannedLocation = (0, rxjs_1.combineLatest)([
            _this.locations,
            _this.scannedLocationCode,
            _this.scannedLocationContainerCode,
        ]).pipe((0, rxjs_1.map)(function (_a) {
            var locations = _a[0], locationCode = _a[1], locationContainerCode = _a[2];
            console.log(locations, locationCode, locationContainerCode);
            // TODO Grocy LocationCode UserField?
            return locations.find(function (loc) { return loc.id === locationCode; });
        }));
        _this.lastEmittedCodeType = _this.scannedBarcode;
        _this.productsInLocations = (0, rxjs_1.combineLatest)([
            _this.locations,
            _this.stockEntries,
            _this.products,
        ]).pipe(
        // TODO this is just a join, sure theres a better pattern
        (0, rxjs_1.map)(function (_a) {
            var locations = _a[0], stockEntries = _a[1], products = _a[2];
            var entriesMap = {};
            stockEntries.forEach(function (entry) {
                if (!entriesMap[entry.location_id]) {
                    entriesMap[entry.location_id] = [
                        {
                            productId: entry.product_id,
                            countAtLocation: entry.amount
                        },
                    ];
                }
                else {
                    entriesMap[entry.location_id].push({
                        productId: entry.product_id,
                        countAtLocation: entry.amount
                    });
                }
            });
            return entriesMap;
        }));
        return _this;
    }
    return DataQuery;
}(akita_1.Query));
exports.DataQuery = DataQuery;
exports.dataQuery = new DataQuery(data_store_1.dataStore);
