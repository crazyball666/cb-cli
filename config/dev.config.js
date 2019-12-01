const path = require('path');
const webpack = require('webpack');
// 清除dist插件
const cleanDist = require('../plugins/cleanDist');
// 加载自动化css独立加载插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// html模版插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 当前运行目录
const dir = process.cwd();

const VueLoaderPlugin = require('vue-loader/lib/plugin');

let port = 8080;

//配置正式开始
module.exports = {
  //设置入口
  entry: {
    app: path.resolve(dir, './app.js'),
  },
  //设置打包出口
  output: {
    path: path.resolve('/dist'), //打包文件放在这个目录下
    filename: '[name].bundle.[hash].js', //打包文件名
  },
  // source-map
  devtool: 'inline-source-map',
  //loader 相关配置
  module: {
    rules: [{
        test: /\.vue$/,
        use: [{
          loader: require.resolve('vue-loader'),
        }, ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            babelrc: false,
            presets: [
              require.resolve('babel-preset-react'),
              require.resolve('babel-preset-env'),
              require.resolve('babel-preset-stage-2'),
            ],
            plugins: [
              [
                require.resolve('babel-plugin-transform-runtime'),
                {
                  moduleName: path.resolve(__dirname, '../node_modules/babel-runtime'),
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          require.resolve('css-loader'),
          require.resolve('sass-loader'),
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          require.resolve('css-loader')
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|ttf|woff)$/,
        use: {
          loader: require.resolve('file-loader'),
          options: {
            name: 'img/[name].[ext]',
            publicPath: `//localhost:${port}/`,
          },
        },
      },
      {
        test: /\.ejs$/,
        loader: require.resolve('ejs-loader'),
      },
    ],
  },
  //插件相关配置
  plugins: [
    new VueLoaderPlugin(), //vue-loader
    new MiniCssExtractPlugin({
      filename: '[name].bundle.[hash].css',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  // 提取第三方库和公共模块
  optimization: {
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
  //设置模式为开发者模式
  mode: 'development',
};