"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_1 = require("webpack");
function addLiveReload(webpackconfig, options, clientAddress) {
    var configuration = options.configuration;
    // This allows for live reload of page when changes are made to repo.
    // https://webpack.js.org/configuration/dev-server/#devserver-inline
    var webpackDevServerPath;
    try {
        webpackDevServerPath = require.resolve('webpack-dev-server/client');
    }
    catch (_a) {
        throw new Error('The "webpack-dev-server" package could not be found.');
    }
    var entryPoints = [webpackDevServerPath + "?" + clientAddress];
    if (configuration.hmr) {
        var webpackHmrLink = 'https://webpack.js.org/guides/hot-module-replacement';
        console.warn("NOTICE: Hot Module Replacement (HMR) is enabled for the dev server.");
        var showWarning = configuration.hmr;
        if (showWarning) {
            console.info("\n              The project will still live reload when HMR is enabled,\n              but to take advantage of HMR additional application code is required'\n              (not included in an Rex CLI project by default).'\n              See " + webpackHmrLink + "\n              for information on working with HMR for Webpack.");
            console.warn("To disable this warning use \"hmrWarning: false\" under \"serve\"\n               options in \"rex.json\".");
        }
        entryPoints.push('webpack/hot/dev-server');
        if (!webpackconfig.plugins) {
            return;
        }
        webpackconfig.plugins.push(new webpack_1.default.HotModuleReplacementPlugin());
        if (configuration.extractCss) {
            console.warn("NOTICE: (HMR) does not allow for CSS hot reload\n                    when used together with '--extract-css'.");
        }
    }
}
exports.addLiveReload = addLiveReload;
