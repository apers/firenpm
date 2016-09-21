import { run } from 'runjs'

const task = {
  'clean': () => {
    run('rm -rf node_modules')
    run('rm -rf lib')
  },
  'build:clean': () => {
    run('rm -rf lib')
    run('mkdir lib')
  },
  'build': () => {
    task['build:clean']()
    run('babel src --out-dir lib')
  },
  'lint': (path = '.') => {
    run(`eslint ${path}`)
  },
  'lint:fix': (path = '.') => {
    run(`eslint ${path} --fix`)
  },
  'test': (watch = false) => {
    if (watch) {
      watch = watch ? '--watch' : ''
    } else {
      watch = ''
      task['lint']()
    }
    run(`mocha src/*.test.js --require firenpm/mochaccino/dom-setup --compilers js:firenpm/babel-register${watch}`)
  }
}

export default task
