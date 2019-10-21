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
let customConfig = {}
try{
  customConfig = JSON.parse(fs.readFileSync(path.resolve(dir,"./build.config.json")))
}catch(err){
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
if(argv === '-dev'){
  compiler.watch({
    aggregateTimeout: 500,
    poll: undefined
  },(err, stats) => {
    if(err || stats.hasErrors()){
        console.log(err || stats.toJson().errors)
        return
    }
    let statsJson = stats.toJson()
    console.log(`[build] : ${JSON.stringify(statsJson.assetsByChunkName)}`);
    if(!isRunning){
      app.use(static(path.join(devConfig.output.path)))
      app.use( async ( ctx ) => {ctx.body = '404 not found'})
      app.listen(8080, () => {
        console.log('[dev] starting at port 8080')
        isRunning = true
      })
    }
  });
}else if(argv === '-build'){
  compiler.run((err, stats) => {
    if(err || stats.hasErrors()){
        logger.ciLoger.error(err || stats.toJson().errors)
        return
    }
    let statsJson = stats.toJson()
    logger.ciLoger.info(statsJson)
  });
}