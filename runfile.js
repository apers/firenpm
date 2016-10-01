import { run } from './packages/firenpm/runjs'
import path from 'path'
import fs from 'fs'
import jsonfile from './packages/firenpm.cli/node_modules/jsonfile'
import pckg from './packages/firenpm.cli/package.json'

const FIRENPM_PATH = path.resolve('./packages')
const FIRENPM_SCRIPT = path.resolve('./packages/firenpm.cli/bin/firenpm.js')
const PACKAGES = fs.readdirSync(FIRENPM_PATH)
const EXTENSIONS = PACKAGES.map(pckg => pckg.split('.')[1]).filter(ext => ext && ext !== 'cli')
const VERSION = pckg.version
const IS_STABLE = !!VERSION.match(/^\d+\.\d+\.\d+$/)

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

function updateVersion (file, version) {
  file = path.resolve(file)
  let json = jsonfile.readFileSync(file)
  json.version = version
  jsonfile.writeFileSync(file, json, {spaces: 2})
  console.log(`Updated to version ${version} for file ${file}`)
}

const task = {
  'info': () => {
    console.log('FIRENPM_PATH', FIRENPM_PATH)
    console.log('FIRENPM_SCRIPT', FIRENPM_SCRIPT)
    console.log('PACKAGES', PACKAGES)
    console.log('EXTENSIONS', EXTENSIONS)
    console.log('VERSION', VERSION)
    console.log('IS_STABLE', IS_STABLE)
  },
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
      run('(cd sandbox && firenpm test-project)')
      run('(cd sandbox/test-project && run test)')
      EXTENSIONS.forEach((extension) => {
        run('rm -rf sandbox/test-project')
        run(`(cd sandbox && firenpm test-project --${extension})`)
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
  'publish': (version) => {
    if (!version) {
      throw new Error('Version not given!')
    }
    task['test']()
    console.log('Copy readme...')
    run('cp ./README.md packages/firenpm/README.md')
    run('cp ./README.md packages/firenpm.cli/README.md')
    run('cp ./README.md packages/firenpm.web/README.md')

    console.log('Update versions in package.json files...')
    updateVersion('./packages/firenpm/package.json', version)
    updateVersion('./packages/firenpm.cli/package.json', version)
    updateVersion('./packages/firenpm.web/package.json', version)
    run('git add ./packages/firenpm/package.json')
    run('git add ./packages/firenpm.cli/package.json')
    run('git add ./packages/firenpm.web/package.json')
    run(`git commit -m "Update version to ${version}"`)
    run('git push')

    console.log('Publish packages...')
    run('(cd packages/firenpm && npm publish)')
    run('(cd packages/firenpm.cli && npm publish)')
    run('(cd packages/firenpm.web && npm publish)')

    console.log('Test production (from npm registry)...')
    task['test:production'](version)

    if (version.match(/^\d+\.\d+\.\d+$/)) {
      console.log('Create git tag (stable version recognized)...')
      run(`git tag -a v${version} -m "${version}"`)
      run(`git push origin v${version}`)
    }
  }
}

export default task
