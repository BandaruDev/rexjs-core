"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var format_1 = require("../../../utils/format");
var NAME = 'webpack-messages';
var log = function (str) { return console.log(str); };
var WebpackMessages = /** @class */ (function () {
    function WebpackMessages(opts) {
        opts = opts || {};
        this.name = opts.name;
        this.onDone = opts.onComplete;
        this.logger = opts.logger || log;
    }
    WebpackMessages.prototype.printError = function (str, arr) {
        // tslint:disable-next-line: no-unused-expression
        arr && (str += '\n\n' + arr.join(''));
        this.logger(str);
    };
    WebpackMessages.prototype.apply = function (compiler) {
        var _this = this;
        var name = this.name ? " " + chalk_1.default.cyan(this.name) + " bundle" : '';
        var onStart = function () { return _this.logger("Building" + name + "..."); };
        var onComplete = function (stats) {
            var messages = format_1.processJSON(stats.toJson());
            if (messages.errors.length) {
                return _this.printError(chalk_1.default.red("Failed to compile" + name + "!"), messages.errors);
            }
            if (messages.warnings.length) {
                return _this.printError(chalk_1.default.yellow("\nCompiled" + name + " with warnings."), messages.warnings);
            }
            if (_this.onDone !== undefined) {
                _this.onDone(name, stats);
            }
            else {
                var sec = 0;
                if (stats.endTime !== undefined && stats.startTime !== undefined) {
                    sec = (stats.endTime.valueOf() - stats.startTime.valueOf()) / 1e3;
                }
                _this.logger(chalk_1.default.green("\nCompleted" + name + " in " + sec + "s!"));
            }
        };
        if (compiler.hooks !== void 0) {
            compiler.hooks.compile.tap(NAME, onStart);
            compiler.hooks.invalid.tap(NAME, function (_) { return onStart(); });
            compiler.hooks.done.tap(NAME, onComplete);
        }
        else {
            compiler.plugin('compile', onStart);
            compiler.plugin('invalid', function (_) { return onStart(); });
            compiler.plugin('done', onComplete);
        }
    };
    return WebpackMessages;
}());
exports.WebpackMessages = WebpackMessages;
