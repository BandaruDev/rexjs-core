/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { statSync } from 'fs';
import { basename, dirname, join, normalize, relative, resolve } from 'path';

type Path = string;

export function isDirectory(params: Path): boolean {
  const stats = statSync(params);
  if (!stats.isDirectory()) {
    return false;
  }
  return true;
}

export function normalizeAssetPatterns(
  assetPatterns: string[],
  root: string,
  projectRoot: string,
  maybeSourceRoot: string | undefined,
): string[] {
  // When sourceRoot is not available, we default to ${projectRoot}/src.
  const sourceRoot = maybeSourceRoot || join(projectRoot, 'src');
  const resolvedSourceRoot = resolve(root, sourceRoot);

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
