import postcss from 'postcss';
import webpack from 'webpack';
declare const _default: postcss.Plugin<ResourcesPlugin.PostcssCliResourcesOptions>;
export default _default;
declare namespace ResourcesPlugin {
    export interface PostcssCliResourcesOptions {
        baseHref: string;
        deployUrl: string;
        resourcesOutputPath: string;
        filename: string;
        loader: webpack.loader.LoaderContext;
    }
}
