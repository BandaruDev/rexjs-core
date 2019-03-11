export * from './rex-plugins';
export * from './thirdparty';
import { Plugin } from 'webpack';
/**
 *
 * @param plugins
 */
export declare function registerPlugins(plugins: Plugin[]): Plugin[];
/**
 *
 */
export declare const RexPlugins: Plugin[];
