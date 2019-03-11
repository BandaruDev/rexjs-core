import MiniExtractCssPlugin from 'mini-css-extract-plugin';
import { RuleSetRule } from 'webpack';
import { inDevelopment } from '../../webpack';

export const LESS_LOADER: RuleSetRule = {
  test: /\.less$/,
  use: [
    inDevelopment ? 'style-loader' : MiniExtractCssPlugin.loader,
    'css-loader',
    'less-loader',
    {
      loader: 'less-loader',
      options: {
        sourceMap: true,
        javascriptEnabled: true,
      },
    },
  ],
};
