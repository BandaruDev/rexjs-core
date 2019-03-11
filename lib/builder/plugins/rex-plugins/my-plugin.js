"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const path_1 = __importDefault(require("path"));
const PluginNAME = 'webpack-inject-plugin.loader';
function getUniqueID() {
    const id = crypto_1.randomBytes(2).toString('hex');
    return `webpack-inject-module-${id}`;
}
class AuthorPlugin {
    constructor(options) {
        this.options = {
            app_name: 'New-React-App',
        };
        if (options) {
            this.options = {
                app_name: options.app_name,
            };
        }
    }
    apply(compiler) {
        const id = getUniqueID();
        const newEntry = path_1.default.resolve(__dirname, `${PluginNAME}?id=${id}!`);
        compiler.hooks.beforeCompile.tap(PluginNAME, () => {
            console.log(this.options.app_name);
        });
    }
}
exports.AuthorPlugin = AuthorPlugin;
