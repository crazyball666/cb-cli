#!/usr/bin/env node
const dev = require('../src/dev');
const build = require('../src/build');
const argv = process.argv[2];
console.log(argv);

let mode;
process.argv.forEach(item => {
  if (item == 'vue') mode = 'vue';
  if (item == 'react') mode = 'react';
});

console.log(argv, mode);

if (argv === '-v') {

} else if (argv === '-dev') {
  // webpack-dev-server 默认监听端口
  let port = 8080;
  let portIndex = process.argv.indexOf('--port');
  if (portIndex !== -1) {
    process.argv[portIndex + 1] && (port = process.argv[portIndex + 1]);
  }
  console.log(`使用端口${port}...`);
  dev.init(port, mode);
} else if (argv === '-build') {
  build.init(mode);
} else if (argv === undefined) {
  console.log('缺少参数!')
} else {
  console.log('参数不存在!');
}
