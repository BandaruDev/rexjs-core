
import path, { resolve } from 'path';
import webpack, { HashedModuleIdsPlugin, ProgressPlugin, RuleSetRule } from 'webpack';

import CopyWebpackPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin, { MinifyOptions, Options} from 'html-webpack-plugin';
import MiniExtractCssPlugin from 'mini-css-extract-plugin';
import TerserPlugin, { TerserPluginOptions } from 'terser-webpack-plugin';

import { RexBuildOptions } from '../../core/rex.config';
import { ScriptsWebpackPlugin } from '../plugins/thirdparty/scripts-webpack-plugin';

import { HtmlExternalsPlugin } from '../plugins/rex-plugins/externals-webpack-plugin';
import { ReplaceUrlHtmlWebpackPlugin } from '../plugins/rex-plugins/inject-html-plugin';
import { InlineCssPlugin } from '../plugins/rex-plugins/inline-css-plugin';

import { RexLoaders } from '../loaders';
import { RexPlugins } from '../plugins';


// const LicenseWebpackPlugin = require('license-webpack-plugin').LicenseWebpackPlugin;
// const SubresourceIntegrityPlugin = require('webpack-subresource-integrity');

// **************************************************** //

export const inDevelopment = process.env.NODE_ENV !== 'production';

export const tsconfig = resolve('tsconfig.json');

/**
 * The main configuration
 */
export function webpack_bundler(rexbuildoptions: RexBuildOptions): webpack.Configuration {
 const { configuration, project , version } = rexbuildoptions;
 const { root, sourceRoot } = project;
 const {
   index,
   main,
   outputPath,
   styleext,
   pwa,
   styles,
   scripts,
   assets,
   progress,
   extractCss,
   externals,
   svgOptions,
   optimization,
   buildOptimizer,
   outputHashing
 } = configuration;

  const entryPoints: { [key: string]: string[] } = {};

  const favicon = resolve(root, `${sourceRoot}/favicon.ico`);
  // determine hashing format
  const hashFormat = outputHashing || 'none';
  
  const HtmlMinifyOptions: MinifyOptions = {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
};
  const HtmlPluginOptions: Options = {
    template: resolve(root, index),
    inject: true,
    favicon,
    meta: {
      'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no',
      // Will generate: <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      'theme-color': '#4285f4',
      // Will generate: <meta name="theme-color" content="#4285f4">
      // see  https://developers.google.com/web/fundamentals/security/csp/
      'Content-Security-Policy': {
        'http-equiv': 'Content-Security-Policy',
        'content': `default-src 'self' https://* ;script-src 'self' https://* ;connect-src 'self';img-src 'self' https://*;media-src 'self' https://*;
         style-src 'self' 'unsafe-inline';`
      },
      
      // Will generate: <meta http-equiv="Content-Security-Policy" content="default-src https:">
      // Which equals to the following http header: `Content-Security-Policy: default-src https:`
      // 'set-cookie': { 'http-equiv': 'set-cookie', content: 'name=value; expires=date; path=url' },
      // Will generate: <meta http-equiv="set-cookie" content="value; expires=date; path=url">
      // Which equals to the following http header: `set-cookie: value; expires=date; path=url`
    },
    minify: HtmlMinifyOptions
  };


  RexPlugins.push(
    new HtmlWebpackPlugin(HtmlPluginOptions),
  );
  if (main) {
    // entryPoints['wds'] = ['webpack-dev-server/client?http://localhost:8080'];
    // entryPoints['hot'] =['webpack/hot/only-dev-server']
    entryPoints.main = [resolve(root, main)];
  };
  if (styles) {
    styles.map(style =>
      entryPoints.styles = [resolve(root, style)]
    );
  };
  if (assets) {
    assets.forEach(asset => {
      // Resolve input paths relative to workspace root and add slash at the end.
      asset = path.resolve(root, asset).replace(/\\/g, '/');
      asset = asset.endsWith('/') ? asset : asset + '/';
      asset = asset.endsWith('/') ? asset : asset + '/';

      if (asset.startsWith('..')) {
        const message = 'An asset cannot be written to a location outside of the output path.';
        throw new Error(message);
      }
      let AssetsPlugin: webpack.Plugin;
      AssetsPlugin = new CopyWebpackPlugin(
        [{
          from: asset,
          to: 'assets',
        }],
        { ignore: ['.gitkeep', '**/.DS_Store', '**/Thumbs.db'] }
      );
      RexPlugins.push(AssetsPlugin);
    })
  };
  if (progress) {
    RexPlugins.push(new ProgressPlugin());
  };
  if (extractCss) {
    RexPlugins.push(new MiniExtractCssPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: inDevelopment ? '[name].css' : '[name].[hash].css',
      chunkFilename: inDevelopment ? '[id].css' : '[id].[hash].css',
    }))
  };
  if (scripts.length > 0) {
    RexPlugins.push(new ScriptsWebpackPlugin(
      {
        scripts
      }
    ))
  }
  if (externals) {
    RexPlugins.push(
      new HtmlExternalsPlugin(externals))
  };
  RexPlugins.push(
    new ReplaceUrlHtmlWebpackPlugin()
  );
  // if (subresourceIntegrity) {
  //   RexPlugins.push(new SubresourceIntegrityPlugin({
  //     hashFuncNames: ['sha384'],
  //   }));
  // }

  // if (extractLicenses) {
  //   RexPlugins.push(new LicenseWebpackPlugin({
  //     renderBanner: undefined,
  //     renderLicenses: undefined,
  //     outputFilename: '',
  //     perChunkOutput: false,
  //   }));
  // }
  RexPlugins.push(
    new InlineCssPlugin(),//   new AuthorPlugin({ app_name: 'My-App' })
    new ForkTsCheckerWebpackPlugin()
  );
  // ****************** END OF PLUGINS **************** //
  // ****************** START MINIMIZERS ************** //
  const RexMinimizers: any[] = [];
  if (optimization) {
    const terserOptions: TerserPluginOptions = {

    };
    RexMinimizers.push(
      new TerserPlugin({
        sourceMap: true,
        parallel: true,
        cache: true,
        terserOptions,
      }),
    )
  };
  // ****************** END OF MINIMIZERS ************* //
  // ****************** START LOADERS ***************** //
  const SVGO_LOADER: RuleSetRule = {};
  const FILE_LOADER: RuleSetRule = {
        test: /\.(eot|svg|cur|jpg|png|webp|gif|ico|otf|ttf|woff|woff2|ani)$/,
        exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
        loader: 'file-loader',
        options: {
            name: `[name]${hashFormat}.[ext]`,
        },
};
// **** DO NOT PUSH ANY LOADER AFTER THE FILE LAODER *** //
if(svgOptions){
    const { optimize, useInline, useSprite } = svgOptions;
};
// if(pwa){

// };
RexLoaders.push(FILE_LOADER);
// ****************** END LOADERS ***************** //


  return {
    name: '',
    mode: inDevelopment ? 'development' : 'production',
    // Stop compilation early in production
    bail: inDevelopment ? false : true,
    // target: 'node',
    devtool: inDevelopment ? '#inline-source-map' : false,
    entry: entryPoints,
    output: {
      path: resolve(outputPath),
      filename: '[name].js'
    },
    watch: true,
    watchOptions: {
      ignored: /node_modules/,
      poll: true,
    },
    performance: {
      hints: false,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json'],
      symlinks: false,
    },
    module: {
      rules: RexLoaders.filter(Boolean),
        // preloaders first
        // setPreloaders(linting),
        // {
        //     test: /\.(js|jsx|mjs|web|)$/,
        //     use: 'babel-loader',
        //     options: {
        //         presets: [
        //             [require('@babel/preset-env')],
        //             [require('@babel/preset-react'),
        //             { development: process.env.BABEL_ENV === "development" }
        //             ],
        //             [require('@babel/preset-typescript')],
        //         ]
        //     },
        //     exclude: /node_modules/
        // },
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          },
          vendor: {
            test: /[\\\/]node_modules[\\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      },
      noEmitOnErrors: true,
      minimizer: [
        new HashedModuleIdsPlugin(),
        new TerserPlugin({
          test: /\.js(\?.*)?$/i,
          parallel: 4,
          chunkFilter: (chunk) => {
            // Exclude uglification for the `vendor` chunk
            if (chunk.name === 'vendor') {
              return false;
            }
            return true;
          },
          terserOptions: {
            ecma: 5,
            warnings: false,
            
            parse: {
              html5_comments: true,
            },
            compress: {
              pure_getters: buildOptimizer,
              // PURE comments work best with 3 passes.
              // See https://github.com/webpack/webpack/issues/2899#issuecomment-317425926.
              passes: buildOptimizer ? 3 : 1,
            },
            mangle: true, // Note `mangle.properties` is `false` by default.
            module: false,
            toplevel: false,
            ie8: false,
            keep_classnames: undefined,
            keep_fnames: false,
            safari10: false,
          }
        }),
        // TODO: check with Mike what this feature needs.
        // new BundleBudgetPlugin({ budgets: buildOptions.budgets }),
        // ...RexMinimizers,
      ],
    },
    plugins: RexPlugins.filter(Boolean),
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
  }
}
