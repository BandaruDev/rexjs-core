import { createHash } from 'crypto';
import { Hooks } from 'html-webpack-plugin';
import { compilation, Compiler } from 'webpack';

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

export interface Scripts {
  stylesheet: Attributes[];
  javascript: Attributes[];
}

export type Attributes = { [attributeName: string]: string | boolean };

const PLUGIN = 'HtmlExternalsPlugin';

export class HtmlExternalsPlugin {
  private headAssets: HtmlTagObject[] = [];
  private bodyAssets: HtmlTagObject[] = [];

  constructor(private options: Scripts) {
    if (this.options) {
      this.headAssets = this.processStyleAttributes(this.options);
      this.bodyAssets = this.processScriptAttributes(this.options);
    }
  }

  public apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(PLUGIN, (compilations: compilation.Compilation) => {
      (compilations.hooks as Hooks).htmlWebpackPluginAlterAssetTags.tap(PLUGIN, data => {
        data.head.push(...this.headAssets);
        data.body.push(...this.bodyAssets);
        // data.body.map(s => console.log(`body:`, s.attributes));
        // data.head.map(s => console.log(`head:`, s.attributes));
        return data;
      });
    });
  }
  private processStyleAttributes(scripts: Scripts): HtmlTagObject[] {
    if (scripts.stylesheet.length > 0) {
      scripts.stylesheet.forEach(styles => {
        const headAssets: HtmlTagObject = {
          attributes: styles,
          voidTag: true,
          tagName: 'link',
        };
        this.headAssets.push(headAssets);
      });
    }
    return this.headAssets;
  }
  private processScriptAttributes(scripts: Scripts): HtmlTagObject[] {
    if (scripts.javascript.length > 0) {
      scripts.javascript.forEach(script => {
        const bodyAssets: HtmlTagObject = {
          attributes: script,
          voidTag: false,
          tagName: 'script',
        };
        this.bodyAssets.push(bodyAssets);
      });
    }
    return this.bodyAssets;
  }
  private _generateSriAttributes(content: string) {
    const algo = 'sha384';
    const hash = createHash(algo)
      .update(content, 'utf8')
      .digest('base64');

    return [{ name: 'integrity', value: `${algo}-${hash}` }, { name: 'crossorigin', value: 'anonymous' }];
  }
}
