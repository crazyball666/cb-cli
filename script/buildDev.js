const path = require('path');
const fs = require('fs');
const MemoryFileSystem = require('memory-fs');
const Koa = require('koa');
const webpack = require('webpack');
const chalk = require('chalk');
const cheerio = require('cheerio');
const util = require('../util/util');

function buildDev(port, config) {
  const compiler = webpack(config);
  const memoryFs = new MemoryFileSystem();
  const app = new Koa();
  compiler.outputFileSystem = memoryFs; // 输出内存
  stratServer(app, port, memoryFs, config.output.path);
  let watch = compiler.watch({
      ignored: `/node_modules/`,
      aggregateTimeout: 500,
      poll: 1000,
    },
    (err, stats) => {
      let result = stats.toJson();
      console.log(chalk.yellow(`    【Developement】- Webpack ${result.version}`));
      if (err || stats.hasErrors()) {
        console.log(chalk.red(`❌ | ${err || stats.toJson().errors}`));
        return;
      }
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
          handleHTML(global.projectConfig['HTML_PATH'], outputArr, port);
        } catch (err) {
          console.log(chalk.red(`❌ | Write Error: ${err}`));
        }
      }
    }
  );
  process.on('SIGINT', function () {
    watch.close(() => {
      console.log('✅ | Webpack Watching Ended.');
      process.exit();
    });
  });
}

// Koa静态服务
function stratServer(app, port, memoryFs, basePath) {
  app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE');
    ctx.set('Access-Control-Max-Age', 300);
    if (ctx.method == 'OPTIONS') {
      ctx.body = '';
      ctx.status = 204;
    } else {
      await next();
    }
  });
  app.use(async ctx => {
    try {
      content = memoryFs.readFileSync(path.resolve(basePath, './' + ctx.path));
      ctx.type = path.extname(ctx.path);
      ctx.body = content;
    } catch (err) {
      ctx.stats = 404;
      ctx.body = '404 not found';
    }
  });
  app.listen(port, () => {
    console.log(chalk.green(`✅ | Start develope server at port ${port}`));
  });
}

// 处理html模版
function handleHTML(htmlPath, data, port) {
  let styleArr = [];
  let scriptArr = [];
  data.forEach(item => {
    if (/\.css$/.test(item)) {
      styleArr.push(`<link rel="stylesheet" href="//localhost:${port}/${item}">`)
    } else {
      scriptArr.push(`<script src="//localhost:${port}/${item}"></script>`)
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
  //     $('head').append(`<link attr-cli rel="stylesheet" href="//localhost:${port}/${item}">`)
  //   } else {
  //     $('html').append(`<script attr-cli src="//localhost:${port}/${item}"></script>`)
  //   }
  // });
  // fs.writeFileSync(htmlPath, $.html({
  //   decodeEntities: false,
  //   normalizeWhitespace: false,
  //   ignoreWhitespace: false,
  // }));
  console.log(chalk.green(`✅ | Write Html Success! Path: ${chalk.blue(path.resolve(global.projectConfig['HTML_PATH']))}`));
}

module.exports = buildDev;