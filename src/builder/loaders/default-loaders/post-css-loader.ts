
import MiniExtractCssPlugin from 'mini-css-extract-plugin';
import { RuleSetRule } from 'webpack';
import { inDevelopment } from '../../webpack';

export const POST_CSS_LOADER: RuleSetRule = {
        test: /\.css$/,
        use: [
            inDevelopment ? 'style-loader' : MiniExtractCssPlugin.loader,
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    ident: 'postcss',
                    plugins: () => [
                        require('postcss-import')(),
                        require('postcss-preset-env')(),
                        require('autoprefixer')(),
                        require('cssnano')()
                    ]
                }
            }
        ]
};