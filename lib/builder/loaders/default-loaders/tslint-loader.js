"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
exports.TS_LINT_LOADER = {
    enforce: 'pre',
    test: /\.ts?$/,
    loader: 'tslint-loader',
    exclude: /node_modules/,
    include: path_1.resolve(__dirname, 'src'),
    options: {
        emitErrors: true,
        failOnHint: false,
        configFile: 'tslint.json',
        typeCheck: true // You want to make sure this is removed or set to false
    }
};
// export const TS_LINT_LOADER2: RuleSetRule = {
//     test: /\.(ts)$/,
//     enforce: 'pre',
//     use: [
//         {
//             loader: 'tslint-loader',
//             options: {
//                 emitErrors: false,
//                 failOnHint: true,
//                 typeCheck: false,
//                 tsConfigFile: "tsconfig",
//             },
//         },
//     ],
// }
