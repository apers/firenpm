import { run } from 'firenpm/runjs'
import path from 'path'

const FIRENPM_PATH = path.resolve('./packages/firenpm')
const FIRENPM_SCRIPT = path.resolve('./packages/firenpm.cli/bin/firenpm.js')

const task = {
  'sandbox:clean': () => {
    run('rm -rf .sandbox')
    run('mkdir .sandbox')
  },
  'sandbox:start': () => {
    task['sandbox:clean']()
    run(`(cd .sandbox && FIRENPM_PATH=${FIRENPM_PATH} ${FIRENPM_SCRIPT} test-project)`)
  },
  'sandbox:run': (...cmd) => {
    run(`(cd .sandbox/test-project && run ${cmd.join(' ')})`)
  },
  'test': () => {
    task['sandbox:clean']()
    run('mv ./node_modules ./.node_modules') // sandbox should not read modules from directory above
    try {
      run(`(cd .sandbox && FIRENPM_PATH=${FIRENPM_PATH} ${FIRENPM_SCRIPT} test-project)`)
      run('(cd .sandbox/test-project && run test)')
      run('(cd .sandbox/test-project && run build)')
    } catch (e) {
      throw e.stack
    } finally {
      run('mv ./.node_modules ./node_modules')
      run('rm -rf .sandbox')
    }
  }
}

export default task
