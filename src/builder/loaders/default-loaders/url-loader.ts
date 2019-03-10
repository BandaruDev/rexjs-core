import { RuleSetRule } from 'webpack';

export const URL_LOADER: RuleSetRule = {
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