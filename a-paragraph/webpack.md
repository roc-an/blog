# 一段话说透一个前端知识点 - Webpack

## 关于 Webpack 5

* Webpack 5 主要是内部效率的优化
* 对比 Webpack 4，没有太多使用上的改动

升级 Webpack 5 及周边插件后，代码需要做出的调整：

* `package.json` 的 dev-server 命令改了：`"dev": "webpack serve --config build/webpack.dev.js"`
* `webpack-merge`：升级新版本 `const { merge } = require('webpack-merge')`
* `clean-webpack-plugin`：升级新版本 `const { CleanWebpackPlugin } = require('clean-webpack-plugin')`
* `module.rules` 中 `loader: ['xxx-loader']` 换成：`use: ['xxx-loader']`
* `filename: 'bundle.[contenthash:8].js'` 其中 `h` 小写，不能大写

## 基本配置
