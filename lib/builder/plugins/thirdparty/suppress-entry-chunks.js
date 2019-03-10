"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// tslint:disable
// TODO: cleanup this file, it's copied as is from Angular CLI.
Object.defineProperty(exports, "__esModule", { value: true });
// Remove .js files from entry points consisting entirely of .css|scss|sass|less|styl.
// To be used together with ExtractTextPlugin.
var SuppressExtractedTextChunksWebpackPlugin = /** @class */ (function () {
    function SuppressExtractedTextChunksWebpackPlugin() {
    }
    SuppressExtractedTextChunksWebpackPlugin.prototype.apply = function (compiler) {
        compiler.hooks.compilation.tap('SuppressExtractedTextChunks', function (compilation) {
            // find which chunks have css only entry points
            var cssOnlyChunks = [];
            var entryPoints = compilation.options.entry;
            // determine which entry points are composed entirely of css files
            for (var _i = 0, _a = Object.keys(entryPoints); _i < _a.length; _i++) {
                var entryPoint = _a[_i];
                var entryFiles = entryPoints[entryPoint];
                // when type of entryFiles is not array, make it as an array
                entryFiles = entryFiles instanceof Array ? entryFiles : [entryFiles];
                if (entryFiles.every(function (el) {
                    return el.match(/\.(css|scss|sass|less|styl)$/) !== null;
                })) {
                    cssOnlyChunks.push(entryPoint);
                }
            }
            // Remove the js file for supressed chunks
            compilation.hooks.afterSeal.tap('SuppressExtractedTextChunks', function () {
                compilation.chunks
                    .filter(function (chunk) { return cssOnlyChunks.indexOf(chunk.name) !== -1; })
                    .forEach(function (chunk) {
                    var newFiles = [];
                    chunk.files.forEach(function (file) {
                        if (file.match(/\.js(\.map)?$/)) {
                            // remove js files
                            delete compilation.assets[file];
                        }
                        else {
                            newFiles.push(file);
                        }
                    });
                    chunk.files = newFiles;
                });
            });
            // Remove scripts tags with a css file as source, because HtmlWebpackPlugin will use
            // a css file as a script for chunks without js files.
            // TODO: Enable this once HtmlWebpackPlugin supports Webpack 4
            // compilation.plugin('html-webpack-plugin-alter-asset-tags',
            //   (htmlPluginData: any, callback: any) => {
            //     const filterFn = (tag: any) =>
            //       !(tag.tagName === 'script' && tag.attributes.src.match(/\.css$/));
            //     htmlPluginData.head = htmlPluginData.head.filter(filterFn);
            //     htmlPluginData.body = htmlPluginData.body.filter(filterFn);
            //     callback(null, htmlPluginData);
            //   });
        });
    };
    return SuppressExtractedTextChunksWebpackPlugin;
}());
exports.SuppressExtractedTextChunksWebpackPlugin = SuppressExtractedTextChunksWebpackPlugin;
