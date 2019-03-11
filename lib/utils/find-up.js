"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// tslint:disable
// TODO: cleanup this file, it's copied as is from Angular CLI.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
function findUp(names, from, stopOnNodeModules = false) {
    if (!Array.isArray(names)) {
        names = [names];
    }
    const root = path_1.default.parse(from).root;
    let currentDir = from;
    while (currentDir && currentDir !== root) {
        for (const name of names) {
            const p = path_1.default.join(currentDir, name);
            if (fs_1.existsSync(p)) {
                return p;
            }
        }
        if (stopOnNodeModules) {
            const nodeModuleP = path_1.default.join(currentDir, 'node_modules');
            if (fs_1.existsSync(nodeModuleP)) {
                return null;
            }
        }
        currentDir = path_1.default.dirname(currentDir);
    }
    return null;
}
exports.findUp = findUp;
