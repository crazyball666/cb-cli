const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');


module.exports = {
  //设置入口
  entry: global.projectConfig.ENTRY_PATH || './main.js',
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
        test: /\.(png|svg|jpg|gif|ttf|woff|woff2|eot)$/,
        use: {
          loader: require.resolve('file-loader'),
          options: {
            name: 'assets/[name].[ext]',
          },
        },
      },
    ],
  },
  //插件相关配置
  plugins: [
    new VueLoaderPlugin(), //vue-loader
    new MiniCssExtractPlugin({ // 提取css
      filename: '[name].bundle.[hash].css',
    }),
  ],
  // 优化（代码提取）
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          minChunks: 1, //被不同entry引用次数(import),1次的话没必要提取
          maxInitialRequests: 5,
          minSize: 0,
          priority: 100,
        },
      },
    },
  },
}