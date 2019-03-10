export interface RexBuildOptions {
    version: number;
    project: Project;
    configuration: Configuration;
}
export interface Configuration {
    target: string;
    styleext: string;
    outputPath: string;
    main: string;
    index: string;
    polyfills: string;
    tsConfig: string;
    hmr?: boolean;
    ssl?: boolean;
    liveReload?: boolean;
    linting: string;
    optimization: boolean;
    outputHashing: string;
    sourceMap: boolean;
    extractCss: boolean;
    namedChunks: boolean;
    vendorChunk: boolean;
    progress: boolean;
    buildOptimizer: boolean;
    assets: string[];
    styles: string[];
    scripts: string[];
    pwa?: PWA;
    svgOptions?: SvgOptions;
    externals: Scripts;
    budgets: Budget[];
}
export interface PWA {
    sw: string;
}
export interface SvgOptions {
    optimize: boolean;
    useSprite: boolean;
    useInline: boolean;
}
export interface Budget {
    type: string;
    maximumWarning: string;
    maximumError: string;
}
export interface Scripts {
    stylesheet: Attributes[];
    javascript: Attributes[];
}
export declare type Attributes = {
    [attributeName: string]: string | boolean;
};
export interface Project {
    root: string;
    sourceRoot: string;
}
export declare function rexBuild(): Promise<RexBuildOptions>;
