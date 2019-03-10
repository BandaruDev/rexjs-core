import { Compiler } from 'webpack';
interface ReplaceConfig {
    position?: 'before' | 'after';
    removeTarget?: boolean;
    target: string;
}
interface Config {
    leaveCSSFile?: boolean;
    replace?: ReplaceConfig;
    filter?(fileName: string): boolean;
}
export declare class InlineCssPlugin {
    private readonly config;
    static addStyle(html: string, style: string, replaceConfig: ReplaceConfig): string;
    static removeLinkTag(html: string, cssFileName: string): string;
    static cleanUp(html: string, replaceConfig: ReplaceConfig): string;
    private css;
    private html;
    constructor(config?: Config);
    apply(compiler: Compiler): void;
    private filter;
    private prepare;
    private process;
}
export {};
