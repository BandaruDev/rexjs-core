"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DEFAULT_REPLACE_CONFIG = {
    target: '</head>',
};
class InlineCssPlugin {
    constructor(config = {}) {
        this.config = config;
        this.css = {};
        this.html = {};
    }
    static addStyle(html, style, replaceConfig) {
        const styleString = `<style type="text/css">${style}</style>`;
        const replaceValues = [styleString, replaceConfig.target];
        if (replaceConfig.position === 'after') {
            replaceValues.reverse();
        }
        return html.replace(replaceConfig.target, replaceValues.join(''));
    }
    static removeLinkTag(html, cssFileName) {
        return html.replace(new RegExp(`<link[^>]+href=['"]${cssFileName}['"][^>]+(>|\/>|><\/link>)`), '');
    }
    static cleanUp(html, replaceConfig) {
        return replaceConfig.removeTarget ? html.replace(replaceConfig.target, '') : html;
    }
    apply(compiler) {
        compiler.hooks.emit.tapAsync('html-inline-css-webpack-plugin', (compilation, callback) => {
            this.prepare(compilation);
            this.process(compilation, compiler.options);
            callback();
        });
    }
    filter(fileName) {
        if (typeof this.config.filter === 'function') {
            return this.config.filter(fileName);
        }
        else {
            return true;
        }
    }
    prepare({ assets }) {
        const isCSS = is('css');
        const isHTML = is('html');
        const { leaveCSSFile } = this.config;
        Object.keys(assets).forEach(fileName => {
            if (isCSS(fileName)) {
                const isCurrentFileNeedsToBeInlined = this.filter(fileName);
                if (isCurrentFileNeedsToBeInlined) {
                    this.css[fileName] = assets[fileName].source();
                    if (!leaveCSSFile) {
                        delete assets[fileName];
                    }
                }
            }
            else if (isHTML(fileName)) {
                this.html[fileName] = assets[fileName].source();
            }
        });
    }
    process({ assets }, { output }) {
        const publicPath = (output && output.publicPath) || '';
        const { replace: replaceConfig = DEFAULT_REPLACE_CONFIG } = this.config;
        Object.keys(this.html).forEach(htmlFileName => {
            let html = this.html[htmlFileName];
            Object.keys(this.css).forEach(key => {
                html = InlineCssPlugin.addStyle(html, this.css[key], replaceConfig);
                html = InlineCssPlugin.removeLinkTag(html, publicPath + key);
            });
            html = InlineCssPlugin.cleanUp(html, replaceConfig);
            assets[htmlFileName] = {
                source() {
                    return html;
                },
                size() {
                    return html.length;
                },
            };
        });
    }
}
exports.InlineCssPlugin = InlineCssPlugin;
function is(filenameExtension) {
    const reg = new RegExp(`\.${filenameExtension}$`);
    return (fileName) => reg.test(fileName);
}
