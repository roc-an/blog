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

上一段所说的 DOM Tree + CSS OM 形成 Render Tree 是 2016 年以前的旧方案了。这里介绍 Chrome 重构后的新方案

整个渲染机制比较复杂，浏览器的「渲染模块」在执行时划分了很多子阶段，整个的处理过程可称为「渲染流水线」

### Step 1 - 构建 DOM 树

* 职责：将 HTML 转为浏览器能够理解的 DOM 树结构
* 输入：HTML 文件
* 输出：树结构 DOM

在控制台打印 `document` 可以看到完整 DOM 树结构，**DOM 是保存在内存中的树结构，可以通过 JS 来查询和修改**

### Step 2 - 样式计算（Recalculate Style）

* 职责：计算出每个 DOM 节点的具体样式
* 输入：各来源的 CSS 文本
* 输出：每个 DOM 节点的计算后样式，保存在 `ComputedStyle` 结构内（可在控制台 `Elements` -> `Computed` 中查看）

通过 3 步来完成样式计算：

1. 把 CSS 转为浏览器能理解的结构，即 `styleSheets`
2. 转换样式表 `styleSheets` 中的属性值，使其标准化
3. 计算出 DOM 树中每个节点的具体样式

#### 1.把 CSS 转为浏览器能理解的结构

当渲染引擎接收到 CSS 文本时，会执行一个转换操作，**将 CSS 文本转换为浏览器可理解的结构 - 样式表 styleSheets**

控制台打印 `document.styleSheets`，该结构也支持查询、修改

#### 2.转换样式表 `styleSheets` 中的属性值，使其标准化

属性值标准化：将所有 CSS 值转换为渲染引擎容易理解的、标准化的计算值

如，标准化前：

```css
body { font-size: 2em; }
p { color: blue; }
span { display: none; }
div { font-weight: bold; }
div p { color: green; }
div { color: red; }
```

其中 `2em`、`blue`、`bold` 等属性值是不便于浏览器理解的，于是进行标准化转换：

```css
body { font-size: 32px; }
p { color: rgb(0, 0, 255); }
span { display: none; }
div { font-weight: 700; }
div p { color: rgb(0, 128, 0); }
div { color: rgb(255, 0, 0); }
```

#### 3.计算出 DOM 树中每个节点的具体样式

* 处理样式继承：根据 DOM 节点的继承关系来合理计算节点样式
* 处理样式层叠：层叠是 CSS 的一个基本特征，定义了如何合并来自多个源的属性值的算法

### Step 3 - 布局阶段（Layout）

经过了 “DOM 树构建”和“样式计算”，浏览器还不知道元素的几何位置信息，因此还不足以显示页面。

那么接下来就是「布局阶段」，目的是**计算出 DOM 树中可见元素的几何位置**

Chrome 在布局阶段主要进行两个任务：

1. 创建布局树
2. 布局计算

#### 1.创建布局树

已构建的 DOM 树中，有些元素是不可见的（比如 `<head>`，以及 `display: none` 的元素）。

因此，在显示前，**需要构建一棵仅包含可见元素的「布局树」**。

构建布局树的过程中，会遍历 DOM 树中所有可见节点，并把这些节点添加到布局树中。而不可见的节点会被布局树忽略掉

#### 2.布局计算

通过各种算法来计算布局树中节点的坐标位置

PS：目前布局计算的输入、输出都是布局树，也就是计算后会把运算结果重新写回布局树中。这种方式没有清晰地将输入、输出区分开，Chrome 团队正在重构布局阶段代码，下一代布局系统叫 LayoutNG，试图清晰分离输入和输出，从而让新设计的布局算法更简单

### Step 4 - 分层（Layer Tree）

经历了前 3 步，有了布局树，每个元素的具体位置也计算出来了，但仍然不能进行绘制

页面中还有很多复杂的效果，比如 3D 变换、页面滚动、`z-index` 的 Z 轴排序等等。为了实现这些效果，渲染引擎需要为特定的节点生成专用图层，并生成一棵对应的「图层树（Layer Tree）」

Chrome 开发者工具的 Layers 一栏可以看到可视化的页面图层分层情况

**浏览器的页面被分成了很多图层，这些图层叠加后形成了最终的页面**

通常，并不是布局树的每个节点都包含一个图层，如果一个节点没有对应的层，那么该节点属于其父节点所在的图层

满足以下任意一点，浏览器就会为节点创建图层：

* 拥有层叠上下文属性的元素会被提升为单独的一层，比如：
  * 定位属性：`position: fixed`
  * 透明属性：`opacity: 0.5`
  * CSS 滤镜：`filter: blue(5px)`
  * Z 轴排序：`z-index: 10`
* 需要剪裁（clip）的地方会被创建为图层：比如设了 `overflow: hidden` 的元素，其内容超出了边界，那么浏览器会为内容单独创建一层，如果有滚动条的话，滚动条也会单独一层


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
