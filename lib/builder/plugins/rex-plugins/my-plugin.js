"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var path_1 = require("path");
var PluginNAME = 'webpack-inject-plugin.loader';
function getUniqueID() {
    var id = crypto_1.randomBytes(2).toString('hex');
    return "webpack-inject-module-" + id;
}
var AuthorPlugin = /** @class */ (function () {
    function AuthorPlugin(options) {
        this.options = {
            app_name: 'New-React-App'
        };
        if (options) {
            this.options = {
                app_name: options.app_name,
            };
        }
    }
    AuthorPlugin.prototype.apply = function (compiler) {
        var _this = this;
        var id = getUniqueID();
        var newEntry = path_1.default.resolve(__dirname, PluginNAME + "?id=" + id + "!");
        compiler.hooks.beforeCompile.tap(PluginNAME, function () {
            console.log(_this.options.app_name);
        });
    };
    return AuthorPlugin;
}());
exports.AuthorPlugin = AuthorPlugin;
