module.exports = {
  entry: '',
  output: {
    filename: 'bundle.js',
    path: './build',
    publicPath: 'http://localhost:8080/'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: 'build',
    inline: true
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  }
}