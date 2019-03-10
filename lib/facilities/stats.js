"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webpackOutputOptions = {
    colors: true,
    hash: true,
    timings: true,
    chunks: true,
    chunkModules: false,
    children: false,
    modules: false,
    reasons: false,
    warnings: true,
    errors: true,
    assets: true,
    version: false,
    errorDetails: false,
    moduleTrace: false,
};
var verboseWebpackOutputOptions = {
    // The verbose output will most likely be piped to a file, so colors just mess it up.
    colors: false,
    usedExports: true,
    maxModules: Infinity,
    optimizationBailout: true,
    reasons: true,
    children: true,
    assets: true,
    version: true,
    chunkModules: true,
    errorDetails: true,
    moduleTrace: true,
};
function getWebpackStatsConfig(verbose) {
    if (verbose === void 0) { verbose = false; }
    return verbose
        ? Object.assign(webpackOutputOptions, verboseWebpackOutputOptions)
        : webpackOutputOptions;
}
exports.getWebpackStatsConfig = getWebpackStatsConfig;
