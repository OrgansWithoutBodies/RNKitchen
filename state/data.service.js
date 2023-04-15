"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.dataService = exports.DataService = void 0;
var axios_1 = require("axios");
var react_native_1 = require("react-native");
var data_store_1 = require("./data.store");
var types_1 = require("../structs/types");
var ss = require("superstruct");
var validators_1 = require("../structs/validators/validators");
var DataService = /** @class */ (function () {
    function DataService(dataStore) {
        this.dataStore = dataStore;
    }
    DataService.prototype.addToExistingProducts = function (itemName, itemDetails) {
        this.dataStore.update(function (store) {
            var _a;
            return __assign(__assign({}, store), { existingProducts: __assign(__assign({}, store.existingProducts), (_a = {}, _a[itemName] = itemDetails, _a)) });
        });
    };
    DataService.prototype.addStock = function (product, location, amount) {
        this.dataStore.update(function (store) {
            return __assign(__assign({}, store), { stockEntries: __spreadArray(__spreadArray([], store.stockEntries, true), [
                    { product_id: product, location_id: location, amount: amount },
                ], false) });
        });
    };
    DataService.prototype.addToShoppingList = function (item) {
        this.dataStore.update(function (store) {
            return __assign(__assign({}, store), { shoppingList: __spreadArray(__spreadArray([], store.shoppingList, true), [item], false) });
        });
    };
    DataService.prototype.editShoppingListItem = function (ii, item) {
        this.dataStore.update(function (store) {
            var mutableShoppingList = store.shoppingList;
            return __assign(__assign({}, store), { shoppingList: __spreadArray(__spreadArray(__spreadArray([], mutableShoppingList.slice(0, ii), true), [
                    item || undefined
                ], false), mutableShoppingList.slice(ii + 1), true) });
        });
    };
    DataService.prototype.removeFromShoppingList = function (ii) {
        this.dataStore.update(function (store) {
            var mutableShoppingList = store.shoppingList;
            return __assign(__assign({}, store), { shoppingList: __spreadArray(__spreadArray([], mutableShoppingList.slice(0, ii), true), mutableShoppingList.slice(ii + 1), true) });
        });
    };
    DataService.prototype.setRecipeBuddyAccessToken = function (token) {
        this.dataStore.update(function (store) {
            return __assign(__assign({}, store), { recipeBuddyAccessToken: token });
        });
    };
    DataService.prototype.setRecipes = function (recipes) {
        this.dataStore.update(function (store) {
            return __assign(__assign({}, store), { recipes: recipes });
        });
    };
    //   TODO be able to handle interchangeable backends
    DataService.prototype.getData = function (rootUrl, path, data) {
        return __awaiter(this, void 0, void 0, function () {
            var test;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"]
                            .get(rootUrl + path, data)["catch"](function () { return react_native_1.ToastAndroid.show("Bad Request!", react_native_1.ToastAndroid.SHORT); })];
                    case 1:
                        test = _a.sent();
                        return [2 /*return*/, test];
                }
            });
        });
    };
    // TODO - should we differentiate between Locations & Containers?
    DataService.prototype.addLocation = function (parentLocation) {
        var locations = this.dataStore.getValue().locations;
        // TODO make sure all have ids w validator
        var locationIds = locations
            .filter(function (location) { return location.id !== undefined; })
            .map(function (location) { return location.id; });
        var maxId = Math.max.apply(Math, locationIds);
        this.dataStore.update(function (state) {
            var newLocation = {
                id: maxId + 1,
                parentLocationId: parentLocation
            };
            return __assign(__assign({}, state), { locations: __spreadArray(__spreadArray([], state.locations, true), [newLocation], false) });
        });
    };
    DataService.prototype.getRecipesFromTandoor = function () { };
    DataService.prototype.getRecipesFromRecipeBuddy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, recipeBuddyUrl, accessToken, relativePath, loginPath, data, authHeader, receivedData, recipes, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = this.dataStore.getValue(), recipeBuddyUrl = _a.recipeBuddyUrl, accessToken = _a.recipeBuddyAccessToken;
                        relativePath = "/api/recipes";
                        loginPath = "/api/auth/login";
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 10, , 11]);
                        if (!!accessToken) return [3 /*break*/, 3];
                        return [4 /*yield*/, axios_1["default"].post(recipeBuddyUrl + loginPath, {
                                username: "v",
                                password: "testpass"
                            })];
                    case 2:
                        data = (_d.sent()).data;
                        this.setRecipeBuddyAccessToken(data.access_token);
                        _d.label = 3;
                    case 3:
                        authHeader = {
                            headers: {
                                Authorization: "Bearer ".concat(accessToken)
                            }
                        };
                        if (!recipeBuddyUrl) return [3 /*break*/, 8];
                        _d.label = 4;
                    case 4:
                        _d.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.getData(recipeBuddyUrl, relativePath, authHeader)];
                    case 5:
                        receivedData = (_d.sent()).data;
                        try {
                            ss.assert(receivedData, validators_1.ArrayRecipeBuddyRecipeValidator);
                            recipes = receivedData;
                            this.setRecipes(recipes);
                        }
                        catch (error) {
                            react_native_1.ToastAndroid.show("Weird Recipe Structure!", react_native_1.ToastAndroid.BOTTOM);
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        _b = _d.sent();
                        react_native_1.ToastAndroid.show("Is Recipe Buddy Running?", react_native_1.ToastAndroid.BOTTOM);
                        return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        react_native_1.ToastAndroid.show("Recipe Buddy URL Not Set!", react_native_1.ToastAndroid.BOTTOM);
                        _d.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        _c = _d.sent();
                        react_native_1.ToastAndroid.show("Couldnt Authorize To Recipe Buddy", react_native_1.ToastAndroid.BOTTOM);
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    //  IOServer
    //   TODO be able to handle interchangeable backends
    // TODO be able to specify based on OperationType
    DataService.postOpenApiData = function (rootUrl, path, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                axios_1["default"].post(rootUrl + path, data);
                return [2 /*return*/];
            });
        });
    };
    DataService.prototype.postData = function (rootUrl, path, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                axios_1["default"]
                    .post(rootUrl + path, data)["catch"](function () { return react_native_1.ToastAndroid.show("Bad Request!", react_native_1.ToastAndroid.SHORT); });
                return [2 /*return*/];
            });
        });
    };
    DataService.prototype.sendShoppingListToThermalPrinter = function () {
        var _a = this.dataStore.getValue(), shoppingList = _a.shoppingList, ioServerUrl = _a.ioServerUrl;
        var relativePath = "/printShoppingList";
        // TODO openapi typing for data
        var data = {
            list: shoppingList.filter(function (val) { return val !== undefined; })
        };
        this.postData(ioServerUrl, relativePath, data);
    };
    DataService.prototype.sendBarcodeToStickerPrinter = function (barcodes) {
        var ioServerUrl = this.dataStore.getValue().ioServerUrl;
        var relativePath = "/printBarcode";
        this.postData(ioServerUrl, relativePath, { barcodes: barcodes });
    };
    // GROCY
    DataService.prototype.getProductsFromGrocy = function () {
        var relativePath = "/stock";
        var products = [];
    };
    DataService.prototype.setPlannedMeals = function (mealPlan) {
        this.dataStore.update({ mealPlan: mealPlan });
    };
    DataService.prototype.addBoardPiece = function (boardPiece) {
        this.dataStore.update(function (_a) {
            var boardPieces = _a.boardPieces;
            return ({
                boardPieces: __spreadArray(__spreadArray([], boardPieces, true), [boardPiece], false)
            });
        });
    };
    DataService.prototype.removeBoardPiece = function (boardPieceIndex) {
        this.dataStore.update(function (_a) {
            var boardPieces = _a.boardPieces;
            var newBoardPieces = __spreadArray([], boardPieces, true).filter(function (_, ii) { return ii !== boardPieceIndex; });
            return {
                boardPieces: newBoardPieces
            };
        });
    };
    // TODO maybe make boardpiece center the cell index?
    DataService.prototype.moveBoardPiece = function (pieceIndex, center) {
        this.dataStore.update(function (_a) {
            var boardPieces = _a.boardPieces;
            var givenPiece = boardPieces[pieceIndex];
            var movedPiece = __assign(__assign({}, givenPiece), { center: center });
            var newBoardPieces = __spreadArray([], boardPieces, true);
            newBoardPieces[pieceIndex] = movedPiece;
            // console.log("TEST123", pieceIndex, newBoardPieces);
            return {
                boardPieces: newBoardPieces
            };
        });
    };
    DataService.convertRecipeToMeal = function (recipe) { };
    // TODO what do if mealslot is already taken
    DataService.prototype.addRecipeToPlan = function (date, recipeID, mealSlot) {
        var mealPlanImmutable = this.dataStore.getValue().mealPlan;
        var mealPlan = __assign({}, mealPlanImmutable);
        var meal = {
            color: types_1.mealColors[mealSlot],
            slot: mealSlot,
            recipeID: recipeID
        };
        if (Object.keys(mealPlan).includes(date)) {
            mealPlan[date].dots.push(meal);
        }
        else {
            mealPlan[date] = { dots: [meal] };
        }
        this.dataStore.update({ mealPlan: mealPlan });
    };
    /**
     * addLabelToPiece
     */
    DataService.prototype.addLabelToPiece = function (pieceIndex, label) {
        this.dataStore.update(function (_a) {
            var boardPieces = _a.boardPieces;
            var givenPiece = boardPieces[pieceIndex];
            var labeledPiece = __assign(__assign({}, givenPiece), { label: label });
            var newBoardPieces = __spreadArray([], boardPieces, true);
            newBoardPieces[pieceIndex] = labeledPiece;
            return {
                boardPieces: newBoardPieces
            };
        });
    };
    return DataService;
}());
exports.DataService = DataService;
exports.dataService = new DataService(data_store_1.dataStore);
