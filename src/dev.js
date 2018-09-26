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
    shelljs.exec(`node ${webpackDevServerPath} --progress --config config/dev.config.js`, (err, stdout, stderr) => {
      if (err) console.log(err);
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  },
};
