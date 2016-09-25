#!/usr/bin/env node

const run = require('runjs').run
const chalk = require('chalk')
const emoji = require('node-emoji').get
const path = require('path')

const FIRENPM_PATH = process.env.FIRENPM_PATH && path.resolve(process.env.FIRENPM_PATH)
const TEMPLATE_PATH = path.resolve(__dirname, '../template')
const FIRENPM_NOINIT = process.env.FIRENPM_NOINIT

try {
  var packageName = process.argv[2]
} catch (e) {
  throw 'Package name not given!'
}

const CWD = path.resolve('./' + packageName)

try {
  console.log(chalk.yellow.bold(`Creating directory structure for '${packageName}'...`))
  run(`rsync -av --exclude=node_modules ${TEMPLATE_PATH}/ ${CWD}/`)
  if (!FIRENPM_NOINIT) {
    console.log(chalk.yellow.bold('Defining package.json'))
    run('npm init', {cwd: CWD})
  }
  console.log(chalk.yellow.bold('Installing packages...'))
  if (FIRENPM_PATH) {
    run(`npm install --save-dev --save-exact ${FIRENPM_PATH}`, {cwd: CWD})
  } else {
    run('npm install --save-dev --save-exact firenpm', {cwd: CWD})
  }
} catch (e) {
  console.log(chalk.red.bold('Bummer! Looks like something went wrong...'))
  throw e.stack
}

run('clear')
console.log(chalk.green.bold('All set! You can start rolling! '),  emoji(':muscle:') + ' ' + emoji(':beer:') + ' ' + emoji(':fire:'))
console.log(`Created '${packageName}' project at ${CWD}
Now just:

  cd ${packageName}
  run test
  
Visit '${packageName}/runfile.js' to see more commands.
`)
