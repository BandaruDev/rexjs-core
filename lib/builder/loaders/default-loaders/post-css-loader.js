"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mini_css_extract_plugin_1 = require("mini-css-extract-plugin");
var webpack_1 = require("../../webpack");
exports.POST_CSS_LOADER = {
    test: /\.css$/,
    use: [
        webpack_1.inDevelopment ? 'style-loader' : mini_css_extract_plugin_1.default.loader,
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                ident: 'postcss',
                plugins: function () { return [
                    require('postcss-import')(),
                    require('postcss-preset-env')(),
                    require('autoprefixer')(),
                    require('cssnano')()
                ]; }
            }
        }
    ]
};
