"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var PLUGIN = 'HtmlExternalsPlugin';
var HtmlExternalsPlugin = /** @class */ (function () {
    function HtmlExternalsPlugin(options) {
        this.options = options;
        this.headAssets = [];
        this.bodyAssets = [];
        if (this.options) {
            this.headAssets = this.processStyleAttributes(this.options);
            this.bodyAssets = this.processScriptAttributes(this.options);
        }
    }
    HtmlExternalsPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.hooks.compilation.tap(PLUGIN, function (compilations) {
            compilations.hooks.htmlWebpackPluginAlterAssetTags.tap(PLUGIN, function (data) {
                var _a, _b;
                (_a = data.head).push.apply(_a, _this.headAssets);
                (_b = data.body).push.apply(_b, _this.bodyAssets);
                // data.body.map(s => console.log(`body:`, s.attributes));
                // data.head.map(s => console.log(`head:`, s.attributes));
                return data;
            });
        });
    };
    HtmlExternalsPlugin.prototype.processStyleAttributes = function (scripts) {
        var _this = this;
        if (scripts.stylesheet.length > 0) {
            scripts.stylesheet.forEach(function (styles) {
                var headAssets = {
                    attributes: styles,
                    voidTag: true,
                    tagName: 'link',
                };
                _this.headAssets.push(headAssets);
            });
        }
        return this.headAssets;
    };
    HtmlExternalsPlugin.prototype.processScriptAttributes = function (scripts) {
        var _this = this;
        if (scripts.javascript.length > 0) {
            scripts.javascript.forEach(function (script) {
                var bodyAssets = {
                    attributes: script,
                    voidTag: false,
                    tagName: 'script',
                };
                _this.bodyAssets.push(bodyAssets);
            });
        }
        return this.bodyAssets;
    };
    HtmlExternalsPlugin.prototype._generateSriAttributes = function (content) {
        var algo = 'sha384';
        var hash = crypto_1.createHash(algo)
            .update(content, 'utf8')
            .digest('base64');
        return [{ name: 'integrity', value: algo + "-" + hash }, { name: 'crossorigin', value: 'anonymous' }];
    };
    return HtmlExternalsPlugin;
}());
exports.HtmlExternalsPlugin = HtmlExternalsPlugin;
