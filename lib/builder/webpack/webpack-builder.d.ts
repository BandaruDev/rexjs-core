/// <reference types="webpack-dev-server" />
import webpack from 'webpack';
import { RexBuildOptions } from '../../core/rex.config';
export declare const inDevelopment: boolean;
export declare const tsconfig: string;
/**
 * The main configuration
 */
export declare function webpack_bundler(rexbuildoptions: RexBuildOptions): webpack.Configuration;
