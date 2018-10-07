const shelljs = require('shelljs');
const path = require('path');

module.exports = {
  init: () => {
    let webpackPath = path.resolve(
      __dirname,
      '../node_modules/',
      'webpack/bin/webpack.js'
    );
    let webpackConfigPath = path.resolve(__dirname, '../config/prod.config.js');
    shelljs.exec(`node ${webpackPath} --progress --config ${webpackConfigPath}`);
  },
};
