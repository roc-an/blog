const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { srcPath, distPath } = require('./paths')

module.exports = {
  // 入口
  entry: path.join(srcPath, 'index'),
  // Loaders
  module: {
    rules: [{
      test: /\.js$/,
      loader: ['babel-loader'],
      include: srcPath,
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      // loader 执行顺序是从后往前
      loader: ['style-loader', 'css-loader', 'postcss-loader']
    }, {
      test: /\.less$/,
      loader: ['style-loader', 'css-loader', 'less-loader']
    }]
  },
  plugins: [
    // 将资源自动引入到 HTML 模板
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index.html'),
      filename: 'index.html'
    })
  ]
}
