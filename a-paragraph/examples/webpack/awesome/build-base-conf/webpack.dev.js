const path = require('path')
const webpack = require('webpack')
const webpackCommonConf = require('./webpack.common')
const { merge } = require('webpack-merge')
const { srcPath, distPath } = require('./paths')

module.exports = merge(webpackCommonConf, {
  // 模式
  mode: 'development',
  module: {
    rules: [{ // 直接引入图片 url
      test: /\.(png|jpg|jpeg|gif)$/,
      use: 'file-loader'
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify('development')
    })
  ],
  // 本地服务
  devServer: {
    port: 8080,
    open: true, // 自动打开浏览器
    compress: true, // 启动 Gzip 压缩
    // 设置代理
    proxy: {
      // 将本地 /api/xxx 代理到 localhost:300/api/xxx
      '/api': 'http://localhost:3000',
      // 将本地 /api2/xxx 代理到 localhost:300/xxx
      '/api2': {
        target: 'http://localhost:3000',
        pathRewrite: {
          '/api2': ''
        }
      }
    }
  }
})
