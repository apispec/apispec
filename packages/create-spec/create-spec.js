const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const validateProjectName = require('validate-npm-package-name');

function createSpec(
  name,
  version,
  verbose,
  addJsonAsserts,
  useLocalApispec
) {
  const root = path.resolve(name);
  const appName = path.basename(root);

  checkAppName(appName);
  fs.ensureDirSync(name);
  fs.ensureDirSync(path.resolve(name, 'test'));
  //  if (!isSafeToCreateProjectIn(root, name)) {
  //    process.exit(1);
  //  }

  console.log(`Creating a new apispec ${chalk.green(root)}.`);
  console.log();

  const packageJson = {
    name: appName,
    version: '1.0.0',
    private: true,
    scripts: {
      test: 'mocha',
      //TODO
      postinstall: 'patch-package --patch-dir ./node_modules/@apispec/runner/patches'
    },
    dependencies: {
      '@apispec/runner': '^' + version
    }
  };

  if (useLocalApispec) {
    packageJson.workspaces = ["../apispec/*"]
  }

  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL
  );

  const mochaOpts = {
    ui: '@apispec/runner/bdd-options',
    recursive: true,
    reporter: 'mochawesome',
    reporterOptions: ['reportDir=report', 'reportFilename=index', 'inline=true', 'code=false', 'htmlModule=@apispec/html-report']
  };
  fs.writeFileSync(
    path.join(root, '.mocharc.json'),
    JSON.stringify(mochaOpts, null, 2) + os.EOL
  );

}

module.exports = createSpec;

function checkAppName(appName) {
  const validationResult = validateProjectName(appName);
  if (!validationResult.validForNewPackages) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${appName}"`
      )} because of npm naming restrictions:`
    );
    printValidationResults(validationResult.errors);
    printValidationResults(validationResult.warnings);
    process.exit(1);
  }

  // TODO: there should be a single place that holds the dependencies
  const dependencies = ['react', 'react-dom', 'react-scripts'].sort();
  if (dependencies.indexOf(appName) >= 0) {
    console.error(
      chalk.red(
        `We cannot create a project called ${chalk.green(
          appName
        )} because a dependency with the same name exists.\n` +
        `Due to the way npm works, the following names are not allowed:\n\n`
      ) +
      chalk.cyan(dependencies.map(depName => `  ${depName}`).join('\n')) +
      chalk.red('\n\nPlease choose a different project name.')
    );
    process.exit(1);
  }
}

function printValidationResults(results) {
  if (typeof results !== 'undefined') {
    results.forEach(error => {
      console.error(chalk.red(`  *  ${error}`));
    });
  }
}
