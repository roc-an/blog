# 一段话说透一个前端知识点 - React 技术栈

## 框架应用

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

#### `static getDerivedStateFromProps(props, state)`

中译为：根据 `props` 获取派生的 `state`

在组件**初始挂载**和**后续更新**时都会触发调用，调用时机是 `shouldComponentUpdate()` 之前，它 `return` 一个对象来更新 `state`。

此方法无权访问组件实例。

此方法适用于罕见的用例，即 `state` 的值取决于 `props`

#### `getSnapshotBeforeUpdate(prevProps, prevState)`

中译为：在更新前获取快照

* 调用时机：在渲染输出（提交到 DOM 节点）之前调用
* 作用：在组件发生更改之前从 DOM 中捕获一些信息（例如，滚动位置）
* 返回值：此生命周期方法的任何返回值都将作为参数传递给 `componentDidUpdate()`

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

### React Hooks

* React Hooks 是完全可选的功能
* 100% 向后兼容，没有破坏性改动
* 不会取代 class 组件，尚无计划要移除 class 组件

#### class 组件存在哪些问题？

函数组件的特点：

* 没有组件实例
* 没有生命周期
* 没有 `state` 和 `setState`，只能接收 `props`

class 组件的问题：

* 大型组件很难拆分和重构，很难测试（即 class 不易拆分）
* 相同业务逻辑，分散到各个方法中，逻辑混乱，逻辑关注点被分离
* 多组件复用逻辑变得复杂，如 Mixins、HOC、Render Prop

React 组件更易用函数表达：

* React 提倡函数式编程，view = fn(props)
* 函数更灵活，更易拆分，更易测试（特别是纯函数，纯函数在单元测试用非常便捷）
* 但函数组件太简单，需要增强能力 - Hooks

#### state Hook

state Hook 让函数组件使用 `state` 和 `setState` 的功能

* 默认函数组件没有 `state`
* 函数组件是一个纯函数，执行完即销毁，无法存储 `state`
* 需要 state Hook，把 state 功能“钩”到纯函数中

`useState` 使用总结：

* `useState(0)` 传入初始值（数组、对象等引用类型均可），返回数组 `[state, setState]`
* 通过 `state` 获取值
* 通过 `setState(1)` 更新修改值

PS：Hooks 命名规范：

* 规定所有的 Hooks 都以 `use` 开头，如 `useXXX`
* 自定义 Hook 也要以 `use` 开头
* 非 Hooks 的地方，尽量不要用 `useXXX` 的命名方式

#### Effect Hook

Effect Hook 让函数组件可以模拟生命周期。

* 默认函数组件没有生命周期
* 函数组件是一个纯函数，执行完即销毁，自己无法实现生命周期
* 使用 Effect Hook 将生命周期“钩”到纯函数中

`useEffect` 的使用总结：

* 默认情况下，相当于模拟了 class 组件的 `componentDidMount` + `componentDidUpdate`，传入的函数在这两个生命周期中都会执行；
* 要模拟 `componentDidMount`，那么 `useEffect(() => {}, [])`
* 要模拟 `componentDidUpdate`，那么 `useEffect(() => {}, [state, ...])`，但注意此时首次渲染也会触发执行，（无依赖也会触发）
* 要模拟 `componentWillUnmount`，那么 `return` 一个组件卸载时触发执行的函数：

```js
useEffect(() => {
  return () => {
    // 卸载时执行
    timerId && clearInterval(timerId)
  }
})
```

不过，准确地说，该函数会在下一次 Effect 执行之前被执行。所该函数不能理解成完全等同于 `componentWillUnmount` 生命周期。

关于 `useEffect` 中的返回函数 `fn`，小结：

* 如果 `useEffect` 依赖 `[]`，那么组件销毁时执行 `fn`，这种情况等同于 `componentWillUnmount`
* 如果 `useEffect` 无依赖或依赖某些状态 `[a, b]`，那么组件更新时执行 `fn`
* 即，下一次执行 `useEffect` 之前，就会执行 `fn`，无论更新或卸载

`useEffect` 让纯函数有了副作用：

* 默认情况下，执行纯函数，输入参数，返回结果，无副作用
* 所谓副作用，就是对函数之外造成影响，如设置全局定时任务
* 而组件需要副作用，所以需要 `useEffect` 钩到纯函数中

#### useRef

常用于访问 DOM 节点：

```js
function UseRefDemo() {
  const btnRef = useRef(null); // 初始值

  useEffect(() => {
    console.log(btnRef.current); // 获取 DOM 节点
  }, []);

  return <div><button ref={btnRef}>点击</button></div>;
}
```

#### useContext

用于在函数组件中接收 context 值

#### useReducer

`const [state, dispatch] = useReducer(reducer, initialArg, init);`

`useState` 的替代方案。它接收一个形如 `(state, action) => newState` 的 reducer，并返回当前的 `state` 以及与其配套的 `dispatch` 方法

可以理解为，`useReducer` 是一个更加复杂化的 `useState`，可以自定义 `reducer` 逻辑，它整体上借鉴了 Redux 的设计方式

`useReducer` 和 Redux 的区别：

* `useReducer` 是 `useState` 的代替方案，用于 `state` 的复杂变化场景
* `useReducer` 属于单组件内的状态管理，组件间通讯还是需要 `props`
* Redux 是全局状态的管理，多组件间共享数据
* `useReducer` 只是借鉴了 Redux 的设计方式而已，不能说有了 `useReducer` 就不再需要 Redux 了，两者的主要职责和解决的问题都不相同

#### useMemo 与 useCallback

* `useMemo`：用于缓存计算得到的数据。如果依赖项不变，就不会重新计算。有助于避免每次渲染中都进行高开销的重复计算
* `useCallback`：用于缓存函数

两者是 React Hooks 的常见优化策略

#### 自定义 Hook

* 本质上是一个函数，命名以 `use` 开头
* 内部正常使用 `useState`、`useEffect` 或者其他 Hooks
* 可以自定义返回结果，格式不限

#### Hooks 使用规范

* 命名以 `use` 开头，比如 `useXxx`
* Hooks 只能用于函数组件和自定义 Hook 中，其他地方不可以
* 只能用于顶层代码，不能在循环、判断中使用 Hooks，也不能提前 `return`（因为 Hook 的取值顺序与调用顺序是一致的）
* 可以配置 `eslint-plugin-react-hooks`

其中，第 3 点尤为重要，Hooks 的调用顺序必须确保一致性：

* 无论是 render 还是 re-render，Hooks 调用顺序必须一致
* 如果 Hooks 出现在循环、判断里，或者提前 `return`，则无法保证顺序一致
* Hooks 严重依赖于调用顺序，十分重要！

#### Hooks 的坑

* `useState` 初始化值，只有第一次有效
* 如果 `useEffect` 的依赖项是 `[]`，那么内部获取的 `state` 值不会变，因为 Effect 函数不会重新执行，没法拿到最新的 `state` 值
* 如果 `useEffect` 的依赖项是引用数据类型，会出现死循环。因为内部是通过 `Object.is()` 进行依赖是否一致的比较的

### React 性能优化手段有哪些？

方案级别：

* 使用异步组件，`React.Suspense` 配合 `React.lazy()`
* 使用 `shouldComponentUpdate` 生命周期
* 使用 `PureComponent` 和 `React.memo`
* 使用不可变数据 `immutable.js`：基于共享数据（不是深拷贝），但有一定的学习、迁移成本，按需使用

Hooks 优化：

* `useMemo`：缓存计算得到的数据。如果依赖项不变，就不会重新计算。有助于避免每次渲染中都进行高开销的重复计算
* `useCallback`：缓存函数

其他小点：

* 事件处理函数提前去 `bind`，或者使用 `class` 的实例方法，避免每次触发事件都传递了一个新函数（不要传递匿名箭头函数）；

### `PureComponent` 与 `memo`

`PureComponent` 纯组件中，实现了 SCU 对新旧 `props` 和 `state` 的浅比较

如果是函数组件，那就用 `memo`，效果是一样的

### `immutable.js`

使用 `immutable.js` 可以彻底实现不可变数据，它是基于数据共享实现的，而不是深拷贝：

```js
const { Map } = require('immutable');
const map1 = Map({ a: 1, b: 2, c: 3 });
const map2 = map1.set('b', 50);
map1.get('b') + ' VS. ' + map2.get('b); // "2 VS. 50"
```

### 如何进行组件间逻辑复用？

* `mixin`：已弃用：
  * 变量来源不清晰
  * 属性重名冲突
  * `mixin` 文件和组件容易形成多对多关系，很不利于维护
* 高阶组件 High Order Components（HOC）：类似工厂的一种编码模式
  * 会增加组件嵌套层级，不易渲染，不易调试
  * 父组件要传递所有 props 给子组件（劫持 props，必须严格规范，容易出现疏漏）
* Render Props
  * 难以理解，本质上是传一个函数组件给维护着公共逻辑的组件去渲染。编程起来并不简单
  * 只能传递纯函数，而纯函数功能有限
* 使用自定义 Hooks

#### 高阶组件 HOC 示例

```js
// 传入一个组件，得到一个新组件
const HOCFactory = (Component) => {
  class HOC extends React.Component {
    // 这里定义多个组件的公共逻辑
    render() {
      return <Component {...this.props} />
    }
  }
  return HOC;
}
const EnhancedComponent1 = HOCFactory(WrappedComponent1);
const EnhancedComponent2 = HOCFactory(WrappedComponent2);
```

类似地，Redux 中的 `connect()` 也是高阶组件的模式：

```js
import { connect } from 'redux';

export default connect(mapStateToProps, mapDispatchToProps)(AnyComponent);
```

#### Render Props

**Render Props 方式的核心思想是：通过函数将 `class` 组件的 `state` 作为 `props` 传递给纯函数组件**

示例：

```js
class Factory extends React.Component {
  state = {} // 可以存放被多个组件所共用的 state
  render() {
    return <div>{this.props.render(this.state)}</div>;
  }
}

const App = () => (
  <Factory render={
    // render 是一个函数组件
    (props) => <p>{props.a} {props.b} ...</p>
  } />
)
```

* 在 HOC 模式中，拥有复用逻辑的组件包裹其他组件
* 在 Render Props 模式中，其他组件包裹拥有复用逻辑的组件

#### 使用自定义 Hooks 进行组件逻辑复用

优势：

* 完全符合 Hooks 原有规则，没有其他要求，易于理解记忆
* 变量来源明确
* 不会产生组件嵌套

### React 和 Vue 的区别

相同点：

* 都支持组件化
* 都是数据驱动视图
* 都使用 VDOM 处理 DOM

区别：

* React 主推 JSX，拥抱 JS，Vue 主推 Template 模板（虽然也支持 JSX），拥抱 HTML
* React 函数式编程，Vue 声明式编程
* React 更多是自力更生，Vue 把想要的都给你（比如一个 `v-for` 去渲染列表，React 则要用 `map` 自己写）
* React 单向数据流，Vue 双向数据绑定
* React 18 `startTransition` 可以标记低优先渲染，对于渲染任务的控制粒度更细

## 社区

### React 18 前瞻

* React 18 正式引入了对并发模式/特性的「渐进升级」策略：并发特性的引入是完全可选的，如果不引入就不会有 breaking changes
  * 从此再无 CM（Concurrent Mode），有的只是 Concurrent Features 并发特性
  * 对于直接想让应用的某一部分“躺平”的情况可以用 Legacy Root。React 18 引入了新的 Root API - `ReactDOM.createRoot` 来与旧的 `ReactDOM.render` 作区分，从而可以将整个 React 树分形为不同的 roots
* 更加激进的「自动 Batching」：React 17 仅会在事件回调中 Batch，而 18 会对任何来源的 `setState` 做尽可能多的 Batching
* `startTransition` 和 `useDeferredValue` API：允许将 UI 的一部分标记为“较低的更新优先级”
* Suspense SSR
  * 传统 SSR 的一个问题是，全量渲染的延迟太高了
  * CM + Suspense 可以做到用 Suspense Boundary 将应用分片，然后以分片为单位做流式 SSR
* Strict Mode 在既 double-render 之后加入了 double-effect
* 新的交互式官方文档：[beta.reactjs.org](https://beta.reactjs.org/)
  * 旧网站在一些连锁话题下需要自行跳转（比如性能优化一章介绍的还是老的 SCU 方案，如果想看 Hooks 相关的就要自己跳转）。这无形间提高了学习 React 的门槛
  * 新网站把 Hooks 作为首推方式来给大家介绍 React
  * 新网站增加了很多关于思想的引导内容，比如可中断渲染、并发、调度等等，并补充了较多的插画来辅助理解
  * 新网站章节均是可交互的，提供了 SandBox，可以边学边做，甚至还提供了编码挑战
  * 新网站提供了 Dark Mode 夜间模式
* 成立了 React 18 工作组（React 18 Working Group），向社区公开 React 18 的讨论和进度

### Redux

Redux 作为数据状态管理工具，结合了不可变数据、纯函数的思想。

#### `connect()` 的意义

语法：

```js
function connect(mapStateToProps?, mapDispatchToProps?, mergeProps?, options?)
```

调用形式是：`connect(若干参数)(组件)`

通过 `mapStateToProps` 和 `mapDispatchToProps` 这两个参数，`react-redux` 提供给了 React 组件去读/写 Store 数据的接口，有了它们，就不用在 React 组件中写冗余的读/写逻辑了

`connect` 函数调用一次得到新函数，再调用新函数得到包裹后组件，这么设计是为了**复用 Connect 逻辑**。比如：

```js
const connectToExam = connect(mapExamStateToProps, mapExamDispatchToProps);

const Teacher = connectToExam(Teacher组件)
const Student = connectToExam(Student组件)
```

上例中，`Teacher`、`Student` 两个组件复用了连接 Store 中考试数据的连接

小结一下，`connect` 的首次执行，相当于得到了一个半成品，它提供了读写相关 Store 数据的接口，之后就可以再次调用，传入任何的使用该接口的组件，这就是 `connect` 的意义

#### 单向数据流

1. 组件 `dispatch(action)`
2. `reducer return` 新的 `state`：`reducer` 是一个纯函数，接收 Action 返回新的 State，中间不应该掺杂任何副作用
3. Store 中 state 改变，`connect` 了对应数据的组件 `props` 更新

#### 异步 Action

Redux 本身是不支持异步 Action 的，即默认情况下，Redux 的 Action 都是同步更新的

* `redux-thunk` 中间件
* `redux-promise` 中间件
* `redux-saga` 中间件

#### Redux 中间件原理

进行 `dispatch(action)` 时，对 `dispatch` 进行改造，中间加入自定义的中间件，Action 在这些中间件中传递，最终传递给 `reducer`

为什么是改造 `dispatch` 而不是 Action 或者 `reducer` 呢？

因为 Action 只是个数据结构，表示本次更新 State 的信息，而 `reducer` 是纯函数。

Redux 使用多个中间件的示例：

```js
import { applyMiddleware, createStore } from 'redux'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'

const logger = createLogger()
const store = createStore(
  reducer,
  applyMiddleware(thunk, logger) // 按顺序执行
)
```

### React Router

两种路由模式：

* Hash 模式（默认），如：`http://abc.com/#/user/10`
* H5 History 模式，如果：`http://abc.com/user/10`，需要服务端支持

#### 动态路由

可给路由设置参数，跳转至的页面获取参数值做相应处理

比如，在配置路由的组件中：

```jsx
<Router>
  <Switch>
    <Route path="/project/:id" />
      <Project />
    </Route>
  </Switch>
</Router>
```

在跳转至的组件中获取参数：

```js

import { Link, useParams } from 'react-router-dom'

function Project() {
  // 获取 URL 参数
  const { id } = useParams()
  return <div>
    <Link to="/">首页</Link>
  </div>;
}
```

使用 JS API 进行路由跳转：

```js
import { useHistory } from 'react-router-dom'

function Trash() {
  const history = useHistory()
  function handleClick() {
    history.push('/')
  }
  return <div>
    <button onClick={handleClick}>回到首页</button>
  </div>;
}
```

#### 路由懒加载

需要配合 `React.Suspense` 和 `React.lazy` 使用：

```js
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import React, { Suspense, lazy } from 'react'

const Home = lazy(() => import('./routes/Home'))
const About = lazy(() => import('./routes/About'))

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
      </Switch>
    </Suspense>
  </Router>
)
```

## 原理

### 合成事件 SyntheticEvent 机制

* 所有事件都挂在了根节点 `<div id="root">` 上，事件委派，利于多个 React 版本并存，例如方便实现微前端
* React 事件处理函数中的 `event` 不是原生的，是 `SyntheticEvent` 合成事件对象

在合成事件机制下，事件触发的流程：

1. DOM 层：比如某个 `div` 被点击，事件被冒泡到根节点 `<div id="root">` 上
2. 合成事件层：将事件实例化成 `SyntheticEvent`，然后派发事件（dispatchEvent）给事件处理函数
3. 执行事件处理函数，处理事件

**为什么需要合成事件机制**？

* 更好的兼容性和跨平台：React 自己的这套事件机制摆脱了 DOM 的事件机制，移植到其他平台上很方便
* 事件委派，挂载到根节点上，减少内存消耗，避免频繁绑定/解绑
* 方便事件的统一管理（如事务机制）：有一个地方能统一管理 React 内部或者模拟对应平台的事件

### `setState` 和 `batchUpdate`

关于 `setState` 的同/异步：

* 有时异步（普通使用），有时异步（`setTimeout`、DOM 事件）
* 有时合并（对象形式，类似 `Object.assign`），有时不合并（函数形式）

核心要点：

* setState 主流程
* batchUpdate 机制
* transaction 事务机制

#### `setState` 主流程

1. `this.setState(newState)`
2. `newState` 存入 `pending` 队列
3. 判断，是否处于（命中） `batchUpdate`？
  * 处于 `batchUpdate`，则保存组件于 `dirtyComponents` 中（即异步更新 `state` 流程）
  * 不处于 `batchUpdate`，则（即同步更新 `state` 流程）：
    * 遍历所有的 `dirtyComponents`
    * 调用 `updateComponent`
    * 更新 pending state or props

`dirtyComponents` 是 `state` 已经更新了的组件

React class 组件中的所有的原型方法、生命周期函数：

* 执行时 React 会设置变量 `isBatchingUpdates = true`，表示“处于 `batchUpdate`”
* 函数执行完，会设置 `isBatchingUpdates = false`
* 对于异步函数中的 `setState`，由于执行时，之前的同步函数已经执行完，所以不处于 `batchUpdate`，于是同步更新 `state`

所以，关于 `setState` 的同、异步：

* 本质上是取决于是否命中 `batchUpdate` 机制（判断 `isBatchingUpdates` 变量）

哪些能命中 `batchUpdate` 机制？

* 生命周期（和它调用的函数）
* 注册的事件（和它调用的函数）
* 总之都是 React 可以管理的入口

哪些不能命中 `batchUpdate` 机制？

* 直接调用 `setTimeout`、`setInterval`（和它调用的函数）
* 直接自定义的 DOM 事件（和它调用的函数）
* 总之都是 React “管不到”的入口

所以能不能命中 `batchUpdate` 主要看入口，入口能命中，那么由入口调用的所有函数都会有 `isBatchingUpdates` 的判断

### Scheduler 调度模块的原理是什么？

`Scheduler` 将**回调任务分为了两类，「及时回调」和「延时回调」**：

* 及时回调是通过创建 [`MessageChannel`](https://developer.mozilla.org/zh-CN/docs/Web/API/MessageChannel) 实例，然后 `postMessage()` 收发消息进行的，每当收到消息（`onmessage`）便执行回调。这属于“宏任务”，所以 `Scheduler` 的回调都是异步执行的
* 延时回调通过 `setTimeout` 和 `clearTimeout` 延时调用和清除延时调用

`Scheduler` 中**记录时间使用的是 [`performance.now()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/now)**，相比于 `Date.now()`，它得到的时间戳精度能达到微秒级，而且不受系统时间的干扰

`Scheduler` 维护着一个任务队列（`taskQueue`），它是一个最小二叉堆，因为这样可以以 `O(1)` 的时间复杂度取到堆顶的最高优先级任务。工作循环（`WorkLoop`）会依次从这个队列中取出最高优先级任务执行。

`Scheduler` 还实现了「时间切片」，见下一话题

### Transaction 事务机制

当生命周期或者我们定义的事件处理函数执行时：

1. 开始，处于 `batchUpdate`（`isBatchUpdates = true`）
2. 执行函数体，其他任何操作
3. 结束，`isBatchUpdates = false`

描述 Transaction 事务机制的伪代码：

```js
transaction.initialize = function() {
  console.log('Initialize')
}
transaction.close = function() {
  console.log('Close')
}
function method() {
  console.log('abc')
}
transaction.perform(method)

// 输出 'Initialize'
// 输出 'abc'
// 输出 'Close'
```

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

### Fiber 如何优化性能？

PS：是否是最新版，有待考究，老版是这样的

渲染更新被分为 2 个阶段：

1. Reconciliation 阶段，执行 Diff 算法，纯 JS 计算
2. Commit 阶段，将 Diff 结果渲染到 DOM

如果不区分这两个阶段，可能会带来的问题：

* JS 是单线程的，且和 DOM 渲染共用 1 个线程
* 当组件足够复杂时，组件更新时计算和渲染压力都大
* 同时再有 DOM 操作需求（动画、鼠标拖拽等），将卡顿

Fiber 的解决方案：

* 将 Reconciliation 阶段进行任务拆分（Commit 阶段无法拆分），拆分成多个子任务
* DOM 渲染时暂停，空闲时恢复
* 通过 `window.requestIdleCallback`：这个函数将在浏览器空闲时期被调用。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应

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

### React Hooks 原理

引入 Hooks 的几个核心优势：

* 减少初学者对 ES6 Class 的认知难度
* 使得组件间逻辑复用变得简单
* 避免了 class 以及 class 中实例方法作为事件处理函数的开销
* 避免了很深的组件嵌套层级

Hook 的类型定义：

```js
// Hook 对象，多个 Hook 间形成了单向链表
// FunctionalComponent Fiber 的 memoizedState 会指向 Hook，所以 Hook 不能脱离 Fiber 独立存在
export type Hook = {|
  memoizedState: any, // 缓存的 state，用于输出最终的 Fiber 树
  baseState: any, // baseQueue 中所有 update 对象合并之后的状态
  baseQueue: Update<any, any> | null, // Update 的环形链表
  queue: any, // Update 队列
  next: Hook | null, // 指向该 FunctionalComponent 的下一个 Hook 对象，所以多个 Hook 间也形成了单向链表
|};
```

每个 Hook 对象有 3 个属性非常重要：

* `memoizedState`：保存的状态
* `queue`：更新队列
* `next`：指向单链表的下一个 Hook 对象

多个 Hook 在内存中的数据结构，是一个单向链表。

目前一共有 17 种 Hook：

```js
// 17 种 Hook 类型
export type HookType =
  | 'useState'
  | 'useReducer'
  | 'useContext'
  | 'useRef'
  | 'useEffect'
  | 'useInsertionEffect'
  | 'useLayoutEffect'
  | 'useCallback'
  | 'useMemo'
  | 'useImperativeHandle'
  | 'useDebugValue'
  | 'useDeferredValue'
  | 'useTransition'
  | 'useMutableSource'
  | 'useSyncExternalStore'
  | 'useId'
  | 'useCacheRefresh';
```

#### Hook 对象以单链表形式挂载在 Fiber 节点上

**在函数组件的函数调用过程中，如果使用了 Hook，那么就会创建与之对应的 Hook 对象。这些对象会根据 Hook 调用顺序而依次创建，以单链表的形式挂载在 `Fiber` 的 `memoizedState` 属性上**

在每次 Fiber 树更新时，基于双缓冲技术，current 节点的 Hook 链表都会克隆到 workInProgress 节点上，并且它们的 Hook 对象的内部状态会被完全复用

#### 数据结构关系

* 每调用一个 Hook，就会创建一个 Hook 对象
* 多个 Hook 对象以单链表形式存储在 `fiber.memoizedState` 上
* Hook 对象维护着 2 个关键属性：
  * `memoizedState`：当前状态的值，比如 `useState()` 的 `state` 值
  * `queue`：环形链表，每当 `dispatch` 一个 `Action`，就会创建一个 `update` 对象添加到该队列中。之所以用环形链表，是因为入队和取队首元素都是 O(1)

正是由于使用了链表形式存储 Hook 及其 `dispatch` 的更新，所以 React 中调用 Hook 的顺序必须确保一致，不能使用判断语句或者提前 `return`

#### 其他

* `useState` 就是对 `useReducer` 的封装，内置了一个特殊的 `reducer`，调用 `setXXX` 函数时会调用这个 `reducer`
