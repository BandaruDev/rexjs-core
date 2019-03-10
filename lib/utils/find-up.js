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
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
function findUp(names, from, stopOnNodeModules) {
    if (stopOnNodeModules === void 0) { stopOnNodeModules = false; }
    if (!Array.isArray(names)) {
        names = [names];
    }
    var root = path_1.default.parse(from).root;
    var currentDir = from;
    while (currentDir && currentDir !== root) {
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_1 = names_1[_i];
            var p = path_1.default.join(currentDir, name_1);
            if (fs_1.existsSync(p)) {
                return p;
            }
        }
        if (stopOnNodeModules) {
            var nodeModuleP = path_1.default.join(currentDir, 'node_modules');
            if (fs_1.existsSync(nodeModuleP)) {
                return null;
            }
        }
        currentDir = path_1.default.dirname(currentDir);
    }
    return null;
}
exports.findUp = findUp;
