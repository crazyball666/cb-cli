#!/usr/bin/env node
const dev = require('../src/dev');
const argv = process.argv[2];
// webpack-dev-server 默认监听端口
let port = 8080;
let portIndex = process.argv.indexOf('--port');
if (portIndex !== -1) {
  process.argv[portIndex + 1] && (port = process.argv[portIndex + 1]);
}
console.log(argv);
console.log(port);

if (argv === '-v') {

} else if (argv === '-dev') {
  dev.init();
} else if (argv === '-build') {

} else if (argv === undefined) {
  console.log('缺少参数!')
} else {
  console.log('参数不存在!');
}
