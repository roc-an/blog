# 一段话说透一个前端知识点 - 浏览器

## 网页加载过程？

加载资源的形式：

* HTML 代码
* 多媒体文件，图片、视频等
* CSS、JS 脚本

加载资源的过程：

1. DNS（Domain Name Server）解析：域名 -> IP 地址
  * IP 地址很难记，域名更好记
  * 大型网站的 IP 地址做了分区域，去负载均衡和代理，不同区域内 IP 地址是不同的
  * 在网络中，最终还是通过 IP 地址访问的
2. 浏览器根据 IP 地址向服务器发送请求
  * 真正发起网络请求的是操作系统，浏览器只是调用操作系统的系统服务
  * TCP 3 次握手 -> HTTP 请求 -> TCP 4 次挥手
3. 服务器处理 HTTP 请求，返回资源给浏览器

渲染页面的过程：

1. 根据 HTML 代码生成 DOM Tree
2. 根据 CSS 代码生成 CSSOM（CSS 对象模型，即一个 CSS 结构化的对象）
3. 将 DOM Tree 和 CSSOM 结合，形成 Render Tree 渲染树
  * Render Tree 中的 DOM 对象挂着其 CSS 属性
4. 浏览器根据 Render Tree 渲染页面
5. 如果渲染页面过程中，遇到 `<script>`，会暂停渲染，优先加载并执行 JS 代码，完成后再继续渲染
  * JS 执行和页面渲染是共用同一个线程的，因为 JS 的执行可能会改变 Render Tree 的结构
  * 遇到 `<img src="xxx" />` 这种资源加载并不会阻塞，资源加载后，图片再显示出来
6. 直至将 Render Tree 渲染完成

### `window.onload` 和 `DOMContentLoaded` 区别？

```js
window.addEventListener('load', function() {
  // 页面的全部资源加载完成后才会执行，包括图片、视频、<iframe /> 等
});
document.addEventListener('DOMContentLoaded', function() {
  // DOM 渲染完就执行，此时图片、视频可能没有加载完
})
```

## 渲染流程详解

整个渲染机制比较复杂，浏览器的「渲染模块」在执行时划分了很多子阶段，整个的处理过程可称为「渲染流水线」

### Step 1 - 构建 DOM 树

* 职责：将 HTML 转为浏览器能够理解的 DOM 树结构
* 输入：HTML 文件
* 输出：树结构 DOM

在控制台打印 `document` 可以看到完整 DOM 树结构，**DOM 是保存在内存中的树结构，可以通过 JS 来查询和修改**

## 请描述 Event Loop（事件循环/事件轮询）的机制，可画图

* JS 是单线程运行的
* 异步要基于回调来实现
* Event Loop 就是异步回调的实现原理

JS 如何执行？

* 从前到后，一行行执行
* 如果某一行执行报错，则停止下面代码的执行
* 先把同步代码执行完，再执行异步

JS 引擎中和事件循环有关的一些模块：

* Call Stack，调用栈：用于执行函数代码
* Web APIs：用于完成浏览器提供的一些 API，如 `setTimeout` 的执行
* Event Loop，事件循环
* Callback Queue，回调函数的队列

### 一个简单的 Event Loop 示例

```js
// 1. 将 console.log('Hi') 推入 Call Stack 调用栈
// 2. 执行，控制台打印 'Hi'
console.log('Hi')
// 3. 执行完毕后，清空 Call Stack 调用栈

// 4. setTimeout cb1 推入 Call Stack 调用栈
// 5. 将 cb1 存入 setTimeout 对应的 timer 定时器中，并将 timer 定时器存入 Web APIs 中，进行计时 5 秒
// 6. Call Stack 调用栈的 setTimeout 逻辑执行完毕，清空调用栈
setTimeout(function cb1() {
  console.log('cb1')
}, 5000)

// 7. 将 console.log('Bye') 推入 Call Stack 调用栈
// 8. 执行，控制台打印 'Bye'
// 9. 执行完毕后，清空 Call Stack 调用栈
console.log('Bye')

// 10. 一旦所有同步代码执行完，即 Call Stack 调用栈空了，将启用 Event Loop 机制
// 11. Event Loop 会一遍遍进行循环，从 Callback Queue 回调队列中找是否有回调需要去执行。
//   如果有，就把回调取出来，推入 Call Stack 调用栈去执行

// 12. 5 秒后，定时器 timer 会将 cb1 推入 Callback Queue 回调队列中
// 13. 这时候 Event Loop 循环会发现 Callback Queue 中有 cb1 回调，于是取出 cb1 并推入 Call Stack 调用栈中
// 14. 执行 cb1，其函数体中的 console.log('cb1') 也会推入 Call Stack 调用栈中
//   （此刻，Call Stack 调用栈有 cb1 和 cb1 函数体的 console.log('cb1')）
// 15. 执行 console.log('cb1')，控制台打印 'cb1'，因为栈是先入后出
// 16. cb1 也执行完毕（因为其函数体就 1 行代码）
// 17. 清空 Call Stack 调用栈
```

Event Loop 过程小结：

* 同步代码，一行一行推入 Call Stack 调用栈去执行
* 遇到异步，会“记录”下，等待合适的执行时机（定时、网络请求等）
* 一旦时机到了，回调就会推入 Callback Queue 回调队列中
* 一旦同步代码执行完，即 Call Stack 调用栈为空，Event Loop 开始工作
* Event Loop 轮询查找 Callback Queue 回调队列，如果有回调，则取出并推入 Call Stack 调用栈去执行
* 然后继续查找（就像永动机一样）

### DOM 事件和 Event Loop 的关系

如下代码：

```html
<button id="btn">提交</button>

<script>
console.log('Hi')

// 代码执行至此，将 click 的回调存储在 Web APIs 模块中
// 当用户点击后，回调从 Web APIs 模块推入 Callback Queue 回调队列中
// 然后基于 Event Loop 的机制从 Callback Queue 回调队列中轮询到回调，并推入 Call Stack 调用栈去执行
document.querySelector('#btn').addEventListener('click', function(e) {
  console.log('Button clicked')
})

console.log('Bye')
</script>
```

由此可见：

* 因为 JS 是单线程的
* 所以，异步（`setTimeout`、AJAX 等）使用回调，基于 Event Loop
* 并且，DOM 事件也使用回调，基于 Event Loop（但不能说 DOM 事件是异步的，只能说 DOM 事件和异步回调都是基于 Event Loop）

### DOM 渲染和 Event Loop 的关系

* JS 是单线程的，而且和 DOM 渲染公用一个线程
* JS 执行的时候，得留一些时机供 DOM 渲染

1. 每当 Call Stack 调用栈空闲时（同步代码都执行完，也是每次轮询结束）
2. 尝试进行 DOM 渲染（如果 DOM 结构有改变）
3. 去触发下一次的 Event Loop

每次 Event Loop 轮询到的回调入 Call Stack 执行后，都会尝试 DOM 渲染，然后再继续 Event Loop 轮询

## 什么是宏任务、微任务，两者有什么区别？

* 宏任务 Macro Task
  * `setTimeout`、`setInterval`
  * Ajax
  * DOM 事件
  * MessageChanel
* 微任务 Micro Task
  * `Promise`
  * `async/await`
* 微任务的执行时机早于宏任务

### 为什么微任务比宏任务执行更早？

* 宏任务在 DOM 渲染后触发
* 微任务在 DOM 渲染前触发

在 Call Stack 调用栈中执行代码遇到微任务时，会将回调推入「Micro Task Queue」微任务队列中，等待执行

因为像 `Promise`、`async/await` 等微任务属于 ES 规范而不是 W3C 规范，所以不会经过 WebAPIs 模块，即：

* 微任务都是 ES6 语法规定的，属于 ES
* 宏任务都是由浏览器规定的，属于 Web APIs

所以完整流程是：

1. 每当 Call Stack 调用栈清空，也就是同步代码执行完
2. 先从 Micro Task Queue 微任务队列中取微任务执行
3. 如果 DOM 结构发生变更，尝试进行 DOM 渲染
4. 开始 Event Loop 循环，从 Callback Queue 回调队列中取宏任务执行
