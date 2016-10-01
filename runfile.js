import { run } from './packages/firenpm/runjs'
import path from 'path'
import pckg from './packages/firenpm.cli/package.json'

const FIRENPM_PATH = path.resolve('./packages')
const FIRENPM_SCRIPT = path.resolve('./packages/firenpm.cli/bin/firenpm.js')
const EXTENSIONS = ['web']

function isolated (callback, finall) {
  run('mv ./package.json ./.package.json') // eslint and babel should not read config from the directory above
  const clean = () => {
    run('mv ./.package.json ./package.json')
    finall && finall()
  }
  process.on('SIGINT', clean)
  try {
    callback()
  } catch (e) {
    throw e.stack
  } finally {
    clean()
  }
}

const task = {
  'sandbox:clean': () => {
    run('rm -rf sandbox')
    task['sandbox:unlink']('firenpm')
    task['sandbox:unlink']('firenpm.web')
  },
  'sandbox:run': (...cmd) => {
    run(`(cd sandbox/test-project && run ${cmd.join(' ')})`)
  },
  'sandbox:link': (pck) => {
    run(`(cd packages/${pck} && npm link)`)
  },
  'sandbox:unlink': (pck) => {
    run(`(cd packages/${pck} && npm unlink)`)
  },
  'sandbox': (extension) => {
    task['sandbox:clean']()
    run('mkdir sandbox')
    extension = extension ? ` --${extension}` : ''
    run(`(cd sandbox && NODE_ENV=sandbox FIRENPM_PATH=${FIRENPM_PATH} ${FIRENPM_SCRIPT} test-project${extension})`)
  },
  'lint': (path = '.') => {
    run(`./packages/firenpm/bin/eslint.js ${path}`)
  },
  'lint:fix': (path = '.') => {
    run(`./packages/firenpm/bin/eslint.js ${path} --fix`)
  },
  'build:cli': () => {
    run('rm -rf ./packages/firenpm.cli/lib')
    run('mkdir ./packages/firenpm.cli/lib')
    run('./packages/firenpm/bin/babel.js ./packages/firenpm.cli/src --out-dir ./packages/firenpm.cli/lib')
  },
  'test:unit': () => {
    task['build:cli']()
    run('./packages/firenpm/bin/mocha.js ./packages/firenpm.cli/test/*.test.js --compilers js:./packages/firenpm/babel-register')
  },
  'test:extension': (extension) => {
    task['sandbox:clean']()
    run('mkdir sandbox')
    if (!extension) {
      task['test:unit']()
    }
    extension = extension ? ` --${extension}` : ''
    isolated(() => {
      run(`(cd sandbox && NODE_ENV=test FIRENPM_PATH=${FIRENPM_PATH} ${FIRENPM_SCRIPT} test-project${extension})`)
      run('(cd sandbox/test-project && run test)')
    }, () => {
      task['sandbox:clean']()
    })
  },
  'test:production': (version) => {
    run('mkdir sandbox')
    isolated(() => {
      run('npm -g install firenpm.cli@' + version)
      run('(cd sandbox && firenpm test-project)');
      run('(cd sandbox/test-project && run test)')
      EXTENSIONS.forEach((extension) => {
        run('rm -rf sandbox/test-project')
        run(`(cd sandbox && firenpm test-project --${extension})`);
        run('(cd sandbox/test-project && run test)')
      })
    }, () => {
      run('rm -rf sandbox')
      run('npm -g uninstall firenpm.cli')
    })
  },
  'test': () => {
    task['lint']();
    [null, ...EXTENSIONS].forEach((extension) => {
      task['test:extension'](extension)
    })
  },
  'publish': () => {
    task['test']()
    run('cp ./README.md packages/firenpm/README.md')
    run('cp ./README.md packages/firenpm.cli/README.md')
    run('cp ./README.md packages/firenpm.web/README.md')
    run('(cd packages/firenpm && npm publish)')
    run('(cd packages/firenpm.cli && npm publish)')
    run('(cd packages/firenpm.web && npm publish)')
    task['test:production'](pckg.version)
  }
}

export default task
