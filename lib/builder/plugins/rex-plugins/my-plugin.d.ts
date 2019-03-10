import { Compiler } from 'webpack';
declare type MyOptions = {
    app_name: string;
    devStart?: string;
    devEnd?: string;
    developer?: string;
};
export declare class AuthorPlugin {
    private readonly options;
    constructor(options?: MyOptions);
    apply(compiler: Compiler): void;
}
export {};
