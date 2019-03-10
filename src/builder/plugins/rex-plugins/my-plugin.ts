import { randomBytes } from 'crypto';
import path from 'path';
import { Compiler, Entry, EntryFunc } from 'webpack';

type MyOptions = {
    app_name: string;
    devStart?: string;
    devEnd?: string;
    developer?: string;
}

const PluginNAME = 'webpack-inject-plugin.loader';

function getUniqueID() {
    const id = randomBytes(2).toString('hex');
    return `webpack-inject-module-${id}`;
}


export class AuthorPlugin {
    private readonly options: MyOptions = {
        app_name: 'New-React-App'
    };

    constructor(options?: MyOptions) {
        if (options) {
            this.options = {
                app_name: options.app_name,
            };
        }

    }

    public apply(compiler: Compiler) {
        const id = getUniqueID();
        const newEntry = path.resolve(__dirname, `${PluginNAME}?id=${id}!`);
        compiler.hooks.beforeCompile.tap(PluginNAME, () => {
            console.log(this.options.app_name)
        })
    }
}