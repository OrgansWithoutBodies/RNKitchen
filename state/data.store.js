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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.dataStore = exports.DataStore = exports.createInitialState = exports.LocContainerCodePrefix = exports.LocCodePrefix = void 0;
var akita_1 = require("@datorama/akita");
// TODO move these to barcodes
exports.LocCodePrefix = "LOC!";
exports.LocContainerCodePrefix = "LCON!";
var test = "LOC!LCAB01";
var LocationCodes = {
    "LCON!LCABCONT": ["LOC!LCAB001", "LOC!LCAB002", "LOC!LCAB003", "LOC!LCAB004"],
    "LCON!BCAB1CONT": ["LOC!BCAB1001", "LOC!BCAB1002"],
    "LCON!BCAB2CONT": ["LOC!BCAB2001", "LOC!BCAB2002"],
    "LCON!BCAB3CONT": ["LOC!BCAB3001", "LOC!BCAB3002"],
    "LCON!BCAB4CONT": ["LOC!BCAB4001", "LOC!BCAB4002"],
    "LCON!BCAB5CONT": ["LOC!BCAB5001", "LOC!BCAB5002"],
    "LCON!RCABCONT": ["LOC!RCAB001", "LOC!RCAB002", "LOC!RCAB003"],
    "LCON!KFRIDGE": ["LOC!KFRID001", "LOC!KFRID002", "LOC!KFRID003"]
};
// TODO parenthetical specification - ie "1 (16 ounce) package"
// TODO hijack tandoor's ingredient parser
function createInitialState() {
    return {
        token: null,
        name: null,
        existingProducts: {},
        products: [
            { id: 0, name: "egg", description: "test213" },
            { id: 1, name: "milk", description: "test213" },
            { id: 2, name: "sugar", description: "test213" },
        ],
        stockEntries: [
            { product_id: 1, location_id: 0, amount: 3, id: 0 },
            { product_id: 2, location_id: 0, amount: 2, id: 0 },
            { product_id: 0, location_id: 3, amount: 4, id: 0 },
            { product_id: 2, location_id: 1, amount: 5, id: 0 },
        ],
        recipes: [],
        shoppingList: ["Marie Calendars Pot Pies"],
        locations: [
            { id: 0, name: "Fridge", description: "test1234512312312" },
            { id: 1, name: "Cabinet", description: "test1234512312312" },
            { id: 2, name: "Other Cabinet", description: "test1234512312312" },
            { id: 3, name: "Freezer", description: "test1234512312312" },
        ],
        quantityUnits: [],
        ioServerUrl: "http://192.168.88.242:8000",
        recipeBuddyUrl: "http://192.168.88.242:4000",
        mealPlan: {},
        family: [
            { id: "0", name: "test user" },
            { id: "1", name: "test mom" },
            { id: "2", name: "test dad" },
        ]
    };
}
exports.createInitialState = createInitialState;
var DataStore = /** @class */ (function (_super) {
    __extends(DataStore, _super);
    function DataStore() {
        return _super.call(this, createInitialState()) || this;
    }
    DataStore = __decorate([
        (0, akita_1.StoreConfig)({ name: "data" })
    ], DataStore);
    return DataStore;
}(akita_1.Store));
exports.DataStore = DataStore;
exports.dataStore = new DataStore();
