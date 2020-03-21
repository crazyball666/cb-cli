const fs = require('fs');

function formatSize(size, time = 0) {
  if (size > 1024) {
    size = size / 1024;
    size = parseFloat(size.toFixed(2));
    return formatSize(size, time + 1)
  }
  if (time == 0) {
    return size + 'B';
  } else if (time == 1) {
    return size + 'KB';
  } else if (time == 2) {
    return size + 'MB';
  } else {
    return size + 'GB';
  }
}

function formatDate(fmt, date) {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString() // 秒
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt;
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


module.exports = {
  formatDate,
  formatSize,
  delDir,
}