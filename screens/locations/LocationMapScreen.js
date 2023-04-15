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
exports.__esModule = true;
exports.RoomMapScreen = exports.Controller = exports.WholeScreenMap = exports.ControllerButton = void 0;
var react_native_skia_1 = require("@shopify/react-native-skia");
var react_1 = require("react");
var react_native_1 = require("react-native");
var useBoard_1 = require("./useBoard");
var data_service_1 = require("../../state/data.service");
var useAkita_1 = require("../../state/useAkita");
var GridBoard_1 = require("./GridBoard");
var paint = react_native_skia_1.Skia.Paint();
paint.setAntiAlias(true);
paint.setBlendMode(react_native_skia_1.BlendMode.Multiply);
// TODO hookify
// pass board state to invoked area - maybe context handler?
var getRandomColor = function () {
    var channelSize = 16;
    var charCode = new Array(6)
        .fill(0)
        .map(function () { return Math.round(Math.random() * channelSize).toString(16); })
        .reduce(function (prev, curr) { return prev + curr; });
    return "#".concat(charCode);
};
function ControllerButton(_a) {
    var onPress = _a.onPress, backgroundColor = _a.backgroundColor, label = _a.label, _b = _a.disabled, disabled = _b === void 0 ? false : _b;
    return (<react_native_1.Pressable disabled={disabled} onPress={onPress} style={__assign(__assign({}, styles.buttonStyle), { backgroundColor: disabled ? "grey" : backgroundColor })}>
      <react_native_1.Text>{label}</react_native_1.Text>
    </react_native_1.Pressable>);
}
exports.ControllerButton = ControllerButton;
var getDefaultTile = function (rad, _a) {
    var cx = _a.cx, cy = _a.cy, resolvedColor = _a.resolvedColor;
    return <react_native_skia_1.Circle cx={cx} cy={cy} r={rad} color={resolvedColor}/>;
};
function WholeScreenMap(_a) {
    var activePiece = _a.activePiece, setActivePiece = _a.setActivePiece, boardPieces = _a.boardPieces, gridSize = _a.gridSize, 
    // TODO be able to pass custom handler & prioritize that over this flag
    _b = _a.allowConflicts, 
    // TODO be able to pass custom handler & prioritize that over this flag
    allowConflicts = _b === void 0 ? false : _b;
    var onMoveWouldConflict = allowConflicts
        ? function (_a) {
            var completeMove = _a.completeMove;
            completeMove();
        }
        : function (_a) { };
    var _c = react_native_1.Dimensions.get("window"), width = _c.width, height = _c.height;
    var nLines = {
        x: Math.ceil(width / gridSize),
        y: Math.ceil(height / gridSize)
    };
    var percRadiusPadding = 0.2;
    var templateRadius = (gridSize * (1 - percRadiusPadding)) / 2;
    var Template = function (props) {
        return getDefaultTile(templateRadius, props);
    };
    var touchHandler = (0, useBoard_1.buildTouchHandler)(boardPieces, gridSize, activePiece, onMoveWouldConflict, setActivePiece);
    return (
    // TODO xstate machine for turning touch sequences into events
    // TODO debounce events?
    // TODO store layout
    // TODO moveable/zoomable viewport
    <>
      <react_native_skia_1.Canvas style={{ flex: 1 }} onTouch={touchHandler}>
        <GridBoard_1.GridBoard activePiece={activePiece} boardPieces={boardPieces} offsetPerc={0.5} nLines={nLines} gridSize={gridSize} height={height} width={width} Tile={Template}/>
      </react_native_skia_1.Canvas>
    </>);
}
exports.WholeScreenMap = WholeScreenMap;
function ActiveDetails(_a) {
    var activePiece = _a.activePiece, boardPieces = _a.boardPieces;
    var activeGuard = function (activePiece) {
        return activePiece !== null;
    };
    var isActive = activeGuard(activePiece);
    var activeObj = isActive ? boardPieces[activePiece] : null;
    var label = isActive ? boardPieces[activePiece].label : null;
    var labelBlurb = isActive && label ? "| ".concat(label) : "";
    var newLocal = activePiece && "Active Object: ".concat(activePiece, " ").concat(labelBlurb);
    return (<react_native_1.View>
      <react_native_1.Text style={{ color: "white" }}>{newLocal}</react_native_1.Text>
    </react_native_1.View>);
}
function Controller(_a) {
    var activePiece = _a.activePiece, setActivePiece = _a.setActivePiece, boardPieces = _a.boardPieces;
    var addPiece = function () {
        data_service_1.dataService.addBoardPiece({
            center: { x: 0, y: 0 },
            shape: [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
            ],
            color: getRandomColor()
        });
        setActivePiece(boardPieces.length);
    };
    var removeActivePiece = function () {
        console.log("TEST123-removing", activePiece);
        if (activePiece) {
            data_service_1.dataService.removeBoardPiece(activePiece);
        }
        setActivePiece(null);
    };
    var deselectActive = function () { return setActivePiece(null); };
    var addLabelToPiece = function () {
        return data_service_1.dataService.addLabelToPiece(activePiece, "TEST");
    };
    return (<react_native_1.View>
      <ActiveDetails activePiece={activePiece} setActivePiece={setActivePiece} boardPieces={boardPieces}/>
      <react_native_1.View style={styles.controller}>
        <ControllerButton disabled={activePiece === null} onPress={function () { return deselectActive(); }} backgroundColor={"yellow"} label="~"/>
        <ControllerButton disabled={activePiece === null} 
    // todo typeguard for this active piece
    onPress={function () { return addLabelToPiece(); }} backgroundColor={"blue"} label="?"/>
        <ControllerButton onPress={function () { return addPiece(); }} backgroundColor={"green"} label="+"/>
        <ControllerButton onPress={function () { return removeActivePiece(); }} backgroundColor={"red"} label="-"/>
      </react_native_1.View>
    </react_native_1.View>);
}
exports.Controller = Controller;
// each location has a schema of a boardstate with pantry entries
// export const DemoDraggableScreen = () => {
var RoomMapScreen = function () {
    // for each storageLocation in room - for each (top-level) location, add a (object) with a dot which shows products in that location on tap
    var _a = (0, useAkita_1.useData)(["productsInLocations", "locations", "products", "boardPieces"])[0], boardPieces = _a.boardPieces, locationProducts = _a.productsInLocations, locations = _a.locations, products = _a.products;
    var pixPerStep = 50;
    var _b = (0, react_1.useState)(null), activePiece = _b[0], setActivePiece = _b[1];
    return (<react_native_1.View>
      <Controller activePiece={activePiece} setActivePiece={setActivePiece} boardPieces={boardPieces}/>
      <WholeScreenMap activePiece={activePiece} setActivePiece={setActivePiece} boardPieces={boardPieces} gridSize={pixPerStep}/>
    </react_native_1.View>);
};
exports.RoomMapScreen = RoomMapScreen;
var styles = react_native_1.StyleSheet.create({
    controller: {
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "center",
        width: "100%"
    },
    buttonStyle: {
        margin: 10,
        padding: 5,
        borderRadius: 3,
        width: 160,
        alignItems: "center"
    }
});
