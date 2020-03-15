#!/usr/bin/env node

const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const logger = require('../logger');
const MemoryFileSystem = require('memory-fs');
const Koa = require('koa');
const yargs = require('yargs');
const init = require('../script/init')

//默认设置
let defaultConfig = {
  ENTRY_PATH: './main.js',
  OUTPUT_PATH: './dist'
};


let argvs = yargs
  .option('init', {
    boolean: true,
  })
  .option('help', {
    boolean: true,
  })
  .option('dev', {
    boolean: true,
  })
  .option('build', {
    boolean: true,
  })
  .option('port', {
    default: 8080,
  }).argv;

//==========================[Main function]============================
main();

function main() {
  if (argvs.init) {
    init()
    return;
  } else if (argvs.help) {
    return showHelp();
  }
  loadProjectConfig();
  if (argvs.dev) {
    let config = loadWepackConfig('dev');
    return buildDev(parseInt(argvs.port), config);
  }
  if (argvs.build) {
    let config = loadWepackConfig('prod');
    return buildPro(config);
  }
  console.log('unkonw argument');
}

//============================[common]==================================
function showHelp() {
  console.log('cb-cli base on webpack4');
}

function loadProjectConfig() {
  let projectConfig = {};
  try {
    projectConfig = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), './build.config.json')));
  } catch (err) {
    console.log('[Error] read project config error');
  }
  global.projectConfig = Object.assign(defaultConfig, projectConfig);
}

function loadWepackConfig(mode) {
  let config = {};
  if (mode == 'dev') {
    config = require('../config/dev.config');
  } else if (mode == 'prod') {
    config = require('../config/prod.config');
  }
  return config;
}

//========================[build develope]=============================
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
      if (err || stats.hasErrors()) {
        console.log(`[ERROR] | ${err || stats.toJson().errors}`);
        return;
      }
      let resultJson = stats.toJson().assetsByChunkName;
      let outputArr = [];
      Object.keys(resultJson).forEach(key => {
        if (Array.isArray(resultJson[key])) {
          outputArr = outputArr.concat(resultJson[key]);
        } else {
          outputArr.push(resultJson[key]);
        }
      });
      console.log('[INFO] | Build Success!');
      outputArr.forEach(item => {
        console.log(`--- ${item}`);
      });
      if (global.projectConfig['HTML_PATH']) {
        try {
          handleHTML(global.projectConfig['HTML_PATH'], outputArr);
        } catch (err) {
          console.log(`[Error] | Write Error: ${err}`);
        }
      }
    }
  );
  process.on('SIGINT', function () {
    watch.close(() => {
      console.log('[INFO] | Webpack Watching Ended.');
      process.exit();
    });
  });
}

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
    console.log('[INFO] | Start develope server at port 8080');
  });
}

function handleHTML(path, data) {
  console.log(`[INFO] | Write resource to html,path:${global.projectConfig['HTML_PATH']}...`);
  let newFileData = `{{define "resource"}}\n`;
  data.forEach(item => {
    if (/\.css$/.test(item)) {
      newFileData += `<link rel="stylesheet" href="//localhost:${argvs.port}/${item}">\n`;
    } else {
      newFileData += `<script src="//localhost:${argvs.port}/${item}"></script>\n`;
    }
  });
  newFileData += '{{end}}';
  fs.writeFileSync(path, newFileData);
  console.log('[INFO] | Write resource to html success!');
}

//========================[build production]===========================
function buildPro(config) {
  const compiler = webpack(config);
  compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
      logger.ciLoger.error(err || stats.toJson().errors);
      return;
    }
    let statsJson = stats.toJson();
    logger.ciLoger.info(`【build】\n${statsJson}`);
    if (global.projectConfig['HTML_PATH']) {
      logger.ciLoger.info(`handle html... path:${global.projectConfig['HTML_PATH']}`);
      handleHTMLBuild(global.projectConfig['HTML_PATH'], statsJson.assetsByChunkName);
    }
  });
}

function handleHTMLBuild(path, data) {
  let output = [];
  Object.keys(data).forEach(key => {
    if (Array.isArray(data[key])) {
      output = output.concat(data[key]);
    } else {
      output.push(data[key]);
    }
  });
  let fileData = String(fs.readFileSync(path));
  console.log('【before】\n', fileData);

  let newFileData = `{{define "resource"}}\n`;
  output.forEach(item => {
    if (/\.css$/.test(item)) {
      newFileData += `<link rel="stylesheet" href="//static.crazyball.xyz/${global.projectConfig["PROJECT_NAME"]}/${item}">\n`;
    } else {
      newFileData += `<script src="//static.crazyball.xyz/${global.projectConfig["PROJECT_NAME"]}/${item}"></script>\n`;
    }
  });
  newFileData += '{{end}}';
  console.log('【after】\n', newFileData);
  fs.writeFileSync(path, newFileData);
}