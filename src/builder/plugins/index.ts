export * from './rex-plugins';
export * from './thirdparty';
import { ContextReplacementPlugin, Plugin } from 'webpack';

/**
 *
 * @param plugins
 */
export function registerPlugins(plugins: Plugin[]): Plugin[] {
  const rexPlugins: Plugin[] = [];
  plugins.forEach(plugin => rexPlugins.push(plugin));
  return rexPlugins;
}
/**
 *
 */
export const RexPlugins = registerPlugins([
  new ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
  // new webpack.DefinePlugin({
  //     PRODUCTION: JSON.stringify(true),
  //     budget: JSON.stringify('5fa3b9'),
  //     BROWSER_SUPPORTS_HTML5: true,
  //     TWO: '1+1',
  //     'typeof window': JSON.stringify('object'),
  //     'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  // }),
  // new WebpackMessages({
  //     name: 'app',
  //     logger: (str: any) => console.log(`${str}`)
  // })
]);
