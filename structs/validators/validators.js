"use strict";
exports.__esModule = true;
exports.ArrayRecipeBuddyRecipeValidator = void 0;
var ss = require("superstruct");
var is_url_1 = require("is-url");
var URLStruct = ss.define("URL", function (value) {
    return (0, is_url_1["default"])(value) && value.length < 2048;
});
// TODO add validators for minimum set of fields expected for grocy
// const HasIDValidator
var SingleRecipeBuddyRecipeValidator = ss.object({
    __v: ss.number(),
    _id: ss.string(),
    name: ss.string(),
    ingredients: ss.array(ss.string()),
    steps: ss.array(ss.string()),
    url: URLStruct,
    imageUrl: URLStruct
});
exports.ArrayRecipeBuddyRecipeValidator = ss.array(SingleRecipeBuddyRecipeValidator);
