const readlineSync = require('readline-sync');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk')

module.exports = function () {
  let config = {};
  config.PROJECT_NAME = readlineSync.question(chalk.green('Enter project name > '));
  config.ENTRY_PATH = readlineSync.question(chalk.green('Enter entry file path > '));
  config.OUTPUT_PATH = readlineSync.question(chalk.green('Enter output folder path > '));
  config.HTML_PATH = readlineSync.question(chalk.green('Enter html template path > '));
  fs.writeFileSync(path.resolve(process.cwd(), "./build.config.json"), JSON.stringify(config, null, '\t'));
  console.log(chalk.green(`init project ${config.PROJECT_NAME} successfully!`));
}