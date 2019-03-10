"use strict";
// tslint:disable
// TODO: cleanup this file, it's copied as is from Angular CLI.
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_sources_1 = require("webpack-sources");
var loader_utils_1 = require("loader-utils");
var path = require("path");
var Chunk = require('webpack/lib/Chunk');
var EntryPoint = require('webpack/lib/Entrypoint');
function addDependencies(compilation, scripts) {
    for (var _i = 0, scripts_1 = scripts; _i < scripts_1.length; _i++) {
        var script = scripts_1[_i];
        compilation.fileDependencies.add(script);
    }
}
function hook(compiler, action) {
    compiler.hooks.thisCompilation.tap('scripts-webpack-plugin', function (compilation) {
        compilation.hooks.additionalAssets.tapAsync('scripts-webpack-plugin', function (callback) {
            return action(compilation, callback);
        });
    });
}
var ScriptsWebpackPlugin = /** @class */ (function () {
    function ScriptsWebpackPlugin(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
    }
    ScriptsWebpackPlugin.prototype.shouldSkip = function (compilation, scripts) {
        if (this._lastBuildTime == undefined) {
            console.log("lat buils:", this._lastBuildTime);
            this._lastBuildTime = Date.now();
            return false;
        }
        for (var i = 0; i < scripts.length; i++) {
            var scriptTime = compilation.fileTimestamps.get(scripts[i]);
            if (!scriptTime || scriptTime > this._lastBuildTime) {
                this._lastBuildTime = Date.now();
                return false;
            }
        }
        return true;
    };
    ScriptsWebpackPlugin.prototype._insertOutput = function (compilation, _a, cached) {
        var filename = _a.filename, source = _a.source;
        if (cached === void 0) { cached = false; }
        var chunk = new Chunk(this.options.name);
        chunk.rendered = !cached;
        chunk.id = this.options.name;
        chunk.ids = [chunk.id];
        chunk.files.push(filename);
        var entrypoint = new EntryPoint(this.options.name);
        entrypoint.pushChunk(chunk);
        chunk.addGroup(entrypoint);
        compilation.entrypoints.set(this.options.name, entrypoint);
        compilation.chunks.push(chunk);
        compilation.assets[filename] = source;
    };
    ScriptsWebpackPlugin.prototype.apply = function (compiler) {
        var _this = this;
        if (!this.options.scripts || this.options.scripts.length === 0) {
            return;
        }
        var scripts = this.options.scripts
            .filter(function (script) { return !!script; })
            .map(function (script) { return path.resolve(_this.options.basePath || '', script); });
        hook(compiler, function (compilation, callback) {
            if (_this.shouldSkip(compilation, scripts)) {
                if (_this._cachedOutput) {
                    _this._insertOutput(compilation, _this._cachedOutput, true);
                }
                addDependencies(compilation, scripts);
                callback();
                return;
            }
            var sourceGetters = scripts.map(function (fullPath) {
                return new Promise(function (resolve, reject) {
                    compilation.inputFileSystem.readFile(fullPath, function (err, data) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        var content = data.toString();
                        var source;
                        if (_this.options.sourceMap) {
                            // TODO: Look for source map file (for '.min' scripts, etc.)
                            var adjustedPath = fullPath;
                            if (_this.options.basePath) {
                                adjustedPath = path.relative(_this.options.basePath, fullPath);
                            }
                            source = new webpack_sources_1.OriginalSource(content, adjustedPath);
                        }
                        else {
                            source = new webpack_sources_1.RawSource(content);
                        }
                        resolve(source);
                    });
                });
            });
            Promise.all(sourceGetters)
                .then(function (sources) {
                var concatSource = new webpack_sources_1.ConcatSource();
                sources.forEach(function (source) {
                    concatSource.add(source);
                    concatSource.add('\n;');
                });
                var combinedSource = new webpack_sources_1.CachedSource(concatSource);
                var filename = loader_utils_1.interpolateName({ resourcePath: 'scripts.js' }, _this.options.filename, { content: combinedSource.source() });
                var output = { filename: filename, source: combinedSource };
                _this._insertOutput(compilation, output);
                _this._cachedOutput = output;
                addDependencies(compilation, scripts);
                callback();
            })
                .catch(function (err) { return callback(err); });
        });
    };
    return ScriptsWebpackPlugin;
}());
exports.ScriptsWebpackPlugin = ScriptsWebpackPlugin;
