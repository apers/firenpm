import { run } from 'firenpm/runjs'
import path from 'path'

const FIRENPM_PATH = path.resolve('./packages/firenpm')
const FIRENPM_SCRIPT = path.resolve('./packages/firenpm.cli/bin/firenpm.js')

function isolated(callback) {
  run('mv ./node_modules ./.node_modules') // sandbox should not read modules from the directory above
  run('mv ./package.json ./.package.json') // eslint and babel should not read config from the directory above
  try {
    callback()
  } catch (e) {
    throw e.stack
  } finally {
    run('mv ./.package.json ./package.json')
    run('mv ./.node_modules ./node_modules')
  }
}

const task = {
  'sandbox:clean': () => {
    run('rm -rf sandbox')
    run('rm -rf packages/firenpm.cli/template/node_modules')
  },
  'sandbox:play': () => {
    task['sandbox:clean']()
    run('mkdir -p packages/firenpm.cli/template/node_modules/.bin')
    run('ln -s ../../../firenpm packages/firenpm.cli/template/node_modules/firenpm')
    run('ln -s ../../../../firenpm/bin/mocha.js packages/firenpm.cli/template/node_modules/.bin/mocha')
    run('ln -s ../../../../firenpm/bin/babel.js packages/firenpm.cli/template/node_modules/.bin/babel')
    run('ln -s ../../../../firenpm/bin/eslint.js packages/firenpm.cli/template/node_modules/.bin/eslint')
    run('ln -s packages/firenpm.cli/template sandbox')
  },
  'sandbox:run': (...cmd) => {
    isolated(() => {
      run(`(cd sandbox/test-project && run ${cmd.join(' ')})`)
    })
  },
  'test': () => {
    task['sandbox:clean']()
    run('mkdir sandbox')
    isolated(() => {
      run(`(cd sandbox && FIRENPM_NOINIT=true FIRENPM_PATH=${FIRENPM_PATH} ${FIRENPM_SCRIPT} test-project)`)
      run('(cd sandbox/test-project && run test)')
      run('(cd sandbox/test-project && run build)')
    })
  }
}

export default task
