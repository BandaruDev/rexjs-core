import { basename, join, resolve } from 'path';
import { Configuration, HistoryApiFallbackConfig } from 'webpack-dev-server';
import { Configuration as CONFIGURATION, getBuildOptions} from '../../core';

/**
 * webpackDevServer Configuration
 */
export function server_config(CONFIG: CONFIGURATION): Configuration {
    const options = getBuildOptions();
    const { port, host, open} = options;
    // if (options.host) {
    //     if (!/^127\.\d+\.\d+\.\d+/g.test(options.host) && options.host !== 'localhost') {
    //     };
    // }
    return {
        port,
        host,
        open,
        public: resolve(CONFIG.outputPath),
        
        hot: true,
        https: false,
        compress: true,
        stats: 'minimal',
        watchContentBase: false,
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: {
            index: `${basename(CONFIG.index)}`,
            disableDotRule: true,
            htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
        } as HistoryApiFallbackConfig,
    }
}