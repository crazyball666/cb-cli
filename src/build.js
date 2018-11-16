const shelljs = require('shelljs');
const path = require('path');
const prodConfig = require('../config/prod.config');
const fs = require('fs');

module.exports = {
  init: () => {
    let webpackPath = path.resolve(__dirname, '../node_modules/', 'webpack/bin/webpack.js');
    let webpackConfigPath = path.resolve(__dirname, '../config/prod.config.js');
    let code = shelljs.exec(`node ${webpackPath} --progress --config ${webpackConfigPath}`);
    // console.log('success build!');
    // console.log('start move code...');
    // console.log(prodConfig.output);
    let res = fs.readdirSync(prodConfig.output.path);
    console.log(res);
    console.log('success move code!');
  },
};
