import chalk from 'chalk'
import { get as emoji } from 'node-emoji'

export function getExtension (arg) {
  if (!arg) {
    return
  }

  arg = arg.match(/^--(.*)$/)
  arg = arg ? arg[1] : null
  return arg
}

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
