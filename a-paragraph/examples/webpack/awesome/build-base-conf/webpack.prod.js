const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')
const webpackCommonConf = require('./webpack.common')
const { srcPath, distPath } = require('./paths')

module.exports = merge(webpackCommonConf, {
  // 模式
  mode: 'production',
  // 输出
  output: {
    filename: 'bundle.[contenthash:8].js',
    path: distPath,
  },
  // Loaders
  module: {
    rules: [{
      // 图片 - 压缩 base64 编码优化
      test: /\.(png|jpg|jpeg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          // 小于 5kb 的图片用 base64 格式产出
          // 否则，依然沿用 file-loader 形式，产出 url
          limit: 5 * 1024,
          // 打包到 img 目录下
          outputPath: '/img/'
        }
      }
    }]
  },
  plugins: [
    new CleanWebpackPlugin(), // 会默认清空 out.path 目录
    new webpack.DefinePlugin({
      ENV: JSON.stringify('production')
    })
  ]
})
