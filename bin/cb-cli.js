#!/usr/bin/env node
const webpack = require("webpack");
const path = require("path");
const logger = require("../logger");
const fs = require("fs");
const argv = process.argv[2];

const Koa = require('koa')
const static = require('koa-static');
const app = new Koa()
let isRunning = false;

// 当前运行目录
const dir = process.cwd();
let pathArr = dir.split(path.sep);
let projectName = pathArr[pathArr.length - 1];

const port = 8080
let customConfig = {}
try {
  customConfig = JSON.parse(fs.readFileSync(path.resolve(dir, "./build.config.json")))
} catch (err) {
  customConfig = {}
}
let prodConfig = require('../config/prod.config')
let devConfig = require('../config/dev.config')
let config;
if (argv === '-v') {
  console.log("cb-cli base on webpack 4")
} else if (argv === '-dev') {
  config = devConfig;
  config.entry = customConfig.entry ? customConfig.entry : config.entry;
} else if (argv === '-build') {
  config = prodConfig;
  config.entry = customConfig.entry ? customConfig.entry : config.entry;
} else {
  console.log("unkonw argument")
  return;
}


const compiler = webpack(config);
let watch;
if (argv === '-dev') {
  watch = compiler.watch({
    aggregateTimeout: 500,
    poll: undefined
  }, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(err || stats.toJson().errors)
      return
    }
    let statsJson = stats.toJson()
    console.log(`【build】\n${JSON.stringify(statsJson.assetsByChunkName)}`);
    if (customConfig["HTML_PATH"]) {
      console.log(`handle html... path:${customConfig["HTML_PATH"]}`);
      handleHTML(customConfig["HTML_PATH"], statsJson.assetsByChunkName);
    }
    if (!isRunning) {
      app.use(static(path.join(devConfig.output.path)))
      app.use(async (ctx) => { ctx.body = '404 not found' })
      app.listen(port, () => {
        console.log('【dev】 starting at port 8080')
        isRunning = true
      })
    }
  });
} else if (argv === '-build') {
  compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
      logger.ciLoger.error(err || stats.toJson().errors)
      return
    }
    let statsJson = stats.toJson()
    logger.ciLoger.info(`【build】\n${statsJson}`)
    if (customConfig["HTML_PATH"]) {
      logger.ciLoger.info(`handle html... path:${customConfig["HTML_PATH"]}`);
      handleHTMLBuild(customConfig["HTML_PATH"], statsJson.assetsByChunkName);
    }
  });
}

function handleHTML(path, data) {
  let output = [];
  Object.keys(data).forEach(key => {
    if (Array.isArray(data[key])) {
      output = output.concat(data[key])
    } else {
      output.push(data[key])
    }
  })
  let fileData = String(fs.readFileSync(path));
  console.log("【before】\n", fileData);

  let newFileData = `{{define "resource"}}\n`
  output.forEach(item => {
    if (/\.css$/.test(item)) {
      newFileData += `<link rel="stylesheet" href="//localhost:${port}/${item}">\n`;
    } else {
      newFileData += `<script src="//localhost:${port}/${item}"></script>\n`;
    }
  })
  newFileData += "{{end}}"
  console.log("【after】\n", newFileData);
  fs.writeFileSync(path, newFileData);
}


function handleHTMLBuild(path, data) {
  let output = [];
  Object.keys(data).forEach(key => {
    if (Array.isArray(data[key])) {
      output = output.concat(data[key])
    } else {
      output.push(data[key])
    }
  })
  let fileData = String(fs.readFileSync(path));
  console.log("【before】\n", fileData);

  let newFileData = `{{define "resource"}}\n`
  output.forEach(item => {
    if (/\.css$/.test(item)) {
      newFileData += `<link rel="stylesheet" href="//106.15.73.155/static/${projectName}/${item}">\n`;
    } else {
      newFileData += `<script src="//106.15.73.155/static/${projectName}/${item}"></script>\n`;
    }
  })
  newFileData += "{{end}}"
  console.log("【after】\n", newFileData);
  fs.writeFileSync(path, newFileData);
}

process.on('SIGINT', function () {
  console.log('Got SIGINT');
  watch.close(() => {
    console.log("Webpack Watching Ended.");
    process.exit()
  });
});
