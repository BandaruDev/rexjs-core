import MiniExtractCssPlugin from 'mini-css-extract-plugin';
import { RuleSetRule } from 'webpack';
import { inDevelopment } from '../../webpack';

export const SASS_LOADER: RuleSetRule = {
  test: /\.scss$|\.sass$/,
  use: [
    inDevelopment ? 'style-loader' : MiniExtractCssPlugin.loader,
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
