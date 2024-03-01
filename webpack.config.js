const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
// provides ability to get interface fields as keys 
// const keysTransformer = require('ts-transformer-keys/transformer').default;
// @ts-ignore
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
      redirect: [path.resolve(__dirname, "src", "redirect.ts")],
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
        template: path.resolve(__dirname, "src", "views", `popup.html`),
        filename: `views/popup.html`,
        chunks: [`popup`],
        scriptLoading: "module",
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src", "views", `redirect.html`),
        filename: `views/redirect.html`,
        chunks: [`redirect`],
        scriptLoading: "module",
      }),
      /* new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src", "views", "options.html"),
        filename: "views/options.html",
        chunks: [],
        // chunks: ["popup"],
        // scriptLoading: "module",
      }), */
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
          {
            from: path.resolve(__dirname, "src/_locales"),
            to: path.resolve('dist', '_locales'),
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
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        /* 
        // npm install --save-dev typings-for-css-modules-loader
        {
          test: /\.css$/,
          include: path.join(__dirname, 'src/components'),
          use: [
            'style-loader',
            {
              loader: 'typings-for-css-modules-loader',
              options: {
                modules: true,
                namedExport: true
              }
            }
          ]
        } */
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
