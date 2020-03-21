#!/usr/bin/env node

const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const logger = require('../logger');
const yargs = require('yargs');
const init = require('../script/init');
const buildDev = require('../script/buildDev');
const buildPro = require('../script/buildPro');

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


//========================[build production]===========================