const init = require('../script/init.js');
// const start = require('../src/start.js');
const program = require('commander');
const pkg = require('../package.json');
process.title = 'king';
program
  .version(pkg.version);

program
  .command('init [project]')
  .description('init project')
  .action(function (project) {
    init.run(project);
  });

// program
//   .command('start')
//   .description('start project')
//   .option('-p, --port [port]', 'listening port')
//   .action(function (port) {
//     start.run(port);
//   });

program.parse(process.argv);