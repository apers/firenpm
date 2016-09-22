var run = require('./firenpm/runjs').run

var task = {
  'link': function() {
    run('npm link', {cwd: './firenpm'})
    run('npm link firenpm', {cwd: '../'})
  },
  'unlink': function() {
    run('npm unlink firenpm', {cwd: '../'})
    run('npm unlink', {cwd: './firenpm'})
  }
}

module.exports = task
