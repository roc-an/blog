# “可圈可点”的 Map 与 Set

## （一）Map 和 Set 是 ES6 中新加入的数据类型

新出来一块知识点首先要明确的就是它在语言的知识点网络中的位置。

JavaScript 由 3 部分组成：

* ECMAScript 核心语法（简称 ES）：变量、控制语句、运算符、各种数据类型等。这些是其他语言都要有的；
* DOM API：用于操作 DOM 元素
* BOM API：用于操作浏览器

其中能把 ES 标准中数据类型的细分说得清楚的人并不多。

数据类型主要分两种：

* 基本数据类型（也叫原始数据类型）：`undefined`、`null`、`Boolean`、`Number`、`String`、`Symbol`、`BigInt` 共 7 种；
* 引用数据类型

其中**引用数据类型又可以再分为两种，分别是“基本引用类型”和“集合引用类型”**，本篇文章的 `Map` 和 `Set` 就是属于“集合引用类型”。我把引用数据类型的细分列出来：

* 基本引用类型（4）：
  * `Date` 类型：时间日期
  * `RegExp` 类型：正则表达式
  * 包装类型（也叫原始值包装类型）3 种：每当用到某个原始值（也就是基本数据类型值）的属性或方法时，JS 引擎都会创建一个相应的包装类型实例，从而暴露出操作该原始值的各种方法
    * `Boolean`
    * `Number`
    * `String`
  * 单例内置对象（内置对象指的是任何由 ECMAScript 实现提供、与宿主环境无关，并在 ECMAScript 程序开始执行时就存在的对象）
    * `Global`：无法用代码显式访问，它是用来“兜底”的，所针对的是不属于任何对象的属性和方法。
      * `Global` 对象的属性：特殊值比如 `undefined`、`NaN`、`Infinity` 等，以及所有原生引用类型函数，如 `Object`、`Function` 等，都是 `Global` 对象的属性；
      * `Global` 对象的方法：`isNaN()`、`isFinite()`、`parseInt()`、`parseFloat()`，以及编码方法 `encodeURI()` 等，`eval()` 这些都属于 `Global` 对象的方法；
      * 虽然 `Global` 对象无法显式访问，但浏览器将 `window` 对象实现为 `Global` 对象的代理，所有全局作用域中声明的变量和函数都变成了 `window` 的属性；
    * `Math`：保存着数学公式，提供辅助计算的属性和方法
* 集合引用类型（8）：
  * `Object`
  * `Array`
  * `Function`
  * 定型数组（typed array）：是新增的类型，用于提升向原生库传输数据的效率，是一种特殊的包含数值类型的数组
  * `Map`
  * `WeakMap`
  * `Set`
  * `WeakSet`

这样列下来后就比较清晰了，**本文的主角 `Map` 和 `Set`，是属于 JS 核心语法 ECMAScript 中数据类型这块，细分下去，它们是「引用数据类型」中「集合引用类型」的一员**。

## （二）Map 为 JS 带来了真正的键/值对存储机制

### ES5 时代对象的 key 只能是字符串

ES6 以前，对象是典型的键/值对存储的代表，但对象只能用字符串作为键（ES6 后还可以用 `Symbol` 作为键），这在使用方面会带来诸多限制。 

为此，TC39 委员会补充了 ES 规范，**`Map` 是一种新的集合引用类型，它也采用键/值对的方式存储数据，但特别的是，它的键可以是任意数据类型，甚至是一个对象**。

来看举一些具体例子。

如果对象的 `key` 是一个非字符串类型数据，那么在设置这个 `key` 时会调用 `toString` 方法：

```js
const obj = {};
const element = document.getElementById('myDiv') // 获取 DOM 节点

obj[element] = 'This is a element';
console.log(obj); // {[object HTMLDivElement]: "This is a element"}
console.log(obj['[object HTMLDivElement]']); // "This is a element"
```

从打印结果可以看到，在将一个 DOM 节点设为对象属性时，转成了类型信息的字符串作为 `key`，之后要想取到值就要用该类型信息字符串。

如果执行：

```js
Object.prototype.toString.call(element); // "[object HTMLDivElement]"
```

就会发现转字符串的行为，其实和调用 `Object.prototype.toString.call()` 是等价的。

### Map 是一种“值-值”映射

如果说对象提供了“字符串-值”的映射关系，那么 `Map` 提供的是“值-值”的映射，`Map` 是一种更完善的 Hash 结构的实现。

简单概括下 `Map` 的基本使用，完整的 API 可以参考 [Map | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)。

来看看 `Map` 的增、删、改、查、清 API：

* 增和改：都是 [`Map.prototype.set(key, value)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/set)；
* 删：[`Map.prototype.delete(key)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/delete)；
* 查：[`Map.prototype.get(key)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/get)；
* 清：[`Map.prototype.clear()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/clear)

另外可以通过 [`Map.prototype.has(key)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/has) 来检查 `Map` 实例中是否存在指定的键值对。

举个简单例子（爸爸到儿子的映射）：

```js
const father1 = { name: '小头爸爸' };
const son1 = { name: '大头儿子' };

const m = new Map(); // 用 Map 构造函数创建实例

m.set(father1, son1); // 添加键值对，注意这里将对象作为了键
console.log(m.get(father1).name); // "大头儿子"。取值

m.delete(father1); // 移除键值对
console.log(m.has(father1)); // false。判断键值对是否存在
```

上例中，我们使用了对象作为 `Map` 实例的键，其他任何类型都可以，甚至将键设成 `Map` 实例也可以。从语言层面已经完全开放了键/值对存储，至于怎么用，那就要看实际场景了。

### Map 中的键值对是有序的

ES5 时代，对象的键值对是无序的，每次遍历将得到不同顺序的结果。**自 ES6 以来，对象保留了键的创建顺序，后续再遍历对象将按键的创建顺序来遍历**：

```js
const obj = {};

for (let i = 0; i < 10; i++) {
  obj[String(i)] = i;
}

for(let key in obj) {
  console.log(obj[key]); // 总是打印 0 到 9
}
```

**Map 实例中的键值对也是有序的。Map 实例会维护键值对的插入顺序，因此可以根据插入顺序执行迭代操作**

所以，这就能理解为什么创建 `Map` 实例时，给构造函数要传递一个数组* []了：

```js
const m = new Map([
  ['key1', 'val1'],
  ['key2', 'val2'],
  ['key3', 'val3']
]);
console.log(m.size); // 3
```

**本质上来说，任何具有 [`Iterator` 接口](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator)（也就是可迭代的）、且成员都是双元素数组的数据结构，都可以作为 `Map` 构造函数的参数**。

ES 提供给 `Map` 3 个遍历器生成函数（Generator 函数）：

* [`Map.prototype.keys()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/keys)：返回迭代器（Iterator）对象，包含着按照顺序插入 `Map` 实例的每个 `key` 值；
* [`Map.prototype.values()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/values)：返回迭代器对象，包含着按照顺序插入 `Map` 实例的每个 `value` 值；
* [`Map.prototype.entries()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/entries)：返回一个包含 `[key, value]` 对的迭代器对象，依然维护着键值对插入顺序。

ES 同时也提供了 1 个遍历方法：

* [`Map.prototype.forEach()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach)：按照键值对的插入顺序来遍历 `Map` 实例中的每个键值对。

接上面例子，分别使用这 4 种方式对 `Map` 实例 `m` 进行遍历：

```js
// 1. 使用 Map.prototype.keys() 遍历器生成函数
for (let key of m.keys()) {
  console.log(key); // 依次打印 "key1", "key2", "key3"
}

// 2. 使用 Map.prototype.values() 遍历器生成函数
for (let value of m.values()) {
  console.log(value); // 依次打印 "val1", "val2", "val3"
}

// 3. 使用 Map.prototype.entries() 遍历器生成函数
for (let item of m.entries()) {
  console.log(item); // 依次打印 ["key1", "val1"], ["key2", "val2"], ["key3", "val3"]
}

// 4. 使用 Map.prototype.forEach() 遍历方法
m.forEach((value, key, map) => {
  console.log(`m[${key}] = ${value}`); // 依次打印 "m[key1] = val1", "m[key2] = val2", "m[key3] = val3"
})
```

以上可以看到，无论使用那种遍历方式，最终输出的顺序都是一致的，都与键值对的插入顺序一致。

还有一个小 Tip 就是可以使用展开运算符 `...` 来将 `Map` 实例转为数组：

```js
console.log([...m]); // [["key1", "val1"], ["key2", "val2"], ["key3", "val3"]]
```
