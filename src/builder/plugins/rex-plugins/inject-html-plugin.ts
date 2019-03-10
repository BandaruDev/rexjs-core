import HtmlWebpackPlugin, { Hooks } from 'html-webpack-plugin';
import { join, parse, ParsedPath, posix, relative, resolve, win32 } from 'path';
import webpack from 'webpack';

interface EntryObject {
  /** Webpack entry or chunk name */
  entryName: string;
  /** Entry or chunk path */
  path: string;
}

interface HtmlTagObject {
  /**
   * Attributes of the html tag
   * E.g. `{'disabled': true, 'value': 'demo'}`
   */
  attributes: {
    [attributeName: string]: string | boolean;
  };
  /**
   * Wether this html must not contain innerHTML
   * @see https://www.w3.org/TR/html5/syntax.html#void-elements
   */
  voidTag: boolean;
  /**
   * The tag name e.g. `'div'`
   */
  tagName: string;
  /**
   * Inner HTML The
   */
  innerHTML?: string;
}

const pluginName = 'ReplaceUrlHtmlWebpackPlugin';

/**
 *
 */
export class ReplaceUrlHtmlWebpackPlugin {
  /**
   * @override
   */
  public apply(compiler: webpack.Compiler): void {
    const compilerOptions: webpack.Configuration = compiler.options;
    compiler.hooks.compilation.tap(pluginName, (compilation: webpack.compilation.Compilation) => {
      (compilation.hooks as Hooks).htmlWebpackPluginBeforeHtmlProcessing.tap(pluginName, data => {
        // Replace asset elements in HTML
        data.plugin = ReplaceUrlHtmlWebpackPlugin;
        const assets = data.assets;
        const jsFiles = assets.js;
        const cssFiles = assets.css;
        let html: string = data.html;
        html = replaceJS(html, jsFiles, compilerOptions);
        html = replaceCSS(html, cssFiles, compilerOptions);
        // Remove chunks that were removed
        const chunks = compilation.chunkGroups;
        for (const chunkName in chunks) {
          if (chunks.hasOwnProperty(chunkName)) {
            const chunk = chunks[chunkName];
            if (jsFiles.indexOf(chunk.entry) < 0) {
              delete chunks[chunkName];
            }
          }
        }
        // Assign HTML back to data object
        data.html = html;
        // Return data object
        return data;
      });
    });
  }
}
function replaceJS(html: string, jsFiles: EntryObject[], compilerOptions: webpack.Configuration): string {
  return replace(html, jsFiles, compilerOptions, /(<script[\S\s]*?src=['"])(.+?)(['"][^>]*?>)/gi);
}

function replaceCSS(html: string, cssFiles: EntryObject[], compilerOptions: webpack.Configuration): string {
  return replace(html, cssFiles, compilerOptions, /(<link[\S\s]*?href=['"])(.+?)(['"][^>]*?>)/gi);
}

function replace(html: string, files: EntryObject[], compilerOptions: webpack.Configuration, regex: RegExp): string {
  const basePath: string = getBasePath(compilerOptions);
  let output: string = '';
  let lastIndex: number = 0;
  let result: RegExpExecArray | null;
  // tslint:disable-next-line: no-conditional-assignment
  while ((result = regex.exec(html)) !== null) {
    const scriptPrefix: string = result[1];
    const scriptSource: string = result[2];
    const scriptSuffix: string = result[3];

    output += html.substring(lastIndex, result.index);
    output += scriptPrefix;

    // Resolve script source path
    const resolvedScriptSource: string = resolve(basePath, scriptSource);
    const scriptSourceName: string = getPathName(resolvedScriptSource);

    // Determine if source should be replaced
    let replaceFile: string | undefined;
    for (let i = files.length - 1; i >= 0; i--) {
      const file: EntryObject = files[i];
      const resolvedFile: string = resolve(basePath, file.path);
      const fileName: string = getPathName(resolvedFile);
      if (scriptSourceName === fileName) {
        // Replace!
        replaceFile = relative(basePath, resolvedFile);
        // Remove file from files array
        files.splice(i, 1);
      }
    }
    if (replaceFile != null) {
      output += replaceFile.split(win32.sep).join(posix.sep);
    } else {
      output += scriptSource;
    }

    output += scriptSuffix;

    lastIndex = regex.lastIndex;
  }
  output += html.substring(lastIndex);
  return output;
}

function getBasePath(compilerOptions: webpack.Configuration): string {
  let base: string;
  if (compilerOptions.output && compilerOptions.output.path) {
    base = compilerOptions.output.path;
  } else if (compilerOptions.context) {
    base = compilerOptions.context;
  } else {
    base = __dirname;
  }
  return base;
}

function getPathName(filePath: string): string {
  let parsedPath: ParsedPath = parse(filePath);
  const dir: string = parsedPath.dir;
  while (parsedPath.ext.length > 0) {
    filePath = parsedPath.name;
    parsedPath = parse(filePath);
  }
  return join(dir, parsedPath.name);
}
