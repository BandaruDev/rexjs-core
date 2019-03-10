import { Compiler, Configuration } from 'webpack';

type File = {
    [key: string]: string
}

type Asset = {
    source(): string
    size(): number
}

interface Compilation {
    assets: { [key: string]: Asset }
}

interface ReplaceConfig {
    position?: 'before' | 'after'
    removeTarget?: boolean
    target: string
}

interface Config {
    leaveCSSFile?: boolean
    replace?: ReplaceConfig
    filter?(fileName: string): boolean
}

const DEFAULT_REPLACE_CONFIG: ReplaceConfig = {
    target: '</head>',
}

export class InlineCssPlugin {
    public static addStyle(html: string, style: string, replaceConfig: ReplaceConfig) {
        const styleString = `<style type="text/css">${style}</style>`
        const replaceValues = [styleString, replaceConfig.target]
        if (replaceConfig.position === 'after') {
            replaceValues.reverse()
        }
        return html.replace(replaceConfig.target, replaceValues.join(''))
    }
    public static removeLinkTag(html: string, cssFileName: string) {
        return html.replace(
            new RegExp(`<link[^>]+href=['"]${cssFileName}['"][^>]+(>|\/>|><\/link>)`),
            '',
        )
    }
    public static cleanUp(html: string, replaceConfig: ReplaceConfig) {
        return replaceConfig.removeTarget
            ? html.replace(replaceConfig.target, '')
            : html
    }
    private css: File = {}
    private html: File = {}

    constructor(private readonly config: Config = {}) { }

    public apply(compiler: Compiler) {
        compiler.hooks.emit.tapAsync(
            'html-inline-css-webpack-plugin',
            (compilation: Compilation, callback: () => void) => {
                this.prepare(compilation)
                this.process(compilation, compiler.options)
                callback()
            },
        )
    }

    private filter(fileName: string): boolean {
        if (typeof this.config.filter === 'function') {
            return this.config.filter(fileName)
        } else {
            return true
        }
    }

    private prepare({ assets }: Compilation) {
        const isCSS = is('css')
        const isHTML = is('html')
        const { leaveCSSFile } = this.config

        Object.keys(assets).forEach((fileName) => {
            if (isCSS(fileName)) {
                const isCurrentFileNeedsToBeInlined = this.filter(fileName)
                if (isCurrentFileNeedsToBeInlined) {
                    this.css[fileName] = assets[fileName].source()
                    if (!leaveCSSFile) {
                        delete assets[fileName]
                    }
                }
            } else if (isHTML(fileName)) {
                this.html[fileName] = assets[fileName].source()
            }
        })
    }

    private process({ assets }: Compilation, { output }: Configuration) {
        const publicPath = (output && output.publicPath) || ''
        const { replace: replaceConfig = DEFAULT_REPLACE_CONFIG } = this.config

        Object.keys(this.html).forEach((htmlFileName) => {
            let html = this.html[htmlFileName]

            Object.keys(this.css).forEach((key) => {
                html = InlineCssPlugin.addStyle(html, this.css[key], replaceConfig)
                html = InlineCssPlugin.removeLinkTag(html, publicPath + key)
            })

            html = InlineCssPlugin.cleanUp(html, replaceConfig)

            assets[htmlFileName] = {
                source() {
                    return html
                },
                size() {
                    return html.length
                },
            }
        })
    }
}

function is(filenameExtension: string) {
    const reg = new RegExp(`\.${filenameExtension}$`)
    return (fileName: string) => reg.test(fileName)
}