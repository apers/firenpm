import { run } from 'firenpm/runjs'
import path from 'path'

const FIRENPM_PATH = path.resolve('./packages/firenpm')
const FIRENPM_SCRIPT = path.resolve('./packages/firenpm.cli/bin/firenpm.js')

const task = {
  'firenpm': (projectName) => {
    run('mkdir -p .sandbox')
    run(`(cd .sandbox && FIRENPM_PATH=${FIRENPM_PATH} ${FIRENPM_SCRIPT} ${projectName})`)
  },
  'test': () => {
    run('rm -rf .sandbox')
    run('mkdir .sandbox')
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
