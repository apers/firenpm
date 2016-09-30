module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: './build'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: 'build',
    inline: true
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'firenpm.web/babel-loader' },
      { test: /\.json$/, loader: 'firenpm.web/json-loader' },
      { test: /\.css$/, loader: 'firenpm.web/style-loader!firenpm.web/css-loader' },
      { test: /\.(png|jpg)$/, loader: 'firenpm.web/url-loader?limit=8192' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  }
}