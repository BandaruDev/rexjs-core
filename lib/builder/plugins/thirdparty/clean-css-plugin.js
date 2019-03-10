"use strict";
// tslint:disable
// TODO: cleanup this file, it's copied as is from Angular CLI.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var webpack_sources_1 = require("webpack-sources");
var CleanCSS = require('clean-css');
function hook(compiler, action) {
    compiler.hooks.compilation.tap('cleancss-webpack-plugin', function (compilation) {
        compilation.hooks.optimizeChunkAssets.tapPromise('cleancss-webpack-plugin', function (chunks) {
            return action(compilation, chunks);
        });
    });
}
var CleanCssWebpackPlugin = /** @class */ (function () {
    function CleanCssWebpackPlugin(options) {
        this._options = tslib_1.__assign({ sourceMap: false, test: function (file) { return file.endsWith('.css'); } }, options);
    }
    CleanCssWebpackPlugin.prototype.apply = function (compiler) {
        var _this = this;
        hook(compiler, function (compilation, chunks) {
            var cleancss = new CleanCSS({
                compatibility: 'ie9',
                level: {
                    2: {
                        skipProperties: ['transition'],
                    },
                },
                inline: false,
                returnPromise: true,
                sourceMap: _this._options.sourceMap,
            });
            var files = compilation.additionalChunkAssets.slice();
            chunks.forEach(function (chunk) {
                if (chunk.files && chunk.files.length > 0) {
                    files.push.apply(files, chunk.files);
                }
            });
            var actions = files
                .filter(function (file) { return _this._options.test(file); })
                .map(function (file) {
                var asset = compilation.assets[file];
                if (!asset) {
                    return Promise.resolve();
                }
                var content;
                var map;
                if (_this._options.sourceMap && asset.sourceAndMap) {
                    var sourceAndMap = asset.sourceAndMap();
                    content = sourceAndMap.source;
                    map = sourceAndMap.map;
                }
                else {
                    content = asset.source();
                }
                if (content.length === 0) {
                    return Promise.resolve();
                }
                return Promise.resolve()
                    .then(function () { return (map ? cleancss.minify(content, map) : cleancss.minify(content)); })
                    .then(function (output) {
                    var _a;
                    var hasWarnings = false;
                    if (output.warnings && output.warnings.length > 0) {
                        (_a = compilation.warnings).push.apply(_a, output.warnings);
                        hasWarnings = true;
                    }
                    if (output.errors && output.errors.length > 0) {
                        output.errors.forEach(function (error) { return compilation.errors.push(new Error(error)); });
                        return;
                    }
                    // generally means invalid syntax so bail
                    if (hasWarnings && output.stats.minifiedSize === 0) {
                        return;
                    }
                    var newSource;
                    if (output.sourceMap) {
                        newSource = new webpack_sources_1.SourceMapSource(output.styles, file, output.sourceMap.toString(), content, map);
                    }
                    else {
                        newSource = new webpack_sources_1.RawSource(output.styles);
                    }
                    compilation.assets[file] = newSource;
                });
            });
            return Promise.all(actions);
        });
    };
    return CleanCssWebpackPlugin;
}());
exports.CleanCssWebpackPlugin = CleanCssWebpackPlugin;
