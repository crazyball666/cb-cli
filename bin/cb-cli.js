const exec = require('child_process').exec;
exec('mkdir aaa', function () {
  console.log('king init命令已执行...');
});