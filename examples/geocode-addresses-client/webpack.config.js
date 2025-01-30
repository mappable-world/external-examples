const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { EnvironmentPlugin } = require("webpack");

require("dotenv").config();

const isProduction = process.env.NODE_ENV == "production";

const CSSModuleLoader = {
  loader: "css-loader",
  options: {
    esModule: false,
    modules: {
      localIdentName: isProduction
        ? "[hash:base64]"
        : "[name]__[local]--[hash:base64:5]",
    },
  },
};

const CSSLoader = {
  loader: "css-loader",
};

const styleLoader = isProduction ? MiniCssExtractPlugin.loader : "style-loader";

process.env.API_URL ??= "https://js.api.mappable.world/v3/";
const ASSET_PATH = process.env.ASSET_PATH ?? "./";

if (!process.env.APIKEY) {
  throw new Error("APIKEY environment variables are required");
}

const API = `${process.env.API_URL}?apikey=${process.env.APIKEY}&lang=en_US`;

const plugins = [
  new HtmlWebpackPlugin({
    template: "index.html",
    filename: "index.html",
    minify: { removeComments: true },
    API: API,
  }),
  new MiniCssExtractPlugin(),
  new CopyPlugin({
    patterns: [
      {
        from: "public",
        to: "public/[name][ext]",
      },
    ],
  }),
];

if (isProduction) {
  plugins.push(new EnvironmentPlugin(["APIKEY"]));
}

module.exports = {
  entry: {
    app: "./src/index.tsx",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    publicPath: ASSET_PATH,
    clean: true,
  },
  devServer: {
    port: 3000,
    allowedHosts: "all",
    client: {
      logging: "info",
    },
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /\.module\.(sa|sc|c)ss$/,
        use: [styleLoader, CSSLoader, "postcss-loader"],
      },
      {
        test: /\.module\.(sa|sc|c)ss$/,
        use: [styleLoader, CSSModuleLoader, "postcss-loader"],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.zip$/,
        type: "asset/resource",
        generator: {
          filename: "static/[name][ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  mode: isProduction ? "production" : "development",
};
