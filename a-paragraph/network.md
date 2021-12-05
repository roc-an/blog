# 一段话说透一个前端知识点 - 网络请求

## HTTP 常见状态码有哪些？

状态码分类：

* 1xx：服务器收到请求：服务器收到了前端发送的请求，但还没返回
* 2xx：请求成功
* 3xx：重定向：服务端告知客户端去其他地址访问
* 4xx：客户端错误
* 5xx：服务端错误

常见状态码：

* 200：请求成功，服务端把成功的资源返回

* 301：永久重定向（配合 `Response Header` 的 `Location` 字段新地址，浏览器自动处理）：之后再次访问该地址，直接用 `location` 跳转新地址
  * 适用于网站域名到期，或者想换域名了，这时候访问老域名，返回 301 并 `location` 是新域名
* 302：临时重定向（配合 `Response Header` 的 `Location` 字段新地址，浏览器自动处理）：仅本次会重定向
  * 比如搜索引擎、邮箱、知乎、短网址等等，都是先跳转自己的域名，再跳转到其他目标域名
* 304：资源未被修改：向服务端请求资源，该资源之前客户端已经请求过了，没过期，可以使用客户端缓存

* 403：没有权限：比如没登录、没有对应的角色权限
* 404：资源未找到

* 500：服务器错误
* 504：网关超时：能访问通服务器，多台服务器跳转处理时可能超时了

## HTTP 方法有哪些？

* GET：获取服务器数据
* POST：向服务器新建数据
* PATCH/PUT：更新数据
* DELETE：删除数据

## 什么是 Restful API？

Restful API 是一种 API **设计方法**。**Restful API 把每个 URL 当做一个唯一的资源标识**。

* 用 HTTP 请求方法表示操作类型：
  * POST 请求 `/api/blog`，新建博客
  * GET 请求 `/api/blog/100`，获取 ID 为 `100` 的博客
  * PATCH 请求 `api/blog/100`，更新 ID 为 `100` 的博客
* 尽量不用 URL 参数：
  * 传统 API 设计：`/api/list?pageIndex=2`，更像是功能，请求页数为 2 `list` 数据
  * Restful API 设计：`/api/list/2`，把 `list` 当作资源

## HTTP 有哪些常见的 Header？

常见的请求头 Request Header：

* `Accept`： 浏览器可接收的数据格式
* `Accept-Encoding`：浏览器可接收的压缩算法，比如 gzip。服务器按此格式进行数据压缩，浏览器收到数据后解压缩
* `Accept-Language`：浏览器可接收的语言，比如 zh-CN
* `Connection: keep-alive`：一次 TCP 连接可重复使用
  * HTTP 是单次无状态连接，每次请求都连接一次是比较消耗资源的，HTTP2 支持 Keep Alive，客户端与服务器建立连接后可以重复使用该连接
* `Cookie`：每次同域请求资源都会带上
* `Host`：请求的服务器域名
* `User-Agent`：简称 UA，浏览器信息
* `Content-Type`：发送数据的格式，如 `application/json`，一般用于 POST 请求

常见的响应头 Response Header：

* `Content-Type`：返回数据的格式，如 `application/json`
* `Content-Length`：返回数据的大小，多少字节
* `Content-Encoding`：返回数据的压缩算法，如 gzip。告诉浏览器数据使用什么算法压缩的
* `Set-Cookie`：服务端通过该字段设置或更改 Cookie

客户端、服务器也可以自定义 Header。比如使用 axios 自定义 header 的配置项：

```js
headers: { 'X-Requested-With': 'XMLHttpRequest' }
```

Header 的 `key` 和 `value` 都是可以自定义的。比如有些接口需要在 Header 中加一些秘钥或是特定的值来证明身份

## 什么是 Restful API？

## HTTP 缓存机制？
