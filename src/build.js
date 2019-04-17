const shelljs = require('shelljs');
const path = require('path');
const prodConfig = require('../config/prod.config');
const fs = require('fs');

module.exports = {
  init: (mode) => {
    let webpackPath = path.resolve(__dirname, '../node_modules/', 'webpack/bin/webpack.js');
    let webpackConfigPath;
    let prodConfig;
    if (mode == 'vue') {
      webpackConfigPath = path.resolve(__dirname, '../config/prod.config.vue.js');
      prodConfig = require('../config/prod.config.vue');
    } else if (mode == 'react') {
      webpackConfigPath = path.resolve(__dirname, '../config/prod.config.js');
      prodConfig = require('../config/prod.config');
    } else {
      throw new Error('缺少打包模版');
      process.exit();
    }
    shelljs.exec(`node ${webpackPath} --progress --config ${webpackConfigPath}`);
    console.log('success build!');
    // console.log('start move code...');
    // console.log(prodConfig.output);
    let res = fs.readdirSync(prodConfig.output.path);
    console.log(res);
    console.log('success move code!');
  },
};
