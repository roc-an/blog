# 风驰电掣 ESBuild

> 发布于 2021.09.29，最后更新于 2021.09.29。

先分享一段有意思的骚话：

> * 如果你觉得 Babel 太慢，你就去优化它；
> * 如果你觉得 JavaScript 不好，你就进 TC39 去当主席；
> * 如果你觉得弱类型没素质，那就从你开始，写一手高素质的 AnyScript；
> * 如果你觉得 V8 Profiler 愚昧无知，就从你开始，学习并改变身边的 JS 引擎；
> 
> 它们有缺点，我们就一起加班，而不是一昧地谩骂、删库、逃离。

于是尤雨溪就说了这句话 :)

[Vite](https://cn.vitejs.dev/guide/why.html#the-problems) 有很多备受瞩目的功能，其中有一项就是 **大幅优化了研发项目时，本地开发服务器的启动**。

也的确，现在一个中大型项目动不动就包含数千个模块，代码量越来越大，使用传统的构建工具往往要很久才能启动好本地开发服务器。于是 Vite 优化了本地开发服务器这块。

种种优化手段中，有一项杀手锏，就是 [依赖预构建](https://cn.vitejs.dev/guide/dep-pre-bundling.html)。

简单说，依赖预构建主要做了下面这几件事：

1. 因为现代浏览器开始原生支持 ES 模块，于是 Vite 在依赖预构建过程中，将其他模块导入导出方式（比如 CommonJS 和 UMD）转为 ESM（ES 模块化）方式；
2. 将茫茫多的 ESM 依赖关系转为单个模块，来提高页面的加载性能（就比如一个 `lodash` 就内置了 600+ 模块，通过合并成单模块，在浏览器端就只需要发 1 个 HTTP 请求了）；
3. 将每次预构建的成果缓存。如果重新编译时，项目的各种依赖没变，那么直接用缓存就行了；
4. 同时也设置了浏览器访问本地开发服务器的项目依赖的缓存。开发阶段每次页面重新加载，如果依赖文件的版本 `query` 没变，那么不会向本地开发服务器请求文件。

Vite 使用的什么来做的依赖预构建呢？使用的就是咱们本篇文章的主角——**ESBuild**。

![esbuild](https://raw.githubusercontent.com/evanw/esbuild/master/images/wordmark.svg)

在这篇文章中，我会给大家介绍 ESBuild 的基本使用，但更重要的是，它为什么比传统前端构建工具有优势。理解了这些，我们就能从本质上搞懂为什么 Vite 如此之快。

ESBuild 作为构建工具，它的主要功能特点涵盖：

* 不借助任何缓存，就能拥有极致的速度（Extreme speed without needing a cache）；
* 支持对 ES 和 CommonJS 模块的解析（ES6 and CommonJS modules）；
* 支持 Tree Shaking 优化（Tree shaking of ES6 modules）；
* 同时为 JS 和 Go 语言提供了 API（An API for JavaScript and Go）；
* 支持 TS 和 JSX 语法的解析（TypeScript and JSX syntax）；
* 支持 Source Map（Source maps）；
* 支持压缩（Minification）；
* 支持通过插件扩展（Plugins）。

PS：虽然目前（2021年）Vite 并没有使用 ESBuild 来完成生产环境打包（Vite 是使用 ESBuild 进行依赖预构建，打包目前用的 Rollup），因为 ESBuild 正处于快速迭代版本中，一些打包重要功能（比如代码分割、CSS 预处理方面）还处于开发阶段，但不排除未来 Vite 使用 ESBuild 作为打包模块的可能性。

## （一）ESBuild 打包工具的基本使用

基本使用这块是参考的 esbuild 官网文档：[Getting Started | esbuild.github.io](https://esbuild.github.io/getting-started/)，如果想直接了解 esbuild 思想的可以跳过。

### 打包一个 React 项目

**第一步：找个文件目录来初始化测试项目**，执行 `npm init`。

**第二步：安装 esbuild**。

推荐使用 `npm` 来安装 esbuild 的原生可执行文件：`npm install esbuild -D`。

安装后，执行 `./node_modules/.bin/esbuild --version` 查看版本，以验证安装成功。

PS：如果报错的话，检查下 `npm` 版本，2021 年 9 月 22 日测的在 NPM V7 版本有 bug，可以使用 [nvm](https://github.com/nvm-sh/nvm) 将 node 版本切到 `14.17.6` 这个 LTS 版本上（对应的 NPM 版本是 `6.14.5`），就没问题了。

**第三步：初始化一个 React 项目用于打包测试**

安装 `react` 和 `react-dom` 这两个库：`npm install react react-dom`。

之后创建 `app.jsx` 文件，并包含这段代码：

```js
import * as React from 'react';
import ReactDOMServer from 'react-dom/server';

let Greet = () => <h1>Hello, world!</h1>;
console.log(ReactDOMServer.renderToString(<Greet />));
```

这里面用到了 [`ReactDOMServer`](https://zh-hans.reactjs.org/docs/react-dom-server.html)，使用它可以将 React 组件渲染为静态 HTML 标签，一般被用到 Node 服务端渲染上。

[`renderToString()`](https://zh-hans.reactjs.org/docs/react-dom-server.html#rendertostring) 方法在服务端和浏览器端都可以使用，它会将传入的 React 元素转为 HTML 字符串返回。通常用它在服务端生成 HTML 来加速首屏渲染，以及优化 SEO。

**第四步：使用 esbuild 打包**

执行指令来让 esbuild 对 `app.js` 这个文件打包：

`./node_modules/.bin/esbuild app.jsx --bundle --outfile=out.js`

执行后（我的用了 `12ms`），会创建 `out.js` 文件，包含了 `app.jsx` 中的代码以及 React 库。

打包得到的 `out.js` 中的代码是完全独立的，不再依赖于 `node_modules` 目录。执行 `node out.js` 可以看到输出结果：

`<h1 data-reactroot="">Hello, world!</h1>`。

esbuild 可以将 JSX 语法编译成 JavaScript 而不需要任何其他配置（当然文件以 `.jsx` 作为后缀名还是必需的）。虽然 esbuild 可配置，但它会在普遍情况下合理地进行自动处理。

### 在 `package.json` 中定义打包 `scripts`

一般来说打包指令在项目研发过程中是需要重复执行的，因此可以在 `package.json` 中定义 `scripts` 的方式来复用这些指令：

```js
{
  "scripts": {
    "build": "esbuild app.jsx --bundle --outfile=out.js"
  }
}
```

然后命令行中执行 `npm run build` 就可以打包了。

当然，如果要传递很多配置项给 esbuild 去打包，那显然用命令行指令的这种方式就显得有些笨拙了。

对于复杂场景，我们可以用 esbuild 提供的 JS API 来编码 JS 脚本，例如：

```js
require('esbuild').build({
  entryPoints: ['app.jsx'],
  bundle: true,
  outfile: 'out.js',
}).catch(() => process.exit(1))
```

`build` 方法会在一个子进程中执行 esbuild 可执行文件（就是安装后在 `node_modules/.bin` 目录下的 `esbuild` 二进制文件），然后返回 `promise` 实例，当打包完成后这个 `promise` 会 `resolve` 掉。

上面代码中没有去手动打印异常，是因为默认当有异常时控制台都会打印错误信息。

完整的可配置项和 esbuild API 可以参考 [Build API | esbuild.github.io](https://esbuild.github.io/api/#build-api)。

### 面向浏览器端打包

默认情况下，打包后的代码就是面向浏览器端的，所以刚入门使用 esbuild 时没必要加一些额外的配置项。

* 对于开发环境，如果要支持 Source Map，可以执行指令时使用 `--sourcemap`；
* 对于生产环境，如果要进行压缩，可以使用 `--minify`。

如果还要配置兼容的目标浏览器版本，可以这样执行指令：

`esbuild app.jsx --bundle --minify --sourcemap --target=chrome58,firefox57,safari11,edge16`

有时候我们要用的库中引入了其他的只能在 NodeJS 环境使用的库，比如 NodeJS 内置的 `path` 模块。

这时候我们可以在 `package.json` 中设置 [`browser`](https://github.com/defunctzombie/package-browser-field-spec) 字段来将它们替换成兼容浏览器端的库：

```js
{
  "browser": {
    "path": "path-browserify"
  }
}
```

类似 `path` 模块，有些我们要用的 npm 包并没有设计成可以在浏览器端使用，这时候我们在明确可能会出现的问题的情况下，依然可以通过 esbuild 的配置来成功打包。

另外，如果要替换未定义的全局变量，可以使用 [`define`](https://esbuild.github.io/api/#define) 功能，其他更复杂的场景可以参考 [`inject`](https://esbuild.github.io/api/#inject) 功能。

### 面向 NodeJS 环境打包

尽管在运行 NodeJS 应用时，打包器不是必要的，但如果在执行前通过 esbuild 处理一遍代码依然会带来诸多好处。

**打包过程会自动地去掉 TS 类型注解、将 ECMAScript 模块语法转译成 CommonJS，并且对于指定了 NodeJS 版本的情况，esbuild 还会把较新的语法转译成老版本**。

这些操作会减小我们要发布的包体积，意味着将来被文件系统读取时会花费更少的时间。

#### `--platform`

如果想打包后的代码运行在 NodeJS 环境，在执行指令时需要加上 `--platform=node`。

这会将一些配置项改为对 NodeJS 环境友好的默认值。

比如，所有在 NodeJS 中已经内置了的模块（如 `fs` 模块）都会被自动标记为 `external`，esbuild 并不会打包它们。

另外 `--platform=node` 这个配置也会禁止解析 `package.json` 中的 `browser` 字段。

#### `--target`

如果我们代码中使用了较新的语法，导致在某个 NodeJS 版本中无法运行，那可以通过 `--target` 来配置我们要打包兼容的 NodeJS 版本：

`esbuild app.js --bundle --platform=node --target=node10.4`

#### `--external`

还有些特殊场景，比如我们引入的某个库，因为种种原因它就是不能成功打包（比如有个要用到平台系统原生扩展的包 `fsevents`），或者某个库你就是不想打包进去。

这时候可以通过 `--external` 将它们标记为 `external`（外部引入）：

`esbuild app.jsx --bundle --platform=node --external:fsevents`

## （二）ESBuild 内置支持的文件类型

ESBuild 内置便支持了多种常见的文件类型的编译。每种文件类型，ESBuild 都有相关的加载器（Loader）来解释和编译。

默认情况下，已经为一些文件类型配置了 Loader，当然也支持再自定义去覆盖这些配置。

内置的支持类型有：

* **JavaScript**：使用 `js` Loader。默认可处理 `.js`、`.cjs` 和 `.mjs` 文件。其中 `.cjs` 是用于 NodeJS 环境下的 CommonJS 模块，而 `.mjs` 是用于 ESM（ECMAScript Module）；
* **TypeScript**：使用 `ts` 或 `tsx` Loader。默认可处理 `.ts` 和 `.tsx` 文件。这意味着 ESBuild 内置支持解析 TS 语法，并且可以过滤掉类型注解；
* **JSX**：使用 `jsx` 或 `tsx` Loader。JSX 是一种类似 XML 的扩展语法，最初由 React 发明出来，ESBuild 也是默认支持的；
* **JSON**：使用 `json` Loader。默认支持将 `.json` 文件解析成 JS 对象；
* **CSS**：使用 `css` Loader。默认可处理 `.css` 样式文件；
* **Text**：使用 `text` Loader。默认可处理 `.txt` 文件，可以将文件解析成文本字符串；
* **Binary**：使用 `binary` Loader。这个 Loader 在打包时可以将文件作为二进制文件解析，并且通过 Base64 编码到最终的打包文件中；
* **Base64**：使用 `base64` Loader。这个 Loader 在打包时可以将文件作为二进制文件解析，然后编码成 Base64 字符串，输出至打包文件中；
* **Data URL**：使用 `dataurl` Loader。这个 Loader 在打包时可以将文件作为二进制文件解析，然后通过 Base64 data URL 的形式到最终的打包文件中；
* **External file**：使用 `file` Loader。这个 Loader 可以将文件拷贝到指定目录，然后文件名以字符串的形式嵌入到打包文件中。

## （三）为什么 ESBuild 很快？

### JS 是一种即时编译语言（JIT-compiled language）

要想理解 esbuild 为什么快，首先还得从“JS 是一种即时编译语言”说起。那什么是即时编译呢？

**即时编译**（just-in-time compilation，缩写为 JIT），也被称为“动态翻译”或“运行时编译”。

在 [StackOverflow](https://stackoverflow.com/questions/95635/what-does-a-just-in-time-jit-compiler-do) 上高票解释是这样的：

> A JIT compiler runs **after** the program has started and compiles the code (usually bytecode or some kind of VM instructions) on the fly (or just-in-time, as it's called) into a form that's usually faster, typically the host CPU's native instruction set. A JIT has access to dynamic runtime information whereas a standard compiler doesn't and can make better optimizations like inlining functions that are used frequently.
>
> This is in contrast to a traditional compiler that compiles **all** the code to machine language **before** the program is first run.

JIT 编译器会在程序已经开始执行后运行，它实时地对代码（通常是字节码或是某种 VM 指令）进行编译。借助着主机 CPU 的原生指令集，编译过程通常比较快速。

相比于传统的编译器而言，JIT 编译器可以访问到动态的运行时信息，因此可以做一些优化，比如 JIT 编译器就可以处理被频繁使用的内联函数（inlining functions）。

传统编译器和 JIT 编译器比有一个非常显著的特点：传统编译器会在程序首次执行前将所有代码编译成机器语言。

有一张网图我认为很形象：

这张图是描述 Java 编译过程的，Java 也属于 JIT 语言范畴。

图里有 **3 种编码形式**：

**第一种，源码（Source Code）**：

这没什么特殊的，就是指我们开发时写的代码；

**第二种，字节码（Byte Code）**：

位（也叫比特）是计算机存储、处理信息的最小单位。1 字节 = 8 位。

字节码是包含着一系列 OP Code（操作码，用来表示要执行何种指令）的二进制文件，而这些 OP Code 通常都是 1 字节长，所以叫字节码。

字节码是一种中间代码，虽然它是二进制文件，但操作系统并不能直接执行，在 Java 中字节码是给 JVM（Java 虚拟机，Java Virtual Machine）用的，JVM 将字节码编译成最终给操作系统执行的机器码（Machine Code）；

多提一句，为什么 Java 要搞出来字节码这种中间代码呢？

主要目的是为了**跨平台**。程序员写的 Java 源码只需要编译成虚拟机能理解的字节码（就是 Java 的 `.class` 文件）就行了，这样虚拟机就给 Java 编译器（Java Compiler）一个统一的接口。至于在什么平台运行，不用关心，那是虚拟机要做的事，虚拟机可以在不同平台运行，然后虚拟机的解释器会将字节码编译成对应平台的机器码，最终在机器上执行。

所以**整体流程就是：程序员写 Java 源码 -> Java 编译器编译成字节码 -> JVM 解释器编译成对应平台的机器码 -> 机器码在平台上执行**。

**第三种，机器码（Machine Code，也叫 Native Code）**：

是计算机可以理解并能够直接执行的代码，用二进制表示，包含了各种机器指令。

最早的那一批程序员（祖师爷级别的程序员）就是直接编写机器码的，但是这种机器语言虽然机器能直接识别，但对于人类语言来说实在差别太大，很难理解和记忆，因此才发展出来了后面的“汇编语言”和各种“高级语言”。

不过无论使用汇编语言还是哪种高级语言，最终也都要编译成机器码的，机器码才是最终计算机可以执行的二进制代码。

从图中可以看到，JVM 中的 JIT 编译器在运行时将字节码编译成机器码后再交由计算机操作系统执行。

### esbuild 是由 Go 语言写的，并且直接编译成机器码

回到 esbuild 上。

绝大多数打包器都是用 JS 写的，但对于一个命令行应用来说，使用 JS 这种即时编译语言（JIT-compiled language）在性能方面是非常糟糕的。

因为每次运行 JS 写的打包器时，JS 虚拟机（JS VM）都会视为首次执行打包器代码，都要先将打包器的 JS 代码解析完再解析要打包的 JS 代码，这一环节是没有任何优化的。

这种方式和使用 esbuild 相比，当 esbuild 忙着解析 JS 代码的时候，NodeJS 环境还正忙着先解析打包器的 JS 代码。等到 NodeJS 环境终于完成了对打包器代码的解析，这时可能 esbuild 已经解析 JS 完成了，而此时前者甚至还没开始进行打包！

我画了个图来对比这两种方式：

从图中可以看出，esbuild 方式避免了每次打包时还要通过 NodeJS 环境解析打包器代码的过程，从而大大提升了打包效率。

除此之外，[Go](https://golang.org/) 语言的核心设计思路是**并行**的，而 JS 却不是。Go 程序在各个线程间共享内存，而使用 JS 则必须在线程间互相传输数据。尽管 Go 和 JS 引擎都有并行的垃圾回收机制，但是 Go 的堆栈是被各线程共享的，而 JS 的堆栈是各线程都自己独立维护了一个。[根据 esbuild 团队测试](https://github.com/evanw/esbuild/issues/111#issuecomment-719910381)，使用 JS 的情况下并行度大打折扣，甚至是使用 Go 的并行度的一半。

### 大量使用并行处理

esbuild 算法被严谨地设计成尽可能使用可用的 CPU 内核。总体上有 3 个处理阶段：

1. 解析（Parsing）
2. 连接（Linking）
3. 代码生成（Code Generation）

其中“解析”和“代码生成”占据了最主要的工作量，它们是完全可并行的（而“连接”在大多数情况下都是固定的串行操作）。

由于所有线程都共享内存，那么打包时，如果不同的入口文件引了相同的 JS 库，这部分工作很轻松地就被共享了。当今时代，电脑大多是多核的，所以并行处理是一个很受欢迎的点。

### esbuild 的一切都是从 0 开始写的

任何代码都自己搞定往往比频繁使用第三方库有着明显的性能优势。这样在你刚一开始编码时，就将性能牢记于心。

自己写代码可以确保每一块数据结构的一致性，从而避免在不同数据结构间转换带来的开销。并且每当必要时，能及时地进行较大幅度的架构更改。当然，缺点是自己写的话工作量确实很大 :)

举个例子，很多打包器都直接采用官方提供的 TypeScript 编译器（TypeScript Compiler）作为自己的一个解析模块。但它是基于 TS 编译器团队自己的研发目标的，而性能并不是人家的首要目标。官方 TS 编译器大量使用了 [megamorphic object shapes](https://mrale.ph/blog/2015/01/11/whats-up-with-monomorphism.html) 和非必要的 [动态属性访问](https://github.com/microsoft/TypeScript/issues/39247)，这两个是众所周知的 JS 减速坑。另外即便类型检测被禁用掉，TS 解析器似乎仍然会执行类型检测。以上这些问题在 esbuild 自己的 TS 解析模块都不会出现。

### 内存被高效利用

理想情况下，随着输入规模的增长，编译器算法的复杂度一般是 O(n)。所以如果要处理大量的数据，内存访问速度对于性能来说就格外重要了。越少的数据转换次数（以及越少的数据转换形态）意味着越快的编译器。

举个例子，esbuild 只会 3 次接触 JS AST（JS 抽象语法树）：

1. 一次是词法分析、语法分析、作用域设置以及声明标识符；
2. 一次是绑定符号、压缩语法、JSX/TS 转 JS 以及 ESNext 转 ES2015；
3. 一次是压缩标识符、压缩空格符、生成代码以及生成 Source Map；

这样做最大程度地复用了 AST 数据。但其他打包器将以上这些步骤分离在不同的独立步骤中，而不是将他们集成、交叉起来。为了把各种库连接起来，往往要在各种数据形态间转来转去。

比如：`字符串 -> TS -> JS -> 字符串`，然后 `字符串 -> JS -> 旧版 JS 语法 -> 字符串`，再然后 `字符串 -> JS -> 压缩了的 JS -> 字符串`。

这会消耗更多的内存空间，而且执行起来还更慢。

使用 Go 语言还有个优势，就是可以在内存空间中存储数据存储得**更紧密**。这样就可以花费更少的内存空间，从而让 CPU 能缓存的数据更多。

Go 语言还自带值语义（value semantics）特性，可以直接将一个对象嵌入另一个对象，而这一切都是“免费”的，不需要任何其他配置。

上面这两点特性是 JS 不具备的，并且 JS 还有其他缺点比如前面提到的 JIT 开销。

所有以上这些只是一些显著提速的点，但如果把它们综合起来，那么对于一个打包器来说是多维度的提升，这会比我们如今普遍使用的打包器快上很多很多。

## （四）水准测试详情

下图是 esbuild 团队进行的各水准测试详情：

测试的是将 [three.js](https://github.com/mrdoob/three.js) 复制 10 份来模拟的大型 JS 库，从头开始打成一个包，不借助缓存。

拉下来 [esbuild 仓库](https://github.com/evanw/esbuild) 执行 `make bench-three` 指令就可以进行测试了。

打包器 | 用时 | 相对倍数 | 绝对速度 | 输出包体积
-- | -- | -- | -- | --
esbuild | 0.37s | 1x | 1479.6 kloc/s | 5.81mb
esbuild（单线程） | 1.61s | 4x | 340.0 kloc/s	| 5.81mb
rollup + terser | 37.79s | 102x | 14.5 kloc/s | 5.81mb
parcel 2 | 39.28s | 106x | 13.9 kloc/s | 5.87mb
webpack 4 | 43.07s | 116x | 12.7 kloc/s | 5.97mb
webpack 5 | 55.25s | 149x	| 9.9 kloc/s | 5.84mb

表格中的 `kloc/s` 指的是每秒处理的千行代码，其中的 kolc 英译为 Kilometer Lines Of Code。

表中的“用时”取的是 3 次运行的最佳时间。另外：

* 对于 ESBuild，执行参数是 `--bundle --minify --sourcemap`，对于单线程场景使用的是 `GOMAXPROCS=1`；
* 对于 Rollup，由于 Rollup 本身不支持压缩，因此使用了 `rollup-plugin-terser` 插件；
* 对于 Webpack，执行参数是 `--mode=production --devtool=sourcemap`；
* 对于 Parcel 2，使用的是默认配置（没有把 Parcel 1 包含进来是因为在启动阶段就崩溃了）；

计算绝对速度时，是包含了注释行、空行的，总共是 547,441 行。设备方面是在一台 2019 年 6核 16GB 内存的 Mac Pro 上进行的。

### TypeScript 打包水准测试

如图：

该测试使用 [Rome](https://github.com/facebookexperimental/rome) 这个构建工具来作为模拟的大型 TypeScript 项目。所有代码都将打包到一个单独的文件中，支持 Source Map 并且能直接运行。

拉下来 [esbuild 仓库](https://github.com/evanw/esbuild) 执行 `make bench-rome` 指令就可以进行测试了。

打包器 | 用时 | 相对倍数 | 绝对速度 | 输出包体积
-- | -- | -- | -- | --
esbuild | 0.11s | 1x | 1198.5 kloc/s | 0.97mb
esbuild（单线程） | 0.40s | 4x | 329.6 kloc/s | 0.97mb
webpack 4 | 19.14s | 174x | 6.9 kloc/s | 1.26mb
parcel 1 | 22.41s | 204x | 5.9 kloc/s	| 1.56mb
webpack 5 | 25.61s | 233x | 5.1 kloc/s | 1.26mb
parcel 2 | 31.39s	| 285x | 4.2 kloc/s	| 0.97mb

同样，表中的“用时”取的是 3 次运行的最佳时间。另外：

* 对于 ESBuild，执行参数是 `--bundle --minify --sourcemap --platform=node`，对于单线程场景使用的是 `GOMAXPROCS=1`；
* 对于 Webpack，将 `ts-loader`设置为 `transpileOnly: true`，执行参数是 `--mode=production --devtool=sourcemap`；
* 对于 Parcel 1，执行参数是 `--target node --bundle-node-modules`；
* 对于 Parcel 2，在 `package.json` 中设置了 `"engines": "node"`，并且使用了 `@parcel/transformer-typescript-tsc` 来处理 TS 代码；

测试结果没包含 Rollup 是因为在尝试了 `rollup-plugin-typescript`、`@rollup/plugin-typescript` 以及 `@rollup/plugin-sucrase` 后依然无法打包，它们都会在编译 TS 时报不同的错。

和做 JS 打包测试一样，计算绝对速度时，是包含了注释行、空行的，总共是 131,836 行。电脑用的还是那台 2019 年 6核 16GB 内存的 Mac Pro。

## （五）小结

本篇文章首先介绍了 **ESBuild 的基本使用**。单从使用角度来看，其实和其他打包工具没有明显的差异，都有着指令系统以及可配置文件的方式。

然后我们介绍了 **ESBuild 内置支持的打包文件类型**，更加详细的支持情况可以参考 [Content Types | esbuild.github.io](https://esbuild.github.io/content-types/)。

最后我们用了大量篇幅来介绍**什么是及时编译语言**以及**为什么 ESBuild 要比传统打包器更快**。

JIT（及时编译）语言在程序启动后会实时地进行编译，JS 属于 JIT 语言。那么用 JS 写的打包器在 NodeJS 环境下每次打包时，都要有一步解析打包器代码的过程，这一步造成了不必要的资源浪费以及时间消耗。

ESBuild 的快速，主要表现在这几方面：

* **ESBuild 是 Go 语言写的**。Go 不属于 JIT 语言，它直接编译成机器码给计算机使用，另外 Go 语言对并行的支持度更好；
* **ESBuild 大量使用了并行处理**。算法充分地利用了 CPU 资源，多线程共享内存；
* **ESBuild 的一切代码都是从 0 码起来的**。没有使用其他第三方库。这样数据结构在各个处理阶段中从始至终都是一致的，没有额外的转换成本，而且 ESBuild 将性能作为了高优先级考虑；
* **内存被高效利用**。ESBuild 打包全程只会 3 次接触 JS AST。另外使用 Go 语言在内存中存储数据，会存储得更紧密，这样就会用更少的内存空间而让 CPU 缓存的数据更多。

最后欢迎在评论区与我讨论，相互促进，共同成长 :)

## ToDo List

- [ ] [megamorphic object shapes](https://mrale.ph/blog/2015/01/11/whats-up-with-monomorphism.html)
- [ ] [动态属性访问](https://github.com/microsoft/TypeScript/issues/39247)
- [ ] JavaScript AST
