import MiniExtractCssPlugin from 'mini-css-extract-plugin';
import { RuleSetRule } from 'webpack';
import { inDevelopment } from '../../webpack';

export const STYLUS_LOADER: RuleSetRule = {
  test: /\.styl$/,
  use: [
    inDevelopment ? 'style-loader' : MiniExtractCssPlugin.loader,
    'css-loader',
    'stylus-loader',
    {
      options: {
        sourceMap: true,
      },
    },
  ],
};
