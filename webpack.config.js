const path = require("path");
const HTMLWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const filename = (ext) =>
  isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  devtool: isProd ? false : "source-map",
  entry: "./scripts/main.ts",
  devServer: {
    historyApiFallback: true,
    // contentBase: path.resolve(__dirname, "app"),
    static: {
      directory: path.join(__dirname, "public"),
    },
    open: true,
    compress: true,
    hot: true,
    port: 8025,
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /\.(?:|ts|tsx)$/i,
        use: ["babel-loader", "ts-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resoursePath, context) => {
                return path.resolve(path.dirname(resoursePath), context) + "/";
              },
            },
          },
          "css-loader",
        ],
      },
      {
        test: /\.s[as]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resoursePath, context) => {
                return path.resolve(path.dirname(resoursePath), context) + "/";
              },
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(?:|gif|png|jpg|jpeg|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: `./img/${filename("[ext]")}`,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
  },
  output: {
    filename: `./js/${filename("js")}`,
    path: path.resolve(__dirname, "app"),
    clean: true,
    publicPath: "",
  },
  plugins: [
    new HTMLWebPackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
      filename: "index.html",
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new MiniCssExtractPlugin({
      filename: `./styles/${filename("css")}`,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/assets/"),
          to: path.resolve(__dirname, "app"),
        },
      ],
    }),
  ],
};
