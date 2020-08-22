const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const util = require('../util/util');
const urljoin = require('url-join');

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
    console.log(chalk.green(`✅ | Build At ${chalk.blue(util.formatDate('YYYY-mm-dd HH:MM',new Date(result.builtAt)))} ｜ Use ${chalk.blue(result.time)} ms | Hash ${chalk.blue(result.hash)}`));
    console.log(chalk.green(`✅ | Output Path: ${chalk.blue(result.outputPath)} ｜ Public Path: ${chalk.blue(result.publicPath)}`));
    result.assets.forEach(item => {
      console.log(`   - [${chalk.blue(util.formatSize(item.size))}] ${item.name}`);
    });
    console.log(chalk.green('【Build Bundle】'));
    Object.keys(result.assetsByChunkName).forEach(key => {
      console.log(chalk.yellow(`  ${key}: ${result.assetsByChunkName[key].toString()}`))
    });
    if (global.projectConfig['HTML_PATH'] && global.projectConfig["PUBLIC_PATH"]) {
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
  let styleArr = [];
  let scriptArr = [];
  data.forEach(item => {
    let publicPath = urljoin(global.projectConfig["PUBLIC_PATH"], `${item}`);
    console.log(chalk.green(`   - Resource Public Path: ${chalk.blue(publicPath)}`));
    if (/\.css$/.test(item)) {
      styleArr.push(`<link rel="stylesheet" href="${publicPath}">`)
    } else {
      scriptArr.push(`<script src="${publicPath}"></script>`)
    }
  });
  let styleRes = styleArr.join("\n");
  let scriptRes = scriptArr.join("\n");

  let styleTplReg = new RegExp("<style-tpl>(.|\n)*<\/style-tpl>", "ig");
  let scriptTplReg = new RegExp("<script-tpl>(.|\n)*<\/script-tpl>", "ig");

  let htmlContent = fs.readFileSync(htmlPath).toString();

  htmlContent = htmlContent.replace(styleTplReg, `<style-tpl>\n${styleRes}\n<\/style-tpl>`);
  htmlContent = htmlContent.replace(scriptTplReg, `<script-tpl>\n${scriptRes}\n<\/script-tpl>`);

  fs.writeFileSync(htmlPath, htmlContent);

  // let $ = cheerio.load(fs.readFileSync(htmlPath), {
  //   decodeEntities: false,
  //   normalizeWhitespace: false,
  //   ignoreWhitespace: false,
  // });
  // $('link[attr-cli]').remove();
  // $('script[attr-cli]').remove();
  // data.forEach(item => {
  //   if (/\.css$/.test(item)) {
  //     $('head').append(`<link attr-cli rel="stylesheet" href="//static.crazyball.xyz/${global.projectConfig["PROJECT_NAME"]}/${item}">`)
  //   } else {
  //     $('html').append(`<script attr-cli src="//static.crazyball.xyz/${global.projectConfig["PROJECT_NAME"]}/${item}"></script>`)
  //   }
  // });
  // fs.writeFileSync(htmlPath, $.html({
  //   decodeEntities: false,
  //   normalizeWhitespace: false,
  //   ignoreWhitespace: false,
  // }));
  console.log(chalk.green(`✅ | Write Html Success! Path: ${chalk.blue(path.resolve(global.projectConfig['HTML_PATH']))}`));
}

module.exports = buildPro;