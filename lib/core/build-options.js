"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaultbuildOptions = {
    target: 'web',
    port: 4400,
    host: 'localhost',
    ssl: false,
    open: true,
    liveReload: true,
    publicHost: '127.0.0.1',
    disableHostCheck: false,
};
function getBuildOptions(options) {
    return Object.assign(defaultbuildOptions, options);
}
exports.getBuildOptions = getBuildOptions;
