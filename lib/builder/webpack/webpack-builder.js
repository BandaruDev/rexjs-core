"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var webpack_1 = require("webpack");
var copy_webpack_plugin_1 = require("copy-webpack-plugin");
var fork_ts_checker_webpack_plugin_1 = require("fork-ts-checker-webpack-plugin");
var html_webpack_plugin_1 = require("html-webpack-plugin");
var mini_css_extract_plugin_1 = require("mini-css-extract-plugin");
var terser_webpack_plugin_1 = require("terser-webpack-plugin");
var scripts_webpack_plugin_1 = require("../plugins/thirdparty/scripts-webpack-plugin");
var externals_webpack_plugin_1 = require("../plugins/rex-plugins/externals-webpack-plugin");
var inject_html_plugin_1 = require("../plugins/rex-plugins/inject-html-plugin");
var inline_css_plugin_1 = require("../plugins/rex-plugins/inline-css-plugin");
var loaders_1 = require("../loaders");
var plugins_1 = require("../plugins");
// const LicenseWebpackPlugin = require('license-webpack-plugin').LicenseWebpackPlugin;
// const SubresourceIntegrityPlugin = require('webpack-subresource-integrity');
// **************************************************** //
exports.inDevelopment = process.env.NODE_ENV !== 'production';
exports.tsconfig = path_1.resolve('tsconfig.json');
/**
 * The main configuration
 */
function webpack_bundler(rexbuildoptions) {
    var configuration = rexbuildoptions.configuration, project = rexbuildoptions.project, version = rexbuildoptions.version;
    var root = project.root, sourceRoot = project.sourceRoot;
    var index = configuration.index, main = configuration.main, outputPath = configuration.outputPath, styleext = configuration.styleext, pwa = configuration.pwa, styles = configuration.styles, scripts = configuration.scripts, assets = configuration.assets, progress = configuration.progress, extractCss = configuration.extractCss, externals = configuration.externals, svgOptions = configuration.svgOptions, optimization = configuration.optimization, buildOptimizer = configuration.buildOptimizer, outputHashing = configuration.outputHashing;
    var entryPoints = {};
    var favicon = path_1.resolve(root, sourceRoot + "/favicon.ico");
    // determine hashing format
    var hashFormat = outputHashing || 'none';
    var HtmlMinifyOptions = {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
    };
    var HtmlPluginOptions = {
        template: path_1.resolve(root, index),
        inject: true,
        favicon: favicon,
        meta: {
            'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no',
            // Will generate: <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            'theme-color': '#4285f4',
            // Will generate: <meta name="theme-color" content="#4285f4">
            // see  https://developers.google.com/web/fundamentals/security/csp/
            'Content-Security-Policy': {
                'http-equiv': 'Content-Security-Policy',
                'content': "default-src 'self' https://* ;script-src 'self' https://* ;connect-src 'self';img-src 'self' https://*;media-src 'self' https://*;\n         style-src 'self' 'unsafe-inline';"
            },
        },
        minify: HtmlMinifyOptions
    };
    plugins_1.RexPlugins.push(new html_webpack_plugin_1.default(HtmlPluginOptions));
    if (main) {
        // entryPoints['wds'] = ['webpack-dev-server/client?http://localhost:8080'];
        // entryPoints['hot'] =['webpack/hot/only-dev-server']
        entryPoints.main = [path_1.resolve(root, main)];
    }
    ;
    if (styles) {
        styles.map(function (style) {
            return entryPoints.styles = [path_1.resolve(root, style)];
        });
    }
    ;
    if (assets) {
        assets.forEach(function (asset) {
            // Resolve input paths relative to workspace root and add slash at the end.
            asset = path_1.default.resolve(root, asset).replace(/\\/g, '/');
            asset = asset.endsWith('/') ? asset : asset + '/';
            asset = asset.endsWith('/') ? asset : asset + '/';
            if (asset.startsWith('..')) {
                var message = 'An asset cannot be written to a location outside of the output path.';
                throw new Error(message);
            }
            var AssetsPlugin;
            AssetsPlugin = new copy_webpack_plugin_1.default([{
                    from: asset,
                    to: 'assets',
                }], { ignore: ['.gitkeep', '**/.DS_Store', '**/Thumbs.db'] });
            plugins_1.RexPlugins.push(AssetsPlugin);
        });
    }
    ;
    if (progress) {
        plugins_1.RexPlugins.push(new webpack_1.ProgressPlugin());
    }
    ;
    if (extractCss) {
        plugins_1.RexPlugins.push(new mini_css_extract_plugin_1.default({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: exports.inDevelopment ? '[name].css' : '[name].[hash].css',
            chunkFilename: exports.inDevelopment ? '[id].css' : '[id].[hash].css',
        }));
    }
    ;
    if (scripts.length > 0) {
        plugins_1.RexPlugins.push(new scripts_webpack_plugin_1.ScriptsWebpackPlugin({
            scripts: scripts
        }));
    }
    if (externals) {
        plugins_1.RexPlugins.push(new externals_webpack_plugin_1.HtmlExternalsPlugin(externals));
    }
    ;
    plugins_1.RexPlugins.push(new inject_html_plugin_1.ReplaceUrlHtmlWebpackPlugin());
    // if (subresourceIntegrity) {
    //   RexPlugins.push(new SubresourceIntegrityPlugin({
    //     hashFuncNames: ['sha384'],
    //   }));
    // }
    // if (extractLicenses) {
    //   RexPlugins.push(new LicenseWebpackPlugin({
    //     renderBanner: undefined,
    //     renderLicenses: undefined,
    //     outputFilename: '',
    //     perChunkOutput: false,
    //   }));
    // }
    plugins_1.RexPlugins.push(new inline_css_plugin_1.InlineCssPlugin(), //   new AuthorPlugin({ app_name: 'My-App' })
    new fork_ts_checker_webpack_plugin_1.default());
    // ****************** END OF PLUGINS **************** //
    // ****************** START MINIMIZERS ************** //
    var RexMinimizers = [];
    if (optimization) {
        var terserOptions = {};
        RexMinimizers.push(new terser_webpack_plugin_1.default({
            sourceMap: true,
            parallel: true,
            cache: true,
            terserOptions: terserOptions,
        }));
    }
    ;
    // ****************** END OF MINIMIZERS ************* //
    // ****************** START LOADERS ***************** //
    var SVGO_LOADER = {};
    var FILE_LOADER = {
        test: /\.(eot|svg|cur|jpg|png|webp|gif|ico|otf|ttf|woff|woff2|ani)$/,
        exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
        loader: 'file-loader',
        options: {
            name: "[name]" + hashFormat + ".[ext]",
        },
    };
    // **** DO NOT PUSH ANY LOADER AFTER THE FILE LAODER *** //
    if (svgOptions) {
        var optimize = svgOptions.optimize, useInline = svgOptions.useInline, useSprite = svgOptions.useSprite;
    }
    ;
    // if(pwa){
    // };
    loaders_1.RexLoaders.push(FILE_LOADER);
    // ****************** END LOADERS ***************** //
    return {
        name: '',
        mode: exports.inDevelopment ? 'development' : 'production',
        // Stop compilation early in production
        bail: exports.inDevelopment ? false : true,
        // target: 'node',
        devtool: exports.inDevelopment ? '#inline-source-map' : false,
        entry: entryPoints,
        output: {
            path: path_1.resolve(outputPath),
            filename: '[name].js'
        },
        watch: true,
        watchOptions: {
            ignored: /node_modules/,
            poll: true,
        },
        performance: {
            hints: false,
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json'],
            symlinks: false,
        },
        module: {
            rules: loaders_1.RexLoaders.filter(Boolean),
        },
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                cacheGroups: {
                    styles: {
                        name: 'styles',
                        test: /\.css$/,
                        chunks: 'all',
                        enforce: true
                    },
                    vendor: {
                        test: /[\\\/]node_modules[\\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            },
            noEmitOnErrors: true,
            minimizer: [
                new webpack_1.HashedModuleIdsPlugin(),
                new terser_webpack_plugin_1.default({
                    test: /\.js(\?.*)?$/i,
                    parallel: 4,
                    chunkFilter: function (chunk) {
                        // Exclude uglification for the `vendor` chunk
                        if (chunk.name === 'vendor') {
                            return false;
                        }
                        return true;
                    },
                    terserOptions: {
                        ecma: 5,
                        warnings: false,
                        parse: {
                            html5_comments: true,
                        },
                        compress: {
                            pure_getters: buildOptimizer,
                            // PURE comments work best with 3 passes.
                            // See https://github.com/webpack/webpack/issues/2899#issuecomment-317425926.
                            passes: buildOptimizer ? 3 : 1,
                        },
                        mangle: true,
                        module: false,
                        toplevel: false,
                        ie8: false,
                        keep_classnames: undefined,
                        keep_fnames: false,
                        safari10: false,
                    }
                }),
            ],
        },
        plugins: plugins_1.RexPlugins.filter(Boolean),
        node: {
            dgram: 'empty',
            fs: 'empty',
            net: 'empty',
            tls: 'empty',
            child_process: 'empty',
        },
    };
}
exports.webpack_bundler = webpack_bundler;
