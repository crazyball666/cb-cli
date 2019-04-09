const { exec } = require('child_process');
const shelljs = require('shelljs');
const path = require('path');
const fs = require('fs');
const formatEjs = require('./formatEjs');
// 获取前端项目中的配置文件
const configPath = path.resolve(process.cwd(), './build.config.js');
const buildConfig = require(`${configPath}`);

module.exports = {
  init: async (port, mode) => {
    let webpackDevServerPath = path.resolve(
      __dirname,
      '../node_modules/',
      'webpack-dev-server/bin/webpack-dev-server.js'
    );
    let webpackConfigPath;
    if (mode == 'vue') {
      webpackConfigPath = path.resolve(__dirname, '../config/dev.config.vue.js');
    } else if (mode == 'react') {
      webpackConfigPath = path.resolve(__dirname, '../config/dev.config.js');
    } else {
      throw new Error('缺少打包模版');
      process.exit();
    }
    // js,css模版路径
    let targetPath = path.resolve(buildConfig.outputTplPath);

    process.on('SIGINT', function () {
      process.exit();
    });

    process.on('SIGTERM', function () {
      process.exit();
    });

    console.log('正在生成模版文件...');
    console.log(`文件地址为${targetPath}`);

    let stylePath = path.resolve(__dirname, '../tpl/_style.ejs');
    let scriptPath = path.resolve(__dirname, '../tpl/_script.ejs');
    let styleStr = await formatEjs(stylePath, { host: `localhost:${port}` });
    let scriptStr = await formatEjs(scriptPath, { host: `localhost:${port}` });

    fs.writeFileSync(path.resolve(targetPath, './_style.ejs'), styleStr);
    fs.writeFileSync(path.resolve(targetPath, './_script.ejs'), scriptStr);

    console.log('模版文件已生成，等待webpck打包...');

    shelljs.exec(`node ${webpackDevServerPath} --progress --port ${port} --config ${webpackConfigPath}`);

    console.log('正在恢复模版文件');
    fs.copyFileSync(path.resolve(__dirname, '../default_tpl/_style.ejs'), path.resolve(targetPath, './_style.ejs'));
    fs.copyFileSync(path.resolve(__dirname, '../default_tpl/_script.ejs'), path.resolve(targetPath, './_script.ejs'));
    console.log('恢复模版文件成功！');

  },
};
