"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TS_LOADER = {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: {
        loader: 'ts-loader',
        options: {
            onlyCompileBundledFiles: true,
            transpileOnly: true,
            experimentalWatchApi: true,
        },
    },
};
