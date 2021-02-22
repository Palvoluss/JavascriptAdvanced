const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
  new Dotenv({
  path: path.resolve(__dirname, '.env')
}),
  new HtmlWebpackPlugin({
    template: 'src/template.html'
  })],
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.(svg|png|jpg|gif)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'imgs'
        }
      }
    }
    ]
  }
}
