"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
tslib_1.__exportStar(require("./rex-plugins"), exports);
tslib_1.__exportStar(require("./thirdparty"), exports);
var webpack_1 = require("webpack");
/**
 *
 * @param plugins
 */
function registerPlugins(plugins) {
    var rexPlugins = [];
    plugins.forEach(function (plugin) { return rexPlugins.push(plugin); });
    return rexPlugins;
}
exports.registerPlugins = registerPlugins;
/**
 *
 */
exports.RexPlugins = registerPlugins([
    new webpack_1.default.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
]);
