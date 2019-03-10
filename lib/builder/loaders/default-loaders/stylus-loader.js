"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mini_css_extract_plugin_1 = require("mini-css-extract-plugin");
var webpack_1 = require("../../webpack");
exports.STYLUS_LOADER = {
    test: /\.styl$/,
    use: [
        webpack_1.inDevelopment ? 'style-loader' : mini_css_extract_plugin_1.default.loader,
        'css-loader',
        'stylus-loader',
        {
            options: {
                sourceMap: true
            }
        }
    ]
};
