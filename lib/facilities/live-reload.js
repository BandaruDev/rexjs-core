"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
function addLiveReload(webpackconfig, options, clientAddress) {
    const { configuration } = options;
    // This allows for live reload of page when changes are made to repo.
    // https://webpack.js.org/configuration/dev-server/#devserver-inline
    let webpackDevServerPath;
    try {
        webpackDevServerPath = require.resolve('webpack-dev-server/client');
    }
    catch (_a) {
        throw new Error('The "webpack-dev-server" package could not be found.');
    }
    const entryPoints = [`${webpackDevServerPath}?${clientAddress}`];
    if (configuration.hmr) {
        const webpackHmrLink = 'https://webpack.js.org/guides/hot-module-replacement';
        console.warn(`NOTICE: Hot Module Replacement (HMR) is enabled for the dev server.`);
        const showWarning = configuration.hmr;
        if (showWarning) {
            console.info(`
              The project will still live reload when HMR is enabled,
              but to take advantage of HMR additional application code is required'
              (not included in an Rex CLI project by default).'
              See ${webpackHmrLink}
              for information on working with HMR for Webpack.`);
            console.warn(`To disable this warning use "hmrWarning: false" under "serve"
               options in "rex.json".`);
        }
        entryPoints.push('webpack/hot/dev-server');
        if (!webpackconfig.plugins) {
            return;
        }
        webpackconfig.plugins.push(new webpack_1.default.HotModuleReplacementPlugin());
        if (configuration.extractCss) {
            console.warn(`NOTICE: (HMR) does not allow for CSS hot reload
                    when used together with '--extract-css'.`);
        }
    }
}
exports.addLiveReload = addLiveReload;
