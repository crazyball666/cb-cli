const fs = require('fs')

const pluginName = 'CleanDist';

class CleanDist {
  constructor(path) {
    this.path = path;
  }
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, compilation => {
      console.log("delete build dir", this.path);
      delDir(this.path);
    });
  }
}

function delDir(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
    fs.rmdirSync(path);
  }
}

module.exports = CleanDist