const { exec } = require('child_process');

module.exports = {
  init: () => {
    exec('webpack-dev-server --config config/dev.config.js', (err, stdout, stderr) => {
      if (err) console.log(err);
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    })
  }
}
