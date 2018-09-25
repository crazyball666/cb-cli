const webpack = require('webpack');
const devConfig = require('../config/dev.config')
module.exports = {
  init: () => {
    webpack(devConfig, function (err, stats) {
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }))
    })
  }
}
