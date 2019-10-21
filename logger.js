const log4js = require('log4js');
const path = require('path');
log4js.configure({
  appenders: {
    'default': { type: 'console' },
    'cli': {
      type: "file",
      filename: path.join(__dirname, './log/build-log'),
      alwaysIncludePattern: true,
      pattern: "yyyy-MM-dd.log",
      encoding: 'utf-8',//default "utf-8"，文件的编码
      maxLogSize: 1024 * 1024 * 20,
      level: 'all'
    }
  },
  categories: {
    'cli': {
      appenders: ['cli', 'default'],
      level: 'all'
    },
    default: {
      appenders: ['default'],
      level: 'all'
    }
  }
})
module.exports = {
  ciLoger: log4js.getLogger('cli'),
};