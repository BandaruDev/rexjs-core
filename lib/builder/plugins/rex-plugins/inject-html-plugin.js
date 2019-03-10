"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var pluginName = 'ReplaceUrlHtmlWebpackPlugin';
/**
 *
 */
var ReplaceUrlHtmlWebpackPlugin = /** @class */ (function () {
    function ReplaceUrlHtmlWebpackPlugin() {
    }
    /**
     * @override
     */
    ReplaceUrlHtmlWebpackPlugin.prototype.apply = function (compiler) {
        var compilerOptions = compiler.options;
        compiler.hooks.compilation.tap(pluginName, function (compilation) {
            compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(pluginName, function (data) {
                // Replace asset elements in HTML
                data.plugin = ReplaceUrlHtmlWebpackPlugin;
                var assets = data.assets;
                var jsFiles = assets.js;
                var cssFiles = assets.css;
                var html = data.html;
                html = replaceJS(html, jsFiles, compilerOptions);
                html = replaceCSS(html, cssFiles, compilerOptions);
                // Remove chunks that were removed
                var chunks = compilation.chunkGroups;
                for (var chunkName in chunks) {
                    if (chunks.hasOwnProperty(chunkName)) {
                        var chunk = chunks[chunkName];
                        if (jsFiles.indexOf(chunk.entry) < 0) {
                            delete chunks[chunkName];
                        }
                    }
                }
                // Assign HTML back to data object
                data.html = html;
                // Return data object
                return data;
            });
        });
    };
    return ReplaceUrlHtmlWebpackPlugin;
}());
exports.ReplaceUrlHtmlWebpackPlugin = ReplaceUrlHtmlWebpackPlugin;
function replaceJS(html, jsFiles, compilerOptions) {
    return replace(html, jsFiles, compilerOptions, /(<script[\S\s]*?src=['"])(.+?)(['"][^>]*?>)/gi);
}
function replaceCSS(html, cssFiles, compilerOptions) {
    return replace(html, cssFiles, compilerOptions, /(<link[\S\s]*?href=['"])(.+?)(['"][^>]*?>)/gi);
}
function replace(html, files, compilerOptions, regex) {
    var basePath = getBasePath(compilerOptions);
    var output = '';
    var lastIndex = 0;
    var result;
    // tslint:disable-next-line: no-conditional-assignment
    while ((result = regex.exec(html)) !== null) {
        var scriptPrefix = result[1];
        var scriptSource = result[2];
        var scriptSuffix = result[3];
        output += html.substring(lastIndex, result.index);
        output += scriptPrefix;
        // Resolve script source path
        var resolvedScriptSource = path_1.resolve(basePath, scriptSource);
        var scriptSourceName = getPathName(resolvedScriptSource);
        // Determine if source should be replaced
        var replaceFile = void 0;
        for (var i = files.length - 1; i >= 0; i--) {
            var file = files[i];
            var resolvedFile = path_1.resolve(basePath, file.path);
            var fileName = getPathName(resolvedFile);
            if (scriptSourceName === fileName) {
                // Replace!
                replaceFile = path_1.relative(basePath, resolvedFile);
                // Remove file from files array
                files.splice(i, 1);
            }
        }
        if (replaceFile != null) {
            output += replaceFile.split(path_1.win32.sep).join(path_1.posix.sep);
        }
        else {
            output += scriptSource;
        }
        output += scriptSuffix;
        lastIndex = regex.lastIndex;
    }
    output += html.substring(lastIndex);
    return output;
}
function getBasePath(compilerOptions) {
    var base;
    if (compilerOptions.output && compilerOptions.output.path) {
        base = compilerOptions.output.path;
    }
    else if (compilerOptions.context) {
        base = compilerOptions.context;
    }
    else {
        base = __dirname;
    }
    return base;
}
function getPathName(filePath) {
    var parsedPath = path_1.parse(filePath);
    var dir = parsedPath.dir;
    while (parsedPath.ext.length > 0) {
        filePath = parsedPath.name;
        parsedPath = path_1.parse(filePath);
    }
    return path_1.join(dir, parsedPath.name);
}
