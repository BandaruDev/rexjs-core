import chalk from 'chalk';
import { Compiler, Stats } from 'webpack';
import { processJSON } from '../../../utils/format';

const NAME = 'webpack-messages';
const log = (str: any) => console.log(str);

export class WebpackMessages {
  public name: string;
  public onDone: (name?: string, stats?: any) => {};
  public logger: any;
  constructor(opts: { name?: any; onComplete?: any; logger?: any }) {
    opts = opts || {};
    this.name = opts.name;
    this.onDone = opts.onComplete;
    this.logger = opts.logger || log;
  }

  public printError(str: string, arr: any) {
    // tslint:disable-next-line: no-unused-expression
    arr && (str += '\n\n' + arr.join(''));
    this.logger(str);
  }

  public apply(compiler: Compiler) {
    const name = this.name ? ` ${chalk.cyan(this.name)} bundle` : '';
    const onStart = () => this.logger(`Building${name}...`);

    const onComplete = (stats: Stats) => {
      const messages = processJSON(stats.toJson());

      if (messages.errors.length) {
        return this.printError(chalk.red(`Failed to compile${name}!`), messages.errors);
      }

      if (messages.warnings.length) {
        return this.printError(chalk.yellow(`\nCompiled${name} with warnings.`), messages.warnings);
      }

      if (this.onDone !== undefined) {
        this.onDone(name, stats);
      } else {
        let sec = 0;
        if (stats.endTime !== undefined && stats.startTime !== undefined) {
          sec = (stats.endTime.valueOf() - stats.startTime.valueOf()) / 1e3;
        }
        this.logger(chalk.green(`\nCompleted${name} in ${sec}s!`));
      }
    };

    if (compiler.hooks !== void 0) {
      compiler.hooks.compile.tap(NAME, onStart);
      compiler.hooks.invalid.tap(NAME, _ => onStart());
      compiler.hooks.done.tap(NAME, onComplete);
    } else {
      compiler.plugin('compile', onStart);
      compiler.plugin('invalid', _ => onStart());
      compiler.plugin('done', onComplete);
    }
  }
}
