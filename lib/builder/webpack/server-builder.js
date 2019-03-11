"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const core_1 = require("../../core");
/**
 * webpackDevServer Configuration
 */
function server_config(CONFIG) {
    const options = core_1.getBuildOptions();
    const { port, host, open } = options;
    // if (options.host) {
    //     if (!/^127\.\d+\.\d+\.\d+/g.test(options.host) && options.host !== 'localhost') {
    //     };
    // }
    return {
        port,
        host,
        open,
        public: path_1.resolve(CONFIG.outputPath),
        hot: true,
        https: false,
        compress: true,
        stats: 'minimal',
        watchContentBase: false,
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: {
            index: `${path_1.basename(CONFIG.index)}`,
            disableDotRule: true,
            htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
        },
    };
}
exports.server_config = server_config;
