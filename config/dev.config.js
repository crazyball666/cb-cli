const path = require('path');
const webpack = require('webpack');
// 加载自动化css独立加载插件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// 当前运行目录
const dir = process.cwd();

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
  devServer: {
    contentBase: path.resolve(dir, 'dist'),
    publicPath: '/',
    host: '127.0.0.1',
    port: '8080',
    inline: false,
    overlay: true,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  // source-map
  devtool: 'inline-source-map',
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
            plugins: [require.resolve('babel-runtime')],
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
        use: [
          require.resolve('file-loader'),
        ],
      },
    ],
  },
  //插件相关配置
  plugins: [
    extractSass,
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
