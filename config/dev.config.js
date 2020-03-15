const webpack = require('webpack');
let baseConfig = require("./base.config");
const path = require('path')


baseConfig.output = {
  path: path.resolve('/dist'),
  filename: '[name].bundle.[hash].js',
};
baseConfig.devtool = 'inline-source-map';
baseConfig.plugins = baseConfig.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
]);
baseConfig.mode = "development";


//配置正式开始
module.exports = baseConfig;