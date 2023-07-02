const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: { index: "./src/index.ts" },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    library: "easy-reducer",
    libraryTarget: "commonjs",
  },
  experiments: {
    outputModule: true,
  },
  module: {
    rules: [
      {
        test: /\.(tsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: path.resolve(__dirname, "tsconfig.json"),
          },
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-typescript"],
          },
        },
      },
    ],
  },
  //   plugins: [
  //     new HtmlWebpackPlugin({
  //       template: "./public/index.html",
  //       filename: "./index.html",
  //     }),
  //   ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "@modules": path.resolve(__dirname, "src", "modules"),
    },
  },
  //   devServer: {
  //     historyApiFallback: true,
  //     static: {
  //       directory: path.join(__dirname, "build"),
  //     },
  //     port: 3000,
  //   },
};
