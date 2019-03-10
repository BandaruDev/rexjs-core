"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RemoveHashPlugin = /** @class */ (function () {
    function RemoveHashPlugin(options) {
        this.options = options;
    }
    RemoveHashPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.hooks.compilation.tap('remove-hash-plugin', function (compilations) {
            var mainTemplate = compilations.mainTemplate;
            mainTemplate.hooks.assetPath.tap('remove-hash-plugin', function (path, data) {
                var chunkName = data.chunk && data.chunk.name;
                var _a = _this.options, chunkNames = _a.chunkNames, hashFormat = _a.hashFormat;
                if (chunkName && chunkNames.includes(chunkName)) {
                    // Replace hash formats with empty strings.
                    return path
                        .replace(hashFormat.chunk, '')
                        .replace(hashFormat.extract, '');
                }
                return path;
            });
        });
    };
    return RemoveHashPlugin;
}());
exports.RemoveHashPlugin = RemoveHashPlugin;
