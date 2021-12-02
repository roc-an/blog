# 一段话说透一个前端知识点 - React 技术栈

## 框架应用层面

### setState

关于 `setState`：

* 不能直接改变 `state`，应通过 `setState` 设置不可变数据
* 可能是异步更新
* 可能会被合并
* 函数组件没有实例，没有 `state`

### 对于对象、数组等引用类型数据，如何 `setState`？

不能直接改变 `state`，应通过 `setState` 设置不可变数据

对于数组：

```js
// 设置不可变数据 - 数组
const { list } = this.state;
const list5Copy = list.slice(); // Clone list
list5Copy.push('newItem'); // 对 Clone 的数组做任何其他操作
this.setState({
  list1: list.concat('newItem'), // 追加
  list2: [...list, 'newItem'], // 追加
  list3: list.slice(0, 2), // 截取
  list4: list.filter(item => item > 100), // 筛选
  list5: list5Copy, // 其他操作，先 Clone，再操作 Clone 的数据
});
```

对于对象：

```js
// 设置不可变数据 - 对象
const { obj } = this.state;
this.setState({
  obj1: Object.assign({}, obj, { a: 1 }), // 通过 Object.assign() 合并为一个新对象
  obj2: { ...obj, a: 1 },
})
```

### 调用 `setState()` 后，`state` 的更新是同步还是异步的？

* 直接使用 `setState()` 是异步更新 `state` 的，可以通过第二个参数的回调拿到更新后的 `state`；
* 定时器 `setTimeout`、`setInterval` 中使用 `setState()`，将同步更新 `state`；
* 自定义 DOM 事件处理函数中使用 `setState()`，将同步更新 `state`；

### `setState` 可能会合并 `state` 更新

对于**异步更新 `state` 的场景**，如果为 `setState()` 传入**对象**，`state` 会被合并：

```js
// 下方代码重复执行了多次 setState() 来修改 count 属性，最终 count 的值为最后一个 setState() 中设置的值，执行结果是 +2
this.setState({ count: this.state.count + 1 });
this.setState({ count: this.state.count + 1 });
this.setState({ count: this.state.count + 2 });
```

对于**异步更新 `state` 的场景**，如果为 `setState()` 传入**函数**，`state` 不会被合并：

```js
// 每个函数都将执行，执行结果是 +4
this.setState((prevState, props) => {
  return { count: prevState.count + 1 };
});
this.setState((prevState, props) => {
  return { count: prevState.count + 1 };
});
this.setState((prevState, props) => {
  return { count: prevState.count + 2 };
});
```

### React 组件的完整生命周期？

一个贼好用的 [图示 React 组件生命周期](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

几条常见链路：

* 挂载时：`class constructor` -> `render()` -> React 更新 DOM 和 `refs` -> `componentDidMount()`
* 更新时：新的 `props` / `setState()` / `forceUpdate()` -> `render()` -> React 更新 DOM 和 `refs` -> `componentDidUpdate()`
* 卸载时：`componentWillUnmount()`

如果包含了不常用的生命周期，那么完整生命周期流程，如图：

### React 事件与 DOM 原生事件的区别？

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

### `class` 组件与函数组件的区别？

* 函数组件是一个**纯函数**，输入 `props`，输出对应的 `JSX`，中间不应该有副作用
* 函数组件**没有实例、没有生命周期、没有 `state`**
* 函数组件中不能扩展其他实例方法（因为没有组件实例），所以不能通过反模式 `refs` 来引用，只能通过 `forwardRef()` 来传递 `refs`

偏展示的组件，不需要内部维护状态，通常应使用函数组件

### `Portals` 的使用场景

`Portals` 是“传送门”的意思，组件默认会按其嵌套层级来渲染，但如果想让一个组件渲染到其父组件之外，就要用 `Portals` 了

```js
render() {
  // 使用 Portals 渲染到 body 上
  return ReactDOM.createPortal(
    <div className="modal">{this.props.children}</div>,
    document.body
  );
}
```

`Portals` 的使用场景：

* 父组件 `overflow: hidden`，子组件想逃离父组件
* 父组件 `z-index` 值过小，子组件想逃离父组件
* `position: fixed` 布局，需要放在 `body` 的直接子元素

### `context` 的使用

#### `context` 使用场景

* 将公共信息（语言、主题）传递给每个组件
* 用 `props` 传递的层级过多
* 用 `redux` 又显得小题大做、过度设计的场景

#### `context` API

通过 `React.createContext()` 来创建 `context` 并设置初始值：

```js
const ThemeContext = createContext('light');
```

在上层组件中，生产 `Context` 并绑定值，使用了 `Provider`：

```js
render() {
  const { theme } = this.state;
  return <ThemeContext.Provider value={theme}>
    ...
  </ThemeContext.Provider>;
}
```

在下层组件中，消费 `Context`，对于 `class` 组件，要设置静态属性 `contextType`：

```js
// 下层 class 组件 - 消费 Context
class ThemedChild1 extends Component {
  static contextType = ThemeContext; // 指定 contextType 是哪个 Context
  render() {
    // React 会根据设置的 contextType 往上层找最近的 Context Provider
    const theme = this.context;
    return <div>
      <p>子组件主题是 {theme}</p>
    </div>;
  }
}
```

对于函数组件，要使用 `Consumer`：

```js
// 底层函数组件 - 消费 Context
function ThemedChild2(props) {
  // const theme = this.context; // 报错，函数组件没有 this
  // 函数组件应使用 Consumer
  return <ThemeContext.Consumer>
    { theme => <p>子组件主题是 {theme}</p> }
  </ThemeContext.Consumer>;
}
```

### React 异步组件

通过 `React.Suspense` 和 `React.lazy` 的配合完成异步组件加载：

```js
import React, { Component } from 'react';

const Other = React.lazy(() => import('./Other'));

// NetWork 改为 Slow 3G，并且能看到多下载了一个 js 包
class Lazy extends Component {
  render() {
    return <div>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Other/>
      </React.Suspense>
    </div>;
  }
}
```

使用异步组件是 React 应用性能优化的一个小点，原理是 Webpack 对于要异步加载的组件文件进行了单独打包，异步组件常配合路由懒加载使用

### `shouldComponentUpdate` 的使用

合理使用 `shouldComponentUpdate`（简称 SCU）是 React 常见性能优化方案。

SCU 的基本语法：

```js
shouldComponentUpdate(nextProps, nextState) {
  if (nextState.count !== this.state.count) {
    return true; // 可以渲染
  }
  return false; // 不重复渲染
}
```

SCU 默认 `return true`

为什么 React 提供了 SCU 生命周期？

React 中当父组件更新时，默认所有子组件也会更新，不管传递的 `props` 是否改变。这时就需要 SCU 的能力了，如果对应的数据没变，那没必要重新更新子组件。

### React 性能优化手段有哪些？

方案级别：

* 使用异步组件，`React.Suspense` 配合 `React.lazy()`
* 使用 `shouldComponentUpdate` 生命周期
* 使用 `PureComponent` 和 `React.memo`
* 使用不可变数据 `immutable.js`

其他小点：

* 事件处理函数提前去 `bind`，或者使用 `class` 的实例方法，避免每次触发事件都传递了一个新函数（不要传递匿名箭头函数）；

### `PureComponent` 与 `memo`

`PureComponent` 纯组件中，实现了 SCU 对新旧 `props` 和 `state` 的浅比较。

如果是函数组件，那就用 `memo`，效果是一样的。

## 框架原理层面

### Scheduler 调度模块的原理是什么？

`Scheduler` 将**回调任务分为了两类，「及时回调」和「延时回调」**：

* 及时回调是通过创建 [`MessageChannel`](https://developer.mozilla.org/zh-CN/docs/Web/API/MessageChannel) 实例，然后 `postMessage()` 收发消息进行的，每当收到消息（`onmessage`）便执行回调。这属于“宏任务”，所以 `Scheduler` 的回调都是异步执行的
* 延时回调通过 `setTimeout` 和 `clearTimeout` 延时调用和清除延时调用

`Scheduler` 中**记录时间使用的是 [`performance.now()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/now)**，相比于 `Date.now()`，它得到的时间戳精度能达到微秒级，而且不受系统时间的干扰

`Scheduler` 维护着一个任务队列（`taskQueue`），它是一个最小二叉堆，因为这样可以以 `O(1)` 的时间复杂度取到堆顶的最高优先级任务。工作循环（`WorkLoop`）会依次从这个队列中取出最高优先级任务执行。

`Scheduler` 还实现了「时间切片」，见下一话题

### 什么是“时间切片”？

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

### 可中断渲染的原理是什么？

在“时间切片”的基础上，每构造完成 Fiber 树的一个单元，就会超时检测。**如果超时，就会退出 Fiber 树构造循环，并返回一个新回调**，等待下一次执行回调继续构造 Fiber 树

### 谈谈 Fiber 树构造

Fiber 树的构造处在一个「Fiber 树构造工作循环」中，在 Concurrent 模式下，每次构造完 1 个 Fiber 节点，都会通过 `shouldYield()` 判断是否需要让出控制权给主线程，这一机制实现了“时间切片”和“可中断渲染”

Fiber 树的构造过程是一个“深度优先遍历”，每个 Fiber 节点经历两个阶段：

* 探寻阶段：`beginWork`
* 回溯阶段：`completeWork`

当需要进行新的更新渲染时，新旧 Fiber 树会进行 Diff 比较，进行部分或全部更新。

#### ReactElement、Fiber 和 DOM 三者关系

* `ReactElement`：JSX 会编译为 `React.createElement()`，创建出 `ReactElement` 树
* `Fiber`：由 `ReactElement` 创建，对应着 `Fiber` 树。`Fiber` 树是构造 DOM 树的数据模型，它的任何改动最后都将体现到 DOM 上
* `DOM`：就是文档对象模型，DOM 对象的集合就是 DOM 树，JS 可以操作 DOM 从而渲染界面

所以**从编码到渲染页面的转换流程**是：`JSX` -> `ReactElement` 树 -> `Fiber` 树 -> DOM 树。它们是前者驱动后者的关系

#### 双缓冲技术（Double Buffering）

在根据 `ReactElement` 构建 Fiber 树的过程中，内存中同时存在两棵 Fiber 树：

1. Current Fiber 树：当前界面已渲染出来的 Fiber 树，挂在 `fiberRoot.current` 上。如果是首次构造 Fiber 树，即初始化渲染，那么 `fiberRoot.current` 为 `null`
2. Work In Progress Fiber 树：正在构建的 Fiber 树，挂在 `HostRootFiber.alternate` 上。构造完成后，重新渲染页面，并与 Current Fiber 树切换。

这么做的原因是，构造 Fiber 树过程的很多 Fiber 对象属性是可复用的，避免了每次更新渲染时重新创建对象的开销。

### Diff 算法原理

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
