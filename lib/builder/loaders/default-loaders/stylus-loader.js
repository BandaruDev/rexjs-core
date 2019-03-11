"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const webpack_1 = require("../../webpack");
exports.STYLUS_LOADER = {
    test: /\.styl$/,
    use: [
        webpack_1.inDevelopment ? 'style-loader' : mini_css_extract_plugin_1.default.loader,
        'css-loader',
        'stylus-loader',
        {
            options: {
                sourceMap: true,
            },
        },
    ],
};
