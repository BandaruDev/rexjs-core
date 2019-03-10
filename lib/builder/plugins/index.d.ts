export * from './rex-plugins';
export * from './thirdparty';
import webpack from 'webpack';
/**
 *
 * @param plugins
 */
export declare function registerPlugins(plugins: webpack.Plugin[]): webpack.Plugin[];
/**
 *
 */
export declare const RexPlugins: webpack.Plugin[];
