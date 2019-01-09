const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const nodeEnv = process.env.NODE_ENV || "development";
const isDev = nodeEnv === "development";

const styleLoader = isDev ? "style-loader" : MiniCssExtractPlugin.loader;

let minifyHtmlOptions = {};
if (!isDev) {
  minifyHtmlOptions = {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true
  };
}

const config = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },

  watch: isDev,
  watchOptions: {
    aggregateTimeout: 100
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: "style.css" }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      minify: minifyHtmlOptions
    }),

    new CleanWebpackPlugin(path.resolve(__dirname, "dist"), {}),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require("cssnano"),
      cssProcessorPluginOptions: {
        preset: ["default", { discardComments: { removeAll: true } }]
      }
    })
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: "/node_modules/",
        use: {
          loader: "babel-loader",
          options: {
            presets: ["es2015", "react"]
          }
        }
      },
      {
        test: /\.css$/,
        use: [styleLoader, "css-loader", "postcss-loader", "sass-loader"]
      }
    ]
  },

  devServer: {
    historyApiFallback: true
  }
};

if (!isDev) {
  config.optimization = Object.assign({}, config.optimization, {
    minimizer: [
      new UglifyJSPlugin({
        parallel: true,
        cache: true,
        sourceMap: true
      })
    ]
  });
}

module.exports = config;
