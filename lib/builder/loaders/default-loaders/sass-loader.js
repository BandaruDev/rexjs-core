"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mini_css_extract_plugin_1 = require("mini-css-extract-plugin");
var webpack_1 = require("../../webpack");
exports.SASS_LOADER = {
    test: /\.scss$|\.sass$/,
    use: [
        webpack_1.inDevelopment ? 'style-loader' : mini_css_extract_plugin_1.default.loader,
        'css-loader',
        'sass-loader',
        {
            loader: 'sass-loader',
            options: {
                sourceMap: true,
                // bootstrap-sass requires a minimum precision of 8
                precision: 8,
            },
        },
    ],
    exclude: /\.module\.css$/,
    // Remove this when webpack adds a warning or an error for this.
    // See https://github.com/webpack/webpack/issues/6571
    sideEffects: true,
};
