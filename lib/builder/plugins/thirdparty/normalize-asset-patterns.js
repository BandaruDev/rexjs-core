"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const fs_1 = require("fs");
const path_1 = require("path");
function isDirectory(params) {
    const stats = fs_1.statSync(params);
    if (!stats.isDirectory()) {
        return false;
    }
    return true;
}
exports.isDirectory = isDirectory;
function normalizeAssetPatterns(assetPatterns, root, projectRoot, maybeSourceRoot) {
    // When sourceRoot is not available, we default to ${projectRoot}/src.
    const sourceRoot = maybeSourceRoot || path_1.join(projectRoot, 'src');
    const resolvedSourceRoot = path_1.resolve(root, sourceRoot);
    if (assetPatterns.length === 0) {
        return [];
    }
    return assetPatterns;
    // return assetPatterns
    //     .map(assetPattern => {
    //         // Normalize string asset patterns to objects.
    //         if (typeof assetPattern === 'string') {
    //             const assetPath = normalize(assetPattern);
    //             const resolvedAssetPath = resolve(root, assetPath);
    //             // Check if the string asset is within sourceRoot.
    //             if (!resolvedAssetPath.startsWith(resolvedSourceRoot)) {
    //                 throw new Error(`The ${assetPattern} asset path must start with the project source root.`);
    //             }
    //             let isFolder = false;
    //             try {
    //                 isFolder = isDirectory(resolvedAssetPath);
    //             } catch {
    //                 isFolder = true;
    //             }
}
exports.normalizeAssetPatterns = normalizeAssetPatterns;
