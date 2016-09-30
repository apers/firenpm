const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./config')

function serve(entry) {
  const cfg = Object.assign({}, config, {
    entry: entry
  })

  const compiler = webpack(config)
  const server = new WebpackDevServer(compiler)
  server.listen(8080)
}

module.exports = serve
