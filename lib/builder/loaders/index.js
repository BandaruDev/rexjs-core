"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const default_loaders_1 = require("./default-loaders");
/**
 *
 * @param Loaders
 */
function registerLoaders(rules) {
    const rexLoaders = [];
    rules.forEach(rule => rexLoaders.push(rule));
    return rexLoaders;
}
exports.registerLoaders = registerLoaders;
/**
 * Default Loaders
 */
exports.RexLoaders = registerLoaders([
    // TS_LINT_LOADER,
    default_loaders_1.TS_LOADER,
    default_loaders_1.POST_CSS_LOADER,
    default_loaders_1.SASS_LOADER,
]);
