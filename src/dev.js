const { exec } = require('child_process');
const shelljs = require('shelljs');
const path = require('path');

module.exports = {
  init: () => {
    let webpackDevServerPath = path.resolve(
      __dirname,
      '../node_modules/',
      'webpack-dev-server/bin/webpack-dev-server.js'
    );
    let webpackConfigPath = path.resolve(__dirname, '../config/dev.config.js');
    shelljs.exec(`node ${webpackDevServerPath} --progress --config ${webpackConfigPath}`);
  },
};
