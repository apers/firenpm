import { run } from 'firenpm/runjs'
import path from 'path'

const FIRENPM_PATH = path.resolve('./packages/firenpm')
const FIRENPM_SCRIPT = path.resolve('./packages/firenpm.cli/bin/firenpm.js')

function isolated(callback, finall) {
  run('mv ./node_modules ./.node_modules') // sandbox should not read modules from the directory above
  run('mv ./package.json ./.package.json') // eslint and babel should not read config from the directory above
  try {
    callback()
  } catch (e) {
    throw e.stack
  } finally {
    run('mv ./.package.json ./package.json')
    run('mv ./.node_modules ./node_modules')
    finall && finall()
  }
}

const task = {
  'sandbox:clean': () => {
    run('rm -rf sandbox')
    run('rm -rf packages/firenpm.cli/template/node_modules')
    run('rm -rf packages/firenpm.cli/template.web/node_modules')
  },
  'sandbox:play': (template = 'template') => {
    task['sandbox:clean']()
    run(`mkdir -p packages/firenpm.cli/${template}/node_modules/.bin`)
    run(`ln -s ../../../firenpm packages/firenpm.cli/${template}/node_modules/firenpm`)
    run(`ln -s ../../../firenpm.web packages/firenpm.cli/${template}/node_modules/firenpm.web`)
    run(`ln -s ../../../../firenpm/bin/mocha.js packages/firenpm.cli/${template}/node_modules/.bin/mocha`)
    run(`ln -s ../../../../firenpm/bin/babel.js packages/firenpm.cli/${template}/node_modules/.bin/babel`)
    run(`ln -s ../../../../firenpm/bin/eslint.js packages/firenpm.cli/${template}/node_modules/.bin/eslint`)
    run(`ln -s packages/firenpm.cli/${template} sandbox`)
  },
  'sandbox:run': (...cmd) => {
    run(`(cd sandbox && run ${cmd.join(' ')})`)
  },
  'sandbox:linkcli': () => {
    run('(cd packages/firenpm.cli && npm link)')
  },
  'sandbox:unlinkcli': () => {
    run('(cd packages/firenpm.cli && npm unlink)')
  },
  'publish': () => {
    task['test']()
    run('cp ./README.md packages/firenpm/README.md')
    run('cp ./README.md packages/firenpm.cli/README.md')
    run('cp ./README.md packages/firenpm.web/README.md')
    run('(cd packages/firenpm && npm publish)')
    run('(cd packages/firenpm.cli && npm publish)')
    run('(cd packages/firenpm.web && npm publish)')
  },
  'test': (opt) => {
    task['sandbox:clean']()
    run('mkdir sandbox')
    isolated(() => {
      run(`(cd sandbox && FIRENPM_NOINIT=true FIRENPM_PATH=${FIRENPM_PATH} ${FIRENPM_SCRIPT} test-project)`)
      if (opt !== 'cli') {
        run('(cd sandbox/test-project && run test)')
      }
    }, () => {
      task['sandbox:clean']()
    })
  }
}

export default task
