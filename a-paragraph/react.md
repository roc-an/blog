# 一段话说透一个前端知识点 - React 技术栈

## React 事件与 DOM 原生事件的区别？

如果在 React 中为元素绑定了事件，如：

```jsx
<a href="https://github.com/roc-an" onClick={this.handleClick}>我是超链接</a>
```

**事件处理函数获取到的事件对象，是「合成事件对象」，而不是原生事件对象**：

```js
handleClick = (e) => {
  // 获取合成事件对象
  // 打印的事件对象并不是原生事件对象，而是一个 React 合成事件对象
  // e.__proto__.constructor 是 SyntheticBaseEvent 函数，它是 React 中合成事件的构造函数
  console.log('合成事件对象 e：', e);
}
```

合成事件对象对应的构造函数是 `SyntheticBaseEvent`

**React 合成事件模拟了原生 DOM 事件的所有能力，比如阻止默认行为、阻止冒泡等**：

```js
handleClick = (e) => {
  // 合成事件模拟了原生事件的所有能力
  e.preventDefault(); // 通过合成事件对象阻止默认行为
  e.stopPropagation(); // 通过合成事件对象阻止事件冒泡
  console.log('合成事件对象的 target：', e.target); // <a href="https://github.com/roc-an">我是超链接</a>
  console.log('合成事件对象的 currentTarget：', e.currentTarget); // <a href="https://github.com/roc-an">我是超链接</a>
}
```

**通过合成事件对象的 `nativeEvent` 属性可以获取原生事件对象**：

```js
handleClick = (e) => {
  // 通过合成事件对象，拿到原生事件对象
  // 鼠标点击的原生事件对象的构造函数是 PointerEvent
  console.log('原生事件对象 nativeEvent：', e.nativeEvent);
  console.log('原生事件对象的 target：', e.nativeEvent.target); // <a href="https://github.com/roc-an">我是超链接</a>
  // 所有原生事件都被绑到了根 DOM 节点 <div id="root"></div> 上
  console.log('原生事件对象的 currentTarget：', e.nativeEvent.currentTarget);
}
```

**所有原生事件都被绑到了根 DOM 节点（Root Element） `<div id="root"></div>` 上，这样做的好处是有利于多个 React 版本并存，比如微前端**

PS：React16 版本中是绑到了 `document` 上，整个网页就 1 个 `document`，这样不利于多个 React 版本共存。

## Scheduler 调度模块的原理是什么？

`Scheduler` 将**回调任务分为了两类，「及时回调」和「延时回调」**：

* 及时回调是通过创建 [`MessageChannel`](https://developer.mozilla.org/zh-CN/docs/Web/API/MessageChannel) 实例，然后 `postMessage()` 收发消息进行的，每当收到消息（`onmessage`）便执行回调。这属于“宏任务”，所以 `Scheduler` 的回调都是异步执行的
* 延时回调通过 `setTimeout` 和 `clearTimeout` 延时调用和清除延时调用

`Scheduler` 中**记录时间使用的是 [`performance.now()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/now)**，相比于 `Date.now()`，它得到的时间戳精度能达到微秒级，而且不受系统时间的干扰

`Scheduler` 维护着一个任务队列（`taskQueue`），它是一个最小二叉堆，因为这样可以以 `O(1)` 的时间复杂度取到堆顶的最高优先级任务。工作循环（`WorkLoop`）会依次从这个队列中取出最高优先级任务执行。

`Scheduler` 还实现了「时间切片」，见下一话题

## 什么是“时间切片”？

浏览器的 JS 线程和 GUI 线程互斥，在执行 JS 时没有办法进行布局、绘制，如果执行 JS 过久，会阻塞页面每一帧的渲染，导致卡顿

`Scheduler` 模块引入了「时间切片（Time Slice）」思想解决此问题，主要思路是**在每一帧中给 JS 的执行留一些时间（5ms）**，超过该时间就将控制权让出给主线程去做其他更高优先级的事情，比如绘制、用户输入、处理请求等。等到了下一帧，再继续执行之前中断的任务。

这种**将长任务拆分到每一帧的小任务中去执行而不阻塞 UI 渲染的思想，就是时间切片**。它的关键是**将同步更新变为可中断的异步更新**

在具体实现中还做了**优化**，实际上并不会一到 5ms 就让出控制权给主线程

`Scheduler` 将任务执行时间划分为 4 档：

* < 5ms：不让出；
* 5ms ~ 50ms（不含 50ms）：如果正在进行非连续的用户输入（如鼠标点击）就让出，对于非连续输入（如鼠标指针移动）这种情况可接受，不让出；
* 50ms ~ 300ms（不含 300ms）：只要有用户输入，不管是否连续，都让出；
* > 300ms：让出。因为任务已经执行够久了，可能有其他未知的任务比如网络请求处理需要主线程去做，所以让出。

通过这种优化，避免了频繁让出，可以让浏览器更智能地判断它当前应该处理的事

`Scheduler` 会通过工作循环（`WorkLoop`）依次取任务队列中最高优先级的任务，任务携带的回调在执行时会进行上面的超时检测，一旦超时就会退出循环并等待下次调用

## 可中断渲染的原理是什么？

在“时间切片”的基础上，每构造完成 Fiber 树的一个单元，就会超时检测。**如果超时，就会退出 Fiber 树构造循环，并返回一个新回调**，等待下一次执行回调继续构造 Fiber 树

## 谈谈 Fiber 树构造

Fiber 树的构造处在一个「Fiber 树构造工作循环」中，在 Concurrent 模式下，每次构造完 1 个 Fiber 节点，都会通过 `shouldYield()` 判断是否需要让出控制权给主线程，这一机制实现了“时间切片”和“可中断渲染”

Fiber 树的构造过程是一个“深度优先遍历”，每个 Fiber 节点经历两个阶段：

* 探寻阶段：`beginWork`
* 回溯阶段：`completeWork`

当需要进行新的更新渲染时，新旧 Fiber 树会进行 Diff 比较，进行部分或全部更新。

### ReactElement、Fiber 和 DOM 三者关系

* `ReactElement`：JSX 会编译为 `React.createElement()`，创建出 `ReactElement` 树
* `Fiber`：由 `ReactElement` 创建，对应着 `Fiber` 树。`Fiber` 树是构造 DOM 树的数据模型，它的任何改动最后都将体现到 DOM 上
* `DOM`：就是文档对象模型，DOM 对象的集合就是 DOM 树，JS 可以操作 DOM 从而渲染界面

所以**从编码到渲染页面的转换流程**是：`JSX` -> `ReactElement` 树 -> `Fiber` 树 -> DOM 树。它们是前者驱动后者的关系

### 双缓冲技术（Double Buffering）

在根据 `ReactElement` 构建 Fiber 树的过程中，内存中同时存在两棵 Fiber 树：

1. Current Fiber 树：当前界面已渲染出来的 Fiber 树，挂在 `fiberRoot.current` 上。如果是首次构造 Fiber 树，即初始化渲染，那么 `fiberRoot.current` 为 `null`
2. Work In Progress Fiber 树：正在构建的 Fiber 树，挂在 `HostRootFiber.alternate` 上。构造完成后，重新渲染页面，并与 Current Fiber 树切换。

这么做的原因是，构造 Fiber 树过程的很多 Fiber 对象属性是可复用的，避免了每次更新渲染时重新创建对象的开销。

## Diff 算法原理

Diff 算法也叫调和算法，发生在构建 Fiber 树的工作循环中。当确定更新后，新的 ReactElement 树和旧 Fiber 树进行比较，尽可能地复用旧 Fiber，最终生成一棵新的 Fiber 树

注意，Diff 比较的对象是：

* 旧 Fiber 树
* 新 ReactElement 树

时间复杂度是 O(n)，过程中使用了哈希表 Map 来优化查询

Diff 流程：

1. 区分新 ReactElement 的类型：单节点、数组或是可迭代对象
2. 对于数组或可迭代对象，旧 Fiber 序列和新 ReactElement 序列在比对时会经历 2 个循环：
  a) 第一个循环：遍历最长公共序列
  b) 第二个循环：遍历剩余非公共序列

在经过第一个循环遍历最长公共序列后，剩余的旧 Fiber 都会存入 Map 中，便于后续快速查询

判断能否复用节点的条件是 `key` 和 `type` 都一致，如果一致，那么旧 Fiber 的组件实例或是 DOM 结构将被复用。

在 Diff 过程中不会进行实际的 DOM 渲染，而是为 Fiber 节点打上标记：

* 新增
* 删除
* 移动位置

之后新的 Fiber 树会在 Commit 阶段进行实际的 DOM 处理。
