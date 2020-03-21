const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const cheerio = require('cheerio');
const util = require('../util/util')

function buildPro(config) {
  const compiler = webpack(config);
  console.log(chalk.yellow('=======【Production】======='));
  util.delDir(path.resolve(global.projectConfig.OUTPUT_PATH));
  console.log(`[INFO] | Build Output Path: ${chalk.blue(path.resolve(global.projectConfig.OUTPUT_PATH))}`);
  console.log(chalk.green(`✅ | Clear Build Directory Success!`));
  compiler.run((err, stats) => {
    let result = stats.toJson();
    if (err || stats.hasErrors()) {
      console.log(chalk.red(`❌ | ${err || stats.toJson().errors}`));
      return;
    }
    console.log(chalk.yellow(`   - Webpack ${result.version}`));
    console.log(chalk.green('✅ | Build Success!'));
    console.log(chalk.green(`✅ | Build At ${util.formatDate('YYYY-mm-dd HH:MM',new Date(result.builtAt))} ｜ Use ${chalk(result.time)} ms`));
    result.assets.forEach(item => {
      console.log(`   - [${chalk.blue(util.formatSize(item.size))}] ${item.name}`);
    });
    if (global.projectConfig['HTML_PATH']) {
      try {
        let outputArr = [];
        Object.keys(result.assetsByChunkName).forEach(key => {
          if (Array.isArray(result.assetsByChunkName[key])) {
            outputArr = outputArr.concat(result.assetsByChunkName[key]);
          } else {
            outputArr.push(result.assetsByChunkName[key]);
          }
        });
        handleHTMLBuild(global.projectConfig['HTML_PATH'], outputArr);
      } catch (err) {
        console.log(chalk.red(`❌ | Write Html Error: ${err}`));
      }
    }
    console.log(chalk.yellow('============================'));
  });
}

function handleHTMLBuild(htmlPath, data) {
  let $ = cheerio.load(fs.readFileSync(htmlPath));
  $('link[attr-cli]').remove();
  $('script[attr-cli]').remove();
  data.forEach(item => {
    if (/\.css$/.test(item)) {
      $('head').append(`<link attr-cli rel="stylesheet" href="//static.crazyball.xyz/${global.projectConfig["PROJECT_NAME"]}/${item}">`)
    } else {
      $('html').append(`<script attr-cli src="//static.crazyball.xyz/${global.projectConfig["PROJECT_NAME"]}/${item}"></script>`)
    }
  });
  fs.writeFileSync(htmlPath, $.html());
  console.log(chalk.green(`✅ | Write Html Success! Path: ${chalk.blue(path.resolve(global.projectConfig['HTML_PATH']))}`));
}

module.exports = buildPro;