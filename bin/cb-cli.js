#!/usr/bin/env node
const dev = require('../src/dev');
const argv = process.argv[2];
console.log(argv);

if (argv === '-v') {

} else if (argv === '-dev') {
  dev.init();
} else if (argv === '-build') {

} else if (argv === undefined) {
  console.log('缺少参数!')
} else {
  console.log('参数不存在!');
}
