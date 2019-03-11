"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./rex-plugins"));
__export(require("./thirdparty"));
const webpack_1 = require("webpack");
/**
 *
 * @param plugins
 */
function registerPlugins(plugins) {
    const rexPlugins = [];
    plugins.forEach(plugin => rexPlugins.push(plugin));
    return rexPlugins;
}
exports.registerPlugins = registerPlugins;
/**
 *
 */
exports.RexPlugins = registerPlugins([
    new webpack_1.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
]);
