#!/usr/bin/env node

var run = require('runjs').run
var chalk = require('chalk')
var emoji = require('node-emoji').get

try {
  var packageName = process.argv[2]
} catch (e) {
  throw 'Package name not given!'
}

var cwd = './' + packageName

try {
  run('git clone https://github.com/pawelgalazka/firenpm.git ' + packageName)
  run('rm -rf .git', {cwd: cwd})
  run('npm init', {cwd: cwd})
  run('npm install --save-dev firenpm', {cwd: cwd})
} catch (e) {
  console.log(chalk.red.bold('Bummer! Looks like something went wrong...'))
  throw e.stack
}

console.log(chalk.green.bold('All set! You can start rolling! '),  emoji(':muscle:') + ' ' + emoji(':beer:') + ' ' + emoji(':fire:'))
