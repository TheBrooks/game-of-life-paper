const path = require("path");

module.exports = {
  entry: path.resolve("src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "gameOfLife.paper.js"
  },
  module: {
    rules: [
      {
        test: /\.paper\.jsx?$/,
        loader: "paper-loader"
      }
      /*,
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
      */
    ]
  }
};
