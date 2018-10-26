const path = require('path');
const webpack = require('webpack');
// 清除dist插件
const CleanWebpackPlugin = require('clean-webpack-plugin');
// 加载自动化css独立加载插件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// 当前运行目录
const dir = process.cwd();
let pathArr = dir.split(path.sep);
let projectName = pathArr[pathArr.length - 1];

const extractSass = new ExtractTextPlugin({
  filename: '[name].css',
});

//配置正式开始
module.exports = {
  //设置入口
  entry: {
    app: path.resolve(dir, './src/js/app.js'),
    vendor: path.resolve(dir, './src/js/vendor.js'),
  },
  //设置打包出口
  output: {
    path: path.resolve(dir, 'dist'), //打包文件放在这个目录下
    filename: '[name].bundle.js', //打包文件名
    publicPath: '/',
  },
  // source-map
  devtool: false,
  //loader 相关配置
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            babelrc: false,
            presets: [require.resolve('babel-preset-react'), require.resolve('babel-preset-env'), require.resolve('babel-preset-stage-2')],
            plugins: [[require.resolve('babel-plugin-transform-runtime'), {
              "moduleName": path.resolve(__dirname, "../node_modules/babel-runtime")
            }]],
          },
        },
      },
      {
        test: /\.(scss|css)$/,
        use: extractSass.extract({
          fallback: require.resolve('style-loader'),
          use: [
            require.resolve('css-loader'),
            require.resolve('sass-loader'),
          ],
        }),
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: require.resolve('file-loader'),
          options: {
            name: 'img/[name].[ext]',
            publicPath: `static/${projectName}/`,
          }
        },
      },
    ],
  },
  //插件相关配置
  plugins: [
    extractSass,
    new CleanWebpackPlugin([path.resolve(dir, 'dist')]),
  ],
  // 提取第三方库和公共模块
  optimization: {
    // runtimeChunk: {
    //   name: 'manifest'
    // },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          //node_modules内的依赖库
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          minChunks: 1, //被不同entry引用次数(import),1次的话没必要提取
          maxInitialRequests: 5,
          minSize: 0,
          priority: 100,
          // enforce: true?
        },
      },
    },
  },
  //设置模式为生产模式
  mode: 'production',
};
