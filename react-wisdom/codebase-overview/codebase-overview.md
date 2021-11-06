## 目录结构

### `/packages`

顶层的 `/packages` 目录包含了 React 的各核心模块。

#### `/packages/react`

`react` 模块（也就是从 npm 上下载的 `react` 库）仅包含定义组件所必须的 API，也就是 React 的各顶层 API（[React Top-Level API](https://reactjs.org/docs/react-api.html#react)），比如：

* [`React.createElement(type, [props], [...children])`](https://reactjs.org/docs/react-api.html#createelement);
* [`React.Component()`](https://reactjs.org/docs/react-api.html#reactcomponent);
* [`React.Children()`](https://reactjs.org/docs/react-api.html#reactchildren)。

`react` 模块里放的都是**与平台无关**的代码，也就是并不包含如浏览器环境下操作 DOM 的 API。这样做是为了跨平台，比如 `react` 和 `react-dom` 结合那就面向 Web 浏览器渲染，如果 `react` 和 `react-native-renderer` 结合那就面向原生环境。

`react-dom`、`react-native-renderer` 都属于「渲染器」，渲染器（Renderer）的作用就是将与平台无关的 React 组件树，结合着平台特有的 API，最终在对应平台下渲染出来。

#### `/packages/dom`

React DOM 渲染器（也就是从 npm 上下载的 `react-dom` 库）。将 React 组件树渲染成 Web 浏览器平台下实际的 DOM 节点。

该模块包含各 [ReactDOM API](https://reactjs.org/docs/react-dom.html)，比如：

* [`ReactDOM.render(element, container[, callback])`](https://reactjs.org/docs/react-dom.html#render);
* [`ReactDOM.findDOMNode(component)`](https://reactjs.org/docs/react-dom.html#finddomnode)

#### `/packages/react-native-renderer`

React Native 渲染器。它实现了 React 和 React Native 的连接，这个渲染器在 React Native 内部被使用。

#### `/packages/react-test-renderer`

React 测试用渲染器。将 React 组件解析成纯粹的 JS 对象。可以和 Jest 的快照测试功能配合使用。

#### `/packages/react-art`

React ART 渲染器。它实现了与矢量图绘制库 [ART](https://github.com/sebmarkbage/art/) 的桥接。

### `/fixtures`

顶层的 `/fixtures` 目录包含了为源码贡献者提供的小型测试项目。

### `__tests__`

React 没有顶层的单元测试目录，所有单元测试都在待测内容同级的 `__tests__` 目录下。

## 参考资源

* [Codebase Overview | reactjs.org](https://reactjs.org/docs/codebase-overview.html)；
