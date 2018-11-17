const ejs = require('ejs');

module.exports = function (filePath, data = {}, option = {}) {
  return new Promise((resolve, reject) => {
    ejs.renderFile(filePath, data, option, function (err, str) {
      if (err) {
        console.log('获取ejs模版失败');
        reject(err);
      } else {
        resolve(str);
      }
    })
  })
}