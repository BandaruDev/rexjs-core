"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var default_loaders_1 = require("./default-loaders");
/**
 *
 * @param Loaders
 */
function registerLoaders(rules) {
    var rexLoaders = [];
    rules.forEach(function (rule) { return rexLoaders.push(rule); });
    return rexLoaders;
}
exports.registerLoaders = registerLoaders;
;
/**
 * Default Loaders
 */
exports.RexLoaders = registerLoaders([
    // TS_LINT_LOADER,
    default_loaders_1.TS_LOADER,
    default_loaders_1.POST_CSS_LOADER,
    default_loaders_1.SASS_LOADER,
]);
