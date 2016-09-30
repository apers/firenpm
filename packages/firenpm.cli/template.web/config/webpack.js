module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: './demo',
    publicPath: 'http://localhost:8080/'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: 'demo',
    inline: true
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'firenpm.web/babel-loader' },
      { test: /\.json$/, loader: 'firenpm.web/json-loader' },
      { test: /\.css$/, loader: 'firenpm.web/style-loader!firenpm.web/css-loader' },
      { test: /\.(png|jpg)$/, loader: 'firenpm.web/url-loader?limit=8192' }
    ]
  }
}