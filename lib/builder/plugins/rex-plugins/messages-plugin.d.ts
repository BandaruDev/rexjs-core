import { Compiler } from 'webpack';
export declare class WebpackMessages {
    name: string;
    onDone: (name?: string, stats?: any) => {};
    logger: any;
    constructor(opts: {
        name?: any;
        onComplete?: any;
        logger?: any;
    });
    printError(str: string, arr: any): void;
    apply(compiler: Compiler): void;
}
