import { resolve } from 'path';
import { RuleSetRule } from 'webpack';

export const TS_LINT_LOADER: RuleSetRule = {
  enforce: 'pre',
  test: /\.ts?$/,
  loader: 'tslint-loader',
  exclude: /node_modules/,
  include: resolve(__dirname, 'src'),
  options: {
    emitErrors: true,
    failOnHint: false,
    configFile: 'tslint.json',
    typeCheck: true, // You want to make sure this is removed or set to false
  },
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
