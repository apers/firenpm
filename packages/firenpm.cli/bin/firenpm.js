#!/usr/bin/env node

const run = require('runjs').run
const path = require('path')
const lib = require('../lib')
const log = lib.log

const FIRENPM_PATH = (process.env.FIRENPM_PATH && path.resolve(process.env.FIRENPM_PATH) + '/') || ''
const NODE_ENV = process.env.NODE_ENV
const PACKAGE_NAME = process.argv[2]
const EXTENSION = lib.getExtension(process.argv[3])
const CWD = path.resolve(`./${PACKAGE_NAME}`)
const TEMPLATE_PATH = path.resolve(CWD, `./node_modules/firenpm/template`)
const EXTENSION_TEMPLATE_PATH = EXTENSION ? path.resolve(CWD, `./node_modules/firenpm.${EXTENSION}/template`) : null

if (!PACKAGE_NAME) {
  throw new Error('Package name not given!')
}

function installPackages () {
  run(`npm install --save-dev --save-exact firenpm`, {cwd: CWD})
  if (EXTENSION) {
    run(`npm install --save-dev --save-exact firenpm.${EXTENSION}`, {cwd: CWD})
  }
}

function linkPackages () {
  run(`npm link ${FIRENPM_PATH}firenpm`, {cwd: CWD})
  if (EXTENSION) {
    run(`npm link ${FIRENPM_PATH}firenpm.${EXTENSION}`, {cwd: CWD})
  }
}

try {
  log('yellow', `Creating directory '${PACKAGE_NAME}'...`)
  run(`mkdir ${PACKAGE_NAME}`)
  run('echo "{}" > package.json', {cwd: CWD})

  log('yellow', 'Installing packages...')
  if (['sandbox', 'test'].indexOf(NODE_ENV) !== -1) {
    linkPackages()
  } else {
    installPackages()
  }

  log('yellow', `Creating directory structure for '${PACKAGE_NAME}'...`)
  run(`rsync -av ${TEMPLATE_PATH}/ ${CWD}/`)
  if (EXTENSION_TEMPLATE_PATH) {
    run(`rsync -av ${EXTENSION_TEMPLATE_PATH}/ ${CWD}/`)
  }

  if (['sandbox', 'test'].indexOf(NODE_ENV) === -1) {
    log('yellow', 'Saving installed firenpm packages to package.json')
    installPackages()
  }

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
