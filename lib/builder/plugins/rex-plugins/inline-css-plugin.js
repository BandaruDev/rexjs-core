"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_REPLACE_CONFIG = {
    target: '</head>',
};
var InlineCssPlugin = /** @class */ (function () {
    function InlineCssPlugin(config) {
        if (config === void 0) { config = {}; }
        this.config = config;
        this.css = {};
        this.html = {};
    }
    InlineCssPlugin.addStyle = function (html, style, replaceConfig) {
        var styleString = "<style type=\"text/css\">" + style + "</style>";
        var replaceValues = [styleString, replaceConfig.target];
        if (replaceConfig.position === 'after') {
            replaceValues.reverse();
        }
        return html.replace(replaceConfig.target, replaceValues.join(''));
    };
    InlineCssPlugin.removeLinkTag = function (html, cssFileName) {
        return html.replace(new RegExp("<link[^>]+href=['\"]" + cssFileName + "['\"][^>]+(>|/>|></link>)"), '');
    };
    InlineCssPlugin.cleanUp = function (html, replaceConfig) {
        return replaceConfig.removeTarget ? html.replace(replaceConfig.target, '') : html;
    };
    InlineCssPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.hooks.emit.tapAsync('html-inline-css-webpack-plugin', function (compilation, callback) {
            _this.prepare(compilation);
            _this.process(compilation, compiler.options);
            callback();
        });
    };
    InlineCssPlugin.prototype.filter = function (fileName) {
        if (typeof this.config.filter === 'function') {
            return this.config.filter(fileName);
        }
        else {
            return true;
        }
    };
    InlineCssPlugin.prototype.prepare = function (_a) {
        var _this = this;
        var assets = _a.assets;
        var isCSS = is('css');
        var isHTML = is('html');
        var leaveCSSFile = this.config.leaveCSSFile;
        Object.keys(assets).forEach(function (fileName) {
            if (isCSS(fileName)) {
                var isCurrentFileNeedsToBeInlined = _this.filter(fileName);
                if (isCurrentFileNeedsToBeInlined) {
                    _this.css[fileName] = assets[fileName].source();
                    if (!leaveCSSFile) {
                        delete assets[fileName];
                    }
                }
            }
            else if (isHTML(fileName)) {
                _this.html[fileName] = assets[fileName].source();
            }
        });
    };
    InlineCssPlugin.prototype.process = function (_a, _b) {
        var _this = this;
        var assets = _a.assets;
        var output = _b.output;
        var publicPath = (output && output.publicPath) || '';
        var _c = this.config.replace, replaceConfig = _c === void 0 ? DEFAULT_REPLACE_CONFIG : _c;
        Object.keys(this.html).forEach(function (htmlFileName) {
            var html = _this.html[htmlFileName];
            Object.keys(_this.css).forEach(function (key) {
                html = InlineCssPlugin.addStyle(html, _this.css[key], replaceConfig);
                html = InlineCssPlugin.removeLinkTag(html, publicPath + key);
            });
            html = InlineCssPlugin.cleanUp(html, replaceConfig);
            assets[htmlFileName] = {
                source: function () {
                    return html;
                },
                size: function () {
                    return html.length;
                },
            };
        });
    };
    return InlineCssPlugin;
}());
exports.InlineCssPlugin = InlineCssPlugin;
function is(filenameExtension) {
    var reg = new RegExp("." + filenameExtension + "$");
    return function (fileName) { return reg.test(fileName); };
}
