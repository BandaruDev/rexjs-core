"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const PLUGIN = 'HtmlExternalsPlugin';
class HtmlExternalsPlugin {
    constructor(options) {
        this.options = options;
        this.headAssets = [];
        this.bodyAssets = [];
        if (this.options) {
            this.headAssets = this.processStyleAttributes(this.options);
            this.bodyAssets = this.processScriptAttributes(this.options);
        }
    }
    apply(compiler) {
        compiler.hooks.compilation.tap(PLUGIN, (compilations) => {
            compilations.hooks.htmlWebpackPluginAlterAssetTags.tap(PLUGIN, data => {
                data.head.push(...this.headAssets);
                data.body.push(...this.bodyAssets);
                // data.body.map(s => console.log(`body:`, s.attributes));
                // data.head.map(s => console.log(`head:`, s.attributes));
                return data;
            });
        });
    }
    processStyleAttributes(scripts) {
        if (scripts.stylesheet.length > 0) {
            scripts.stylesheet.forEach(styles => {
                const headAssets = {
                    attributes: styles,
                    voidTag: true,
                    tagName: 'link',
                };
                this.headAssets.push(headAssets);
            });
        }
        return this.headAssets;
    }
    processScriptAttributes(scripts) {
        if (scripts.javascript.length > 0) {
            scripts.javascript.forEach(script => {
                const bodyAssets = {
                    attributes: script,
                    voidTag: false,
                    tagName: 'script',
                };
                this.bodyAssets.push(bodyAssets);
            });
        }
        return this.bodyAssets;
    }
    _generateSriAttributes(content) {
        const algo = 'sha384';
        const hash = crypto_1.createHash(algo)
            .update(content, 'utf8')
            .digest('base64');
        return [{ name: 'integrity', value: `${algo}-${hash}` }, { name: 'crossorigin', value: 'anonymous' }];
    }
}
exports.HtmlExternalsPlugin = HtmlExternalsPlugin;
