"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URL_LOADER = {
    test: /\.png$/,
    use: [
        {
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: '[name].[ext]?[hash]',
                mimetype: 'image/png'
            }
        }
    ]
};
