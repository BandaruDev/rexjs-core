import { RuleSetRule } from 'webpack';

export const TS_LOADER: RuleSetRule = {
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
