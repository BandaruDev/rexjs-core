/// <reference types="webpack-dev-server" />
import webpack from 'webpack';
import { RexBuildOptions } from '../core';
export declare function addLiveReload(webpackconfig: webpack.Configuration, options: RexBuildOptions, clientAddress: string): void;
