# Express 光速入门

> 发布于 2021.05.01，最后更新于 2021.05.01。

![express](https://camo.githubusercontent.com/0566752248b4b31b2c4bdc583404e41066bd0b6726f310b73e1140deefcc31ac/68747470733a2f2f692e636c6f756475702e636f6d2f7a6659366c4c376546612d3330303078333030302e706e67)

## （一）Express 的一二事

[Express](https://github.com/expressjs/express) 是基于 NodeJS 的快速、开放、极简的 Web 开发框架

Express 的一些功能特性：

* Robust routing：稳健的路由系统；
* Focus on high performance：聚焦与高性能；
* Super-high test coverage：超高的测试覆盖率；
* HTTP helpers (redirection, caching, etc)：HTTP helpers（重定向、缓存等）；
* View system supporting 14+ template engines：拥有支持 14 余种模板引擎的视图系统；
* Content negotiation：内容协商；
* Executable for generating applications quickly：拥有可快速构建应用的脚手架工具 [express-generator](https://github.com/expressjs/generator)。

一些其他流行的 NodeJS 框架是基于 Express 打造的，比如 [NestJs](https://github.com/nestjs/nest)：一个用于构建 NodeJs 服务端应用的高效、可扩展框架。它使用了现代化 JavaScript，源码基于 TypeScript，并同时结合了 OOP（面向对象编程）、FP（函数式编程）以及 FRP（函数响应式编程）。

## （二）快速创建 Express 应用

### express-generator

使用 [express-generator](https://github.com/expressjs/generator)（Express 应用程序生成器）可以快速创建一个初始 express 应用。

#### 创建项目的流程

**1.安装 express-generator**

`yarn add express-generator -D` 安装（也可以执行 `yarn global add express-generator` 全局安装）后，通过 `express -v` 查看到版本表示安装成功。

**2.使用 express-generator 创建项目**

执行 `express 项目名` 会在当前目录创建指定项目名的项目，如 `express hello-express`。

**3.安装项目依赖包**

进入项目目录：`cd hello-express`，然后 `yarn` 安装所需依赖

**4.启动服务**

执行 `yarn start` 启动服务，可以用浏览器查看 `http://localhost:3000` 来验证。

#### 目录结构介绍

通过生成器创建的应用一般都有如下目录结构：

```
├── app.js // 入口文件
├── bin // 项目启动配置
│   └── www // 启动文件
├── package.json
├── public // 静态资源文件
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes // 路由
│   ├── index.js
│   └── users.js
└── views // 视图模板引擎
    ├── error.jade
    ├── index.jade
    └── layout.jade
```

### nodemon

<img src="https://user-images.githubusercontent.com/13700/35731649-652807e8-080e-11e8-88fd-1b2f6d553b2d.png" width="120"/>

[nodemon](https://github.com/remy/nodemon) 是帮助开发 nodejs 应用的自动重启服务工具。当监测到目录中的文件变更时，nodemon 可以自动重启 node 服务。

`yarn add nodemon -D` 安装（也可以执行 `yarn global add nodemon` 全局安装）后，通过 `nodemon --version` 查看到版本表示安装成功。

然后找到 `package.json` 文件，替换 `package.json` 中的 `scripts` 中的 `"start": "node ./bin/www"` 为 `"start": "nodemon ./bin/www"`。启动服务即可。

## （三）基础路由

对于不同的请求 URI（或路径）、不同的请求方式（GET、POST 等），使用路由对请求进行处理，并返回响应数据。

当路由匹配命中时，设置的 1 个或多个处理函数将会依次执行。

使用如下语法结构来定义路由：

`app.METHOD(PATH, HANDLER)`

这其中：

* `app`：express 的实例；
* `METHOD`：HTTP 请求方式，小写；
* `PATH`：请求路径；
* `HANDLER`：路由命中时执行的处理函数。

以下是一些定义路由的简单示例：

* GET 请求：`app.get('/', (req, res) => { res.send('Hello World') })`
* POST 请求：`app.post('/', (req, res) => { res.send('Got a POST request') })`
* PUT 请求：`app.put('/user', (req, res) => { res.send('Got a PUT request at /user') })`
* DELETE 请求：`app.delete('/user', function (req, res) { res.send('Got a DELETE request at /user') })`

## （四）托管静态资源

可以用 Express 内置的中间件函数 `express.static` 来托管图片、CSS 和 JS 之类的静态资源文件：

`express.static(root, [options])`

其中：

* root：要托管的静态资源根目录；
* options：可选的配置项，可参考 [express.static](https://www.expressjs.com.cn/4x/api.html#express.static)。

例如，如下代码就可以将 `public` 目录下的图片、CSS、JS 文件对外开放访问了：

`app.use(express.static(path.join(__dirname, 'public')));`

这行代码在使用 `express-generator` 生成的项目中的 `app.js` 中。

这样，就可以通过浏览器访问 `public` 目录中的所有静态资源文件了：

```
http://localhost:3000/images/kitten.jpg
http://localhost:3000/css/style.css
http://localhost:3000/js/app.js
http://localhost:3000/hello.html
```

如果要使用多个静态资源目录，多次调用 `express.static` 中间件函数即可。

如果想创建一个虚拟路径前缀（就是访问的路径并不是在文件目录中真实存在的），可以这样做：

`app.use('/static', express.static(path.join(__dirname, 'public'))`

这样，就可以通过带有 `/static` 前缀地址来访问 `public` 目录中的文件了：

```
http://localhost:3000/static/images/kitten.jpg
http://localhost:3000/static/css/style.css
```

更多关于 serve-static 内容可参考 [serve-static | Github](https://github.com/expressjs/serve-static)

## （五）请求对象 req 和响应对象 res

`req` 和 `res` 分别代表 HTTP 请求和响应，先看一个简单示例：

``` js
// req 和 res 是形参，你可以任意命名
app.get('/user/:id', function (req, res) {
  res.send(`user ${req.params.id}`)
})
```

### 请求对象 req

`req` 对象代表 HTTP 请求，该对象上有着请求的 `query string`、`parameters`、`body`、`HTTP headers` 等信息的属性。

下面介绍 `req` 对象上的几个常用属性

#### req.query

[req.query](https://www.expressjs.com.cn/5x/api.html#req.query) 是一个对象，该对象属性是路由中传参的 `query string`（查询字符串），一般用于 GET 请求中获取参数。

一些特殊的例子：

``` js
// GET /search?q=tobi+ferret
console.dir(req.query.q)
// => "tobi ferret"

// GET /shoes?order=desc&shoe[color]=blue&shoe[type]=converse
console.dir(req.query.order)
// => "desc"

console.dir(req.query.shoe.color)
// => "blue"

console.dir(req.query.shoe.type)
// => "converse"

// GET /shoes?color[]=blue&color[]=black&color[]=red
console.dir(req.query.color)
// => [blue, black, red]
```

#### req.body

[req.body](https://www.expressjs.com.cn/5x/api.html#req.body) 该属性包含了 `request body`（请求体）中的键值对内容。一般用于 POST 请求中获取参数。

比如一个 POST 请求的 postData 是这样的：

``` js
// 这里使用了前端 axios 库来发请求
axios.post('/login', {
  username: 'roc-an',
  password: '123456'
})
```

那么在 Express 程序中可以这样拿到请求数据：

``` js
router.post('/login', (req, res) => {
  const { username, password } = req.body
  console.log(username, password)
})
```

关于 `req` 的详细官方文档可在这里查阅：[Request | Express](https://www.expressjs.com.cn/5x/api.html#req)

### 响应对象 res

`res` 对象代表着当收到 HTTP 请求后，Express 应用发送的 HTTP 响应。

下面介绍 `res` 对象上的几个常用属性

#### res.send([body])

用于发送 HTTP 响应。`body` 参数可以是一个 `Buffer` 对象、字符串、对象、布尔值或者数组。例如：

``` js
res.send(Buffer.from('whoop'))
res.send({ some: 'json' })
res.send('<p>some html</p>')
res.status(404).send('Sorry, we cannot find that!')
res.status(500).send({ error: 'something blew up' })
```

对于一般的非文件流响应，该方法完成了许多非常有用的任务。

比如，它自动指定了 `Content-Length` 这个 HTTP 响应头字段（除非提前自定义），并且还提供了自动的 `HEAD` 和 `HTTP` 缓存的保鲜支持。

当参数是一个 `Buffer` 对象，该方法会设置 `Content-Type` 这个响应头字段为 `"application/octet-stream"`，除非像这样进行了自定义：

``` js
res.set('Content-Type', 'text/html')
res.send(Buffer.from('<p>some html</p>'))
```

如果参数是一个字符串，该方法会设置 `Content-Type` 为 `text/html`：`res.send('<p>some html</p>')`

如果参数被设为数组或对象，Express 会返回 JSON 数据：

``` js
res.send({ user: 'tobi' })
res.send([1, 2, 3])
```

#### res.render(view [, locals] [, callback])

渲染视图，并发送渲染的 HTML 字符串给客户端。可选的参数：

* `locals`：对象，它的属性是传递给视图用于渲染的变量；
* `callback`：回调函数。一旦设置，该方法会返回可能的错误对象和渲染字符串，但不会自动进行响应。发生错误时，该方法内部调用 `next(err)`。

`view` 参数是用于渲染的视图文件路径的字符串。

该字符串可以是绝对路径或者是相对于 `views` 设置的相对路径。如果路径中没包含文件扩展名，那么 `view engine` 的设置会决定扩展名，Express 使用指定的模板引擎（通过 `require()`）加载模块，并且使用已加载模块的 `__express` 函数来渲染。

更多信息参考 [Using template engines with Express](https://www.expressjs.com.cn/guide/using-template-engines.html)

``` js
// 向客户端发送渲染的视图
res.render('index')

// 如果指定了回调函数, 那么应明确地发送渲染的 HTML 字符串
res.render('index', function (err, html) {
  res.send(html)
})

// 向视图传递本地变量
res.render('user', { name: 'Tobi' }, function (err, html) {
  // ...
})
```

关于 `res` 的详细官方文档可在这里查阅：[Response | Express](https://www.expressjs.com.cn/5x/api.html#res)

## （六）Node.js 连接并查询 MySQL

这里要使用 [mysql](https://github.com/mysqljs/mysql) 这个库。它是面向 MySQL 数据库的 nodeJS 驱动程序。它是用 js 写的，不需要任何的编译。

安装：`yarn add mysql`

创建、打开连接的示例：

``` js
const mysql = require('mysql')

// 创建连接
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'test'
});

// 打开连接
connection.connect();
```

在路由中查询数据库并返回结果的示例：

``` js
router.get('/userList', (req, res, next) => {
  const sql = 'SELECT * FROM user;'

  connection.query(sql, (err, results, fields) => {
    if (err) throw err
    res.send({
      code: 0,
      data: results
    })
  })
});
```

这其中：

* 在连接（connection）上调用的方法都会排队并依次执行；
* 可以通过 `connection.end()` 方法来关闭数据库连接。该方法确保了向 MySQL 服务发送退出包之前所有剩余查询都执行完毕。

## （七）允许跨域

### 什么是同源策略及限制

源：协议、域名、端口
跨域：两个源对比，以上三者中，有一个不同，就形成跨域

同源策略限制从一个源加载的文档或脚本如何与来自另一个源的资源进行交互。这是一个用于隔离潜在恶意文件的关键的安全机制。

即：一个源的文档没有权利去操作另一个源的文档

限制点：

* Cookie、LocalStorage、IndexDB 无法获取
* DOM 无法获得
* AJAX 请求不能发送

### 跨域通信的几种方式

* JSONP：利用 `<script>` 标签的异步加载实现（`<script>` 标签引资源没有同源限制）；
* Hash：Hash 改变，页面不会刷新；
* postMessage：H5 新增；
* WebSocket；
* CORS：新的通信标准，支持跨域通信的 AJAX。浏览器在请求头中用 `Origin` 字段说明本次请求来自哪个源（协议+域名+端口），服务器根据 `Origin` 字段值判断是否在许可范围内，若许可，响应头中包含 `Access-Control-Allow-Origin` 字段，以支持跨域请求。

### 在 Express 中支持跨域

``` js
// 设置允许跨域
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
```

其中：

* [app.all](https://www.expressjs.com.cn/5x/api.html#app.all) 会根据路径匹配所有的 HTTP 动词，并执行回调；
* [res.header](http://expressjs.com/en/5x/api.html#res.set) 设置响应头字段

关于回调函数中的 `next` 方法：

`app.all` 方法以及其他大多数实例方法，可传的回调可以是多个：`app.all(path, callback [, callback ...])`

在回调中执行 `next` 方法，可以跳过其余未执行的回调。所以可以使用这个机制来为路由设置前置条件，然后在没理由继续进行当前路由时，将控制权传递给后续的路由。

## （八）相关阅读推荐

* [MySQL 数据库边学边练光速入门](https://github.com/roc-an/blog/issues/1)