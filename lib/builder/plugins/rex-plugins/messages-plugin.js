"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const format_1 = require("../../../utils/format");
const NAME = 'webpack-messages';
const log = (str) => console.log(str);
class WebpackMessages {
    constructor(opts) {
        opts = opts || {};
        this.name = opts.name;
        this.onDone = opts.onComplete;
        this.logger = opts.logger || log;
    }
    printError(str, arr) {
        // tslint:disable-next-line: no-unused-expression
        arr && (str += '\n\n' + arr.join(''));
        this.logger(str);
    }
    apply(compiler) {
        const name = this.name ? ` ${chalk_1.default.cyan(this.name)} bundle` : '';
        const onStart = () => this.logger(`Building${name}...`);
        const onComplete = (stats) => {
            const messages = format_1.processJSON(stats.toJson());
            if (messages.errors.length) {
                return this.printError(chalk_1.default.red(`Failed to compile${name}!`), messages.errors);
            }
            if (messages.warnings.length) {
                return this.printError(chalk_1.default.yellow(`\nCompiled${name} with warnings.`), messages.warnings);
            }
            if (this.onDone !== undefined) {
                this.onDone(name, stats);
            }
            else {
                let sec = 0;
                if (stats.endTime !== undefined && stats.startTime !== undefined) {
                    sec = (stats.endTime.valueOf() - stats.startTime.valueOf()) / 1e3;
                }
                this.logger(chalk_1.default.green(`\nCompleted${name} in ${sec}s!`));
            }
        };
        if (compiler.hooks !== void 0) {
            compiler.hooks.compile.tap(NAME, onStart);
            compiler.hooks.invalid.tap(NAME, _ => onStart());
            compiler.hooks.done.tap(NAME, onComplete);
        }
        else {
            compiler.plugin('compile', onStart);
            compiler.plugin('invalid', _ => onStart());
            compiler.plugin('done', onComplete);
        }
    }
}
exports.WebpackMessages = WebpackMessages;
