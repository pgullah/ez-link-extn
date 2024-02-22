const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
// provides ability to get interface fields as keys 
// const keysTransformer = require('ts-transformer-keys/transformer').default;
const ZipPlugin = require("zip-webpack-plugin");
// @ts-ignore
const PACKAGE = require('./package.json');
// @ts-ignore
const MANIFEST = require('./src/manifest.json');

const NO_OP = () => {};

// @ts-ignore
module.exports = (_, argv) => {
  const isProd = argv.mode === "production" || argv.mode === "prod";
  return {
    entry: {
      options: [path.resolve(__dirname, "src", "options.ts")],
      popup: [path.resolve(__dirname, "src", "popup.ts")],
    },
    /* externals: {
      "chrome-extension-async": "chrome-extension-async",
    }, */
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "js/[name]-bundle.js",
      // globalObject: "this",
    },
    devtool: "cheap-module-source-map",
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src", "views", "popup.html"),
        filename: "views/popup.html",
        chunks: ["popup"],
        scriptLoading: "module",
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "src/manifest.json"),
            transform: () => {
              const mutableManifest = { ...MANIFEST, };
              mutableManifest.version = PACKAGE.version;
              mutableManifest.name = PACKAGE.name
              return Buffer.from(JSON.stringify(mutableManifest));
            }
          },
          {
            from: path.resolve(__dirname, "src/styles"),
            to: path.resolve('dist', 'styles'),
          },
        ],

      }),
      isProd ? new ZipPlugin({
        filename: `${PACKAGE.name}-v${PACKAGE.version}`,
        path: path.resolve(__dirname, 'releases'),
      }) : NO_OP,
    ],

    module: {
      rules: [
        {
          test: /\.(ts|tsx)?$/,
          include: path.resolve(__dirname, 'src'),
          loader: 'ts-loader',
          options: {
            // @ts-ignore
            getCustomTransformers: (program) => ({
              before: [
                // keysTransformer(program)
              ]
            })
          }
        },
      ]
    },

    resolve: {
      plugins: [
        // new TsconfigPathsPlugin({}),
      ],
      extensions: ['.ts', '.tsx', '.js', '.jsx',]
    },
  };
};
