# 一段话说透一个前端知识点 - Webpack

## Webpack 5 新特性概览

* 功能清除：
  * **不再为 Node.js 模块自动引入 polyfills**
  * require.include 语法已经废弃
  * **移除 v4 版本的废弃能力代码**：所有在 v4 被废弃的能力都被清除，因此 4 升 5 需要确保 v4 下没有打印 Warning
* 长期缓存：
  * 新增长期缓存算法，确定 Chunk、模块 ID 和导出名称
  * 真正的内容 Hash
* 开发支持：
  * 命名代码块 ID
  * 模块联邦
* 支持崭新的 Web 平台特性
  * JSON 模块
    * 在使用非默认导出时发出警告
    * 使用默认导出，未使用的属性也会被 `optimization.usedExports` 优化丢弃，属性会被 optimization.mangleExports 优化打乱
  * 资源模块
    * 新写法：支持浏览器原生提供的写法：`new URL('./image.png', import.meta.url)`
    * 老写法：`import url from './image.png'`
  * 原生 Worker 支持：支持 `new Worker(new URL('./worker.js', import.meta.url))`
  * URIS
    * 支持 `data:`
    * 支持 `file:`
    * 支持 `http(s):`
  * 异步模块
    * 异步的外部资源（`async externals`）
    * 新规范中的 WebAssembly 模块
    * 使用顶层 Await 的 ES 模块
* 支持全新的 Node.js 生态特性解析
  * 支持 package.json 中的 exports 和 imports 字段
  * 原生支持 Yarn PnP
* 构建优化：
  * 嵌套的 Tree-Shaking
  * 内部模块 Tree-Shaking
  * CommanJs Tree-Shaking
  * 副作用分析
* 性能优化：
  * 持久缓存
  * 编译器闲置和关闭
  * 文件生成
* 未来计划
  * 实验特性
  * 最小 Node.js 版本

### Webpack 5 持久化缓存

在 Webpack 4 中：

* 可使用 `cache-loader` 将编译结果写入硬盘缓存
* 可使用 `babel-loader`，设置 `option.cacheDirectory` 将 babel-loader 编译结果写进磁盘

Webpack 5 缓存策略：

* 默认开启缓存，缓存在内存中，可对 cache 进行设置
* 缓存淘汰策略：文件缓存存储在 `node_modules/.cache/webpack` 中，最大 500 MB，缓存时长两星期，旧的缓存先淘汰

### Webpack 5 模块联邦

**基本解释：使一个 JS 应用在运行过程中可以动态加载另一个应用的代码，并支持共享依赖（CDN）。不再需要本地安装 NPM 包**

* Remote：被依赖方，被 Host 消费的 Webpack 构建
* Host：依赖方，消费其他 Remote 的 Webpack 构建

一个应用可以是 Host，也可以是 Remote，也可以同时是 Host 和 Remote

模块联邦可以实现微前端。

模块联邦，可以让一个应用动态加载（通过 CDN 的方式加载）另一应用所暴露的代码。比如：应用 A 通过 CDN 加载应用 B，A 和 B 在两个不同的端口。

如果想让一部分代码，在 A 和 B 两个应用间共享，

老版本 Webpack 的做法：

把要共享的代码打成一个 NPM 包，发布，应用 A 和 B 引这个 NPM 包。

而 Webpack 5 的模块联邦，让模块以及组件的代码共享更方便了。尤其在多个应用之间，不用发 NPM 包是很方便的。

#### 模块联邦 ModuleFederationPlugin 用法介绍



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
  * 小图片 Base64 编码
  * Bundle 文件名加 Hash，以便命中浏览器缓存
  * 懒加载
  * 公共代码抽离
  * IgnorePlugin
  * 使用 CDN 加速
    * 打包时自动在静态资源 URL 前加 CDN 域名前缀
    * 把静态资源上传到 CDN 服务器以备后续访问
  * 设置 `production` 模式，诸多好处：
    * 自动开启代码压缩
    * Vue、React 等会自动删除调试代码，比如开发环境的 Warning
    * 启动 Tree Shaking：根据 `import`、`export` 将代码中未使用的导出代码删掉
  * Scope Hosting
    * 将多个文件模块函数合并成 1 个，代码体积更小
    * 创建的函数作用域更少，JS 执行更快

其中，`IgnorePlugin` 插件 VS `noParse` 选项：

* `IgnorePlugin`：直接不引入，代码中没有。既优化了构建速度，又缩小了打包体积
* `noParse`：引入，代码中有，但是不经过打包

关于开启多进程：

* 如果项目较大，打包较慢，开启多进程能显著提速
* 如果项目很小，本身打包速度已经比较快了，开启多进程可能反而会降低速度，因为有进程开销

### 初级分析：使用内置的 stats

Webpack 内置的 stats 变量可以帮我们分析构建的一些基本信息：

* 构建时间
* 每个构建出的资源的大小

在 `package.json` 中：

```json
"scripts": {
  "build:stats": "webpack --env production --json > stats.json"
}
```

使用 stats 的缺点是：颗粒度太粗，看不出问题所在：

* 对于某些资源为什么这么大，是没法深入分析的
* 对于哪个 Loader 耗时久，也没法分析

### 速度分析：使用 speed-measure-webpack-plugin

配置示例：

```js
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const smp = new SpeedMeasurePlugin();

// 包裹 Webpack 配置
const webpackConfig = smp.wrap({
  plugins: [
    new MyPlugin(),
    new MyOtherPlugin()
  ]
});
```

速度分析插件的作用：

* 分析打包总耗时
* 分析每个 Loader 和插件耗时

耗时高亮显示：耗时过久会标红，正常较慢会标黄，正常标绿

### 体积分析：使用 webpack-bundle-analyzer

配置示例：

```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```

构建完成后，默认会在 8888 端口展示包体积分析

举几个优化案例：

* 发现 `node_modules` 中 `babel-polyfill` 体积较大，而几乎所有页面都要用，为此可以让它上 CDN 而不进行打包（当然，`babel-polyfill` 还有更好的针对性解决方案）
* 发现某个第三方库 `nowjs.js` 包体积较大，那可以去看看是否使用了所有函数，可以将其拆分模块，按需引入模块
* 发现某个业务组件体积过大，可以考虑懒加载

可以分析哪些问题？

* 依赖的第三方模块大小
* 业务组件代码大小

## 编写 Loader 和插件

### Loader 的链式调用与执行顺序

**Loader 定义：Loader 只是一个导出为函数的 JS 模块**

一个最简单的 Loader 代码结构：

```js
module.exports = function(source) {
  return source;
}
```

多 Loader 执行顺序：

* 多个 Loader 串行执行，前一个 Loader 的输出作为后一个 Loader 的输入
* 执行顺序是从后往前

多 Loader 示例：

```js
module.exports = {
  module: {
    rules: [{
      test: /\.less$/,
      user: [
        'style-loader',
        'css-loader',
        'less-loader'
      ]
    }]
  }
}
```

### 函数组合的两种情况

要理解 Loader 的执行顺序，前提是理解“函数组合的两种情况”

* 第一种：类似 Unix 中的 pipeline（管道），从左往右
* 第二种：Compose 函数：`compose = (f, g) => (...args) => f(g(...args))`，从右往左

Webpack 采用的就是 Compose 函数方式

### 神器 loader-runner

定义：loader-runner 可以在不安装 Webpack 的情况下运行 loaders

作用：

* 作为 Webpack 的依赖，Webpack 中使用它执行 Loader
* 进行 Loader 的开发和调试

Loader Runner 为 Loader 的运行提供了一个独立的环境

Loader Runner 的使用：

```js
import { runLoaders } from "loader-runner";

runLoaders({
	resource: "/abs/path/to/file.txt?query", // Loader 要解析的静态资源绝对路径
	loaders: ["/abs/path/to/loader.js?query"], // 可传递多个 Loaders
	context: { minimize: true }, // 基础 Loader 上下文环境之外的额外上下文
	processResource: (loaderContext, resourcePath, callback) => { ... },
	readResource: fs.readFile.bind(fs) // 通过什么样的方式去查询 resource
}, function(err, result) {
	// err: Error?
	// result.result: Buffer | String
})
```

### 编写 Loader

使用 `webpack-cli` 执行 `webpack-cli generate-loader` 来初始化一个 Loader 项目

一个简单的 raw-loader，将文件转换为字符串：

```js
module.exports = function(source) {
  // 考虑 ES6 模板字符串安全性
  const json = JSON.stringify(source)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  return `export default ${json}`;
}
```
