const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { srcPath, distPath } = require('./paths')

module.exports = {
  // 入口
  entry: path.join(srcPath, 'index'),
  // Loaders
  module: {
    rules: [{ // ES6+ 转 ES5
      test: /\.js$/,
      use: ['babel-loader'],
      include: srcPath,
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      // loader 执行顺序是从后往前
      use: ['style-loader', 'css-loader', 'postcss-loader']
    }, {
      test: /\.less$/,
      use: ['style-loader', 'css-loader', 'less-loader']
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
