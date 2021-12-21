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

## Webpack 性能优化

* 优化打包构建速度 - 开发体验和效率
  * 优化 `babel-loader`
    * 开启缓存，那些没有改动的 ES6 代码会缓存住编译结果
    * 通过 `include` 和 `exclude` 来确定范围
  * `IgnorePlugin` 插件：避免引入无用模块
    * 比如某个库（`moment`）支持很多语言，那作为中国用户可以仅引入中文（忽略所有语言包，仅手动引入中文语言包）
  * `noParse`：避免重复打包。对于像 `react.min.js` 这种以 `.min.js` 结尾的文件，都是已经通过模块化处理过的，不需要重新打包
  * `happyPack`：多进程打包
    * Webpack 是基于 NodeJS 的，是单线程运行的，如果能开启多个进程，那将提高运行速度
    * 特别对于多核 CPU，提速效果显著
  * `ParallelUglifyPlugin`：多进程压缩 JS
    * Webpack 内置了 Uglify 工具来压缩 JS
    * 通过 `ParallelUglifyPlugin` 开启多进程，压缩得更快
    * 原理同 `happyPack` 相同
  * 自动刷新浏览器
  * 热更新
  * `DllPlugin`：动态链接库插件
    * 事先将第三方库打包好，后续打包通过 Dll 引用它
    * 前端框架 Vue、React 体积大，构建慢，但是较稳定，不常升级版本
    * 同一个版本只构建一次即可，没必要每次编译都重新构建
    * Webpack 已内置 `DllPlugin` 支持
    * 先通过 `DllPlugin` 将库打包成 dll 文件，后续编译再通过 `DllReferencePlugin` 使用 dll 文件，避免重复打包
* 优化产出代码 - 产品性能
  * 公共代码抽离
  * 文件名加 Hash，以便命中浏览器缓存

其中，`IgnorePlugin` 插件 VS `noParse` 选项：

* `IgnorePlugin`：直接不引入，代码中没有。既优化了构建速度，又缩小了打包体积
* `noParse`：引入，代码中有，但是不经过打包

关于开启多进程：

* 如果项目较大，打包较慢，开启多进程能显著提速
* 如果项目很小，本身打包速度已经比较快了，开启多进程可能反而会降低速度，因为有进程开销
