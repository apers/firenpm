export function getExtension (arg) {
  if (!arg) {
    return
  }

  arg = arg.match(/^--(.*)$/)
  arg = arg ? arg[1] : null
  return arg
}
