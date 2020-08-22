const webpack = require('webpack');
let baseConfig = require("./base.config");
const path = require('path');


baseConfig.output = {
  path: path.resolve('/dist'),
  filename: '[name].bundle.[hash].js',
  chunkFilename: '[name].bundle.js',
  publicPath: `http://localhost:${global.projectConfig.DEV_PORT}/`
};
baseConfig.devtool = 'inline-source-map';
baseConfig.plugins = baseConfig.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
]);
baseConfig.mode = "development";

module.exports = baseConfig;