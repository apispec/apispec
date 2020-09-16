#!/usr/bin/env node

const commander = require('commander');
const chalk = require('chalk');

const createSpec = require('./create-spec');
const packageJson = require('./package.json');

const program = new commander.Command()
  .name(packageJson.name)
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .arguments('<project-directory>')
  .action(name => {
    projectName = name;
  })
  .option('-j, --json', 'add json asserts')
  .option('-w, --workspace', 'dev only: create yarn workspace to use local apispec')
  //  .allowUnknownOption()
  .on('--help', () => {
    console.log();
    console.log(`    Only ${chalk.green('<project-directory>')} is required.`);
    console.log();
  })
  .version(packageJson.version, '-v, --version', 'output the current version')
  .parse(process.argv);

//if (!process.argv.slice(2).length) {
//  program.outputHelp();
//}

if (typeof projectName === 'undefined') {
  program.outputHelp();
  process.exit(0);
}

createSpec(
  projectName,
  packageJson.version,
  program.verbose,
  program.json,
  program.workspace
);
