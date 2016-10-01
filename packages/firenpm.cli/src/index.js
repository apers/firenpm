import chalk from 'chalk'
import path from 'path'
import { get as emoji } from 'node-emoji'

export function printSuccessMessage (packageName, cwd) {
  console.log(chalk.green.bold('All set! You can start rolling! '), emoji(':muscle:') + ' ' + emoji(':beer:') + ' ' + emoji(':fire:'))
  console.log(`Created '${packageName}' project at ${cwd}
Now just:

  cd ${packageName}
  run test
  
Visit '${packageName}/runfile.js' to see more commands.
`)
}

export function log (color, msg) {
  console.log(chalk[color]['bold'](msg))
}

export function installExtensions (run, extensions, cwd, version) {
  run(`npm install --save-dev --save-exact firenpm@${version}`, {cwd})
  extensions.forEach((extension) => {
    run(`npm install --save-dev --save-exact firenpm.${extension}@${version}`, {cwd})
  })
}

export function linkExtensions (run, extensions, cwd, packagesPath) {
  run(`npm link ${packagesPath}firenpm`, {cwd})
  extensions.forEach((extension) => {
    run(`npm link ${packagesPath}firenpm.${extension}`, {cwd})
  })
}

export function copyTemplates (run, extensions, cwd) {
  const TEMPLATE_PATH = path.resolve(cwd, `./node_modules/firenpm/template`)
  run(`rsync -av ${TEMPLATE_PATH}/ ${cwd}/`)
  extensions.forEach((extension) => {
    const EXTENSION_TEMPLATE_PATH = path.resolve(cwd, `./node_modules/firenpm.${extension}/template`)
    run(`rsync -av ${EXTENSION_TEMPLATE_PATH}/ ${cwd}/`)
  })
}

export function parseArgs (args) {
  const packageName = args[2]
  const extensions = args.slice(3).map((arg) => {
    arg = arg.match(/^--(.*)$/)
    arg = arg ? arg[1] : null
    return arg
  }).filter(arg => arg)
  if (!packageName) {
    throw new Error('Package name not given!')
  }
  return {
    packageName,
    extensions
  }
}
