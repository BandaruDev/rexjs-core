/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { compilation, Compiler } from 'webpack';

export interface RemoveHashPluginOptions {
  chunkNames: string[];
  hashFormat: any;
}

export class RemoveHashPlugin {

  constructor(private options: RemoveHashPluginOptions) { }

  public apply(compiler: Compiler): void {
    compiler.hooks.compilation.tap('remove-hash-plugin', compilations => {
      const mainTemplate = compilations.mainTemplate as compilation.MainTemplate & {
        hooks: compilation.CompilationHooks;
      };

      mainTemplate.hooks.assetPath.tap('remove-hash-plugin',
        (path: string, data: { chunk?: { name: string } }) => {
          const chunkName = data.chunk && data.chunk.name;
          const { chunkNames, hashFormat } = this.options;

          if (chunkName && chunkNames.includes(chunkName)) {
            // Replace hash formats with empty strings.
            return path
              .replace(hashFormat.chunk, '')
              .replace(hashFormat.extract, '');
          }

          return path;
        },
      );
    });
  }
}