const cleanDist = require('../plugins/cleanDist') // 清除dist插件
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); //压缩css
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
let baseConfig = require("./base.config");


baseConfig.output = {
  path: global.projectConfig.OUTPUT_PATH,
  filename: '[name].bundle.[hash].js',
};
baseConfig.devtool = false;
baseConfig.plugins = baseConfig.plugins.concat([
  new cleanDist(global.projectConfig.OUTPUT_PATH),
  new UglifyJsPlugin({
    cache: true,
    parallel: true,
    sourceMap: false,
  }),
]);
baseConfig.optimization.minimizer = [
  new OptimizeCSSAssetsPlugin(), // 压缩css
];
baseConfig.mode = 'production';


//配置正式开始
module.exports = baseConfig;