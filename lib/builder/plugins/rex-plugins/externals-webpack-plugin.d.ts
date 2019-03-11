import { Compiler } from 'webpack';
export interface Scripts {
    stylesheet: Attributes[];
    javascript: Attributes[];
}
export declare type Attributes = {
    [attributeName: string]: string | boolean;
};
export declare class HtmlExternalsPlugin {
    private options;
    private headAssets;
    private bodyAssets;
    constructor(options: Scripts);
    apply(compiler: Compiler): void;
    private processStyleAttributes;
    private processScriptAttributes;
    private _generateSriAttributes;
}
