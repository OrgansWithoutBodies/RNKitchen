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
exports.useData = exports.useAkita = void 0;
var rambdax_1 = require("rambdax");
var react_1 = require("react");
var data_query_1 = require("./data.query");
var data_service_1 = require("./data.service");
function useAkita(query, service, queryTerms) {
    var _a = (0, react_1.useState)(function () {
        return (0, rambdax_1.pick)(queryTerms, query.getValue());
    }), retrievedQueryTerms = _a[0], setRetrievedQueryTerms = _a[1];
    (0, react_1.useEffect)(function () {
        var subscriptions = queryTerms.map(function (term) {
            // TODO no any
            var retrievedQueryObservable = query[term];
            return retrievedQueryObservable.subscribe({
                next: function (observedValue) {
                    setRetrievedQueryTerms(function (s) {
                        var _a;
                        return (__assign(__assign({}, s), (_a = {}, _a[term] = observedValue, _a)));
                    });
                }
            });
        });
        return function () {
            return subscriptions.forEach(function (subscription) { return subscription.unsubscribe(); });
        };
    }, []);
    return [retrievedQueryTerms, []];
}
exports.useAkita = useAkita;
// TODO token registration
var useData = function (queryTerms) {
    return useAkita(data_query_1.dataQuery, data_service_1.dataService, queryTerms);
};
exports.useData = useData;
