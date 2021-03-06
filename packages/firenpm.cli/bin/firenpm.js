#!/usr/bin/env node

const run = require('runjs').run
const path = require('path')
const lib = require('../lib')
const log = lib.log
const pckg = require('../package.json')

const FIRENPM_PATH = (process.env.FIRENPM_PATH && path.resolve(process.env.FIRENPM_PATH) + '/') || ''
const NODE_ENV = process.env.NODE_ENV
const ARGS = lib.parseArgs(process.argv)
const PACKAGE_NAME = ARGS.packageName
const EXTENSIONS = ARGS.extensions
const CWD = path.resolve(`./${PACKAGE_NAME}`)

if (!PACKAGE_NAME) {
  throw new Error('Package name not given!')
}

try {
  log('yellow', `Creating directory '${PACKAGE_NAME}'...`)
  run(`mkdir ${PACKAGE_NAME}`)
  run('echo "{}" > package.json', {cwd: CWD})

  log('yellow', 'Installing firenpm extensions...')
  if (['sandbox', 'test'].indexOf(NODE_ENV) !== -1) {
    lib.linkExtensions(run, EXTENSIONS, CWD, FIRENPM_PATH)
  } else {
    lib.installExtensions(run, EXTENSIONS, CWD, pckg.version)
  }

  log('yellow', `Generating directory structure for '${PACKAGE_NAME}'...`)
  lib.copyTemplates(run, EXTENSIONS, CWD)

  log('yellow', 'Saving firenpm extensions to package.json')
  lib.saveExtensions(EXTENSIONS, CWD, pckg)

  log('yellow', 'Installing missed packages from package.json')
  run('npm install', {cwd: CWD})

  if (NODE_ENV !== 'test') {
    log('yellow', 'Defining package.json')
    run('npm init', {cwd: CWD})
  }
} catch (error) {
  log('red', 'Bummer! Looks like something went wrong...')
  throw error.stack
}

run('clear')
lib.printSuccessMessage(PACKAGE_NAME, CWD)
