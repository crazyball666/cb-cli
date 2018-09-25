const webpack = require('webpack');
const path = require('path');
var WebpackDevServer = require("webpack-dev-server");
const devConfig = require('../config/dev.config');
// 当前运行目录
const dir = process.cwd();

module.exports = {
  init: () => {
    let compiler = webpack(devConfig);
    let server = WebpackDevServer(compiler, {
      contentBase: path.resolve(dir, "dist"),
      publicPath: '/',
      host: "127.0.0.1",
      port: "8080",
      inline: false,
      overlay: true,
      hot: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    server.listen(8080, 'localhost', () => {
      console.log('listening 8080...')
    })
  }
}
