# “可圈可点”的 Map 与 Set

## （一）Map 和 Set 是 ES6 中新加入的数据类型

新出来一块知识点首先要明确的是它在语言的知识点网络中的位置。

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

**ES 提供给 `Map` 3 个遍历器生成函数（Generator 函数）**：

* [`Map.prototype.keys()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/keys)：返回迭代器（Iterator）对象，包含着按照顺序插入 `Map` 实例的每个 `key` 值；
* [`Map.prototype.values()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/values)：返回迭代器对象，包含着按照顺序插入 `Map` 实例的每个 `value` 值；
* [`Map.prototype.entries()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/entries)：返回一个包含 `[key, value]` 对的迭代器对象，依然维护着键值对插入顺序。

**ES 同时也提供了 1 个遍历方法**：

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

`Map` 还有一个“兄弟”类型，那就是 `WeakMap`（弱映射），但要搞懂 `WeakMap`，前提是理解 JavaScript 这门语言的「垃圾回收机制」。

## （三）JS 的垃圾回收机制

### 主动回收与自动回收

随着代码的执行，一些数据可能不再需要，比如在函数局部作用域中声明的变量，如果不考虑闭包，那么在函数执行后就不再需要它们了。

如果不清理这些不需要的数据，它们就会占用越来越多的内存，所以浏览器需要对这些垃圾数据进行回收，从而能及时地释放更多内存出来。

不同编程语言的垃圾回收机制都不尽相同，垃圾回收策略分两类，**「主动回收」和「自动回收」**：

* **主动回收意味着何时分配内存、何时销毁内存，这都由代码控制**，C、C++ 都采用主动回收策略；
* **自动回收意味着程序产生的垃圾数据由编程语言垃圾回收机制自动释放，不需要程序员的手动干预**，JavaScript、Java、Python 都处采用自动回收策略。

垃圾回收的思路其实很简单：确定哪个变量不再使用，然后释放它所占用的内存。这个过程是周期性的，每隔一定时间（或者到了某个预定的收集时间）就会自动运行。

思路虽然很简单，但是问题的关键，就是**如何识别一个变量未来还会不会使用**。

在浏览器发展历史上，主要用到了**两种标记变量的策略：「标记-清理」和「引用计数」**。前者目前被各浏览器广泛采用，而后者已经逐渐退出历史舞台。

### 标记-清除（mark-and-sweep）策略

**「标记-清除」策略是 JS 中最常用的垃圾回收策略**。

“标记-清除”策略的主要步骤：

1. 遍历执行环境栈；
2. 遍历过程中，尝试在内存空间（基本类型的数据在栈中，引用类型的数据在堆中）访问执行环境栈中每一个执行环境的变量；
3. 能访问到的，标记为「活动数据」，访问不到的，标记为「垃圾数据」；
4. 清除掉内存中所有被标记为垃圾数据的数据。

接下来举个具体的例子，来看代码：

```js
function fnOutside() {
  const father = { name: '小头爸爸' };

  function fnInside() {
    const son = { name: '大头儿子' };
  }
  fnInside();

  console.log('函数 fnInside 执行完了');
}
fnOutside();
```

外层函数中有一个引用类型的局部变量 `father`，内层函数中也有一个引用类型的局部变量 `son`。

当函数 `fnInside()` 执行完后，`fnInside` 函数执行环境（上下文）从执行环境栈中出栈，此时执行环境栈中还有 `fnOutside` 函数执行环境和全局执行环境，如图：

这时候对整个执行环境栈遍历，尝试访问各个执行环境中的变量。在 `fnOutside` 执行环境中，变量 `father` 的数据可以在堆内存中访问到，就把它标记为“活动数据”，图中用了绿色，如图：

而对于刚刚出栈的 `fnInside` 执行环境，它其中的变量 `son` 遍历执行环境栈过程中不会被访问，因此被标记为“垃圾数据”，图中用了红色。

最终，清除掉所有被标记为“垃圾数据”的数据，内存得以被释放。

目前，所有浏览器都实现了“标记-清除”策略（或者是它的变体，比如“标记-整理”策略），只是在运行垃圾回收的频率上有所差异。

### 引用计数（reference counting）策略

另一种垃圾回收策略叫「引用计数」，目在各主流浏览器中，它已被“标记-清除”策略取代。

“引用计数”策略的思路：

* 对内存中的每个数据都记录被引用的次数（比如把数据赋值给一个变量，那么这个数据的引用计数 +1）；
* 如果某个变量不再用这块数据了，那么引用计数 -1；
* 当一个数据的引用计数变为 0 时，那么在下次垃圾回收过程中，这个数据会被销毁，从而释放内存。

比如有一坨数据：`['番茄炒蛋', '蛋炒番茄', '鸡蛋炒西红柿', '西红柿炒鸡蛋']`，将它赋值给变量 `dishes`：

`const dishes = ['番茄炒蛋', '蛋炒番茄', '鸡蛋炒西红柿', '西红柿炒鸡蛋'];`

这时候引用计数 + 1，变成 1。

之后又有另一个变量 `anotherDishes` 也用到了这坨数据：

`const anotherDishes = dishes;`

这时候引用计数再次 + 1，变成 2。

然后用 `null` 覆盖变量 `dishes` 的值：

`dishes = null;`

这时候对于菜品这坨数据，相当于引用的地方少了一处，于是引用计数 - 1，变成 1。

同样地，如果接着执行：`anotherDishes = null`，那么引用计数再 - 1，变成 0。

这时候没有任何地方再需要 `['番茄炒蛋', '蛋炒番茄', '鸡蛋炒西红柿', '西红柿炒鸡蛋']` 这坨数据了，于是当垃圾回收再次进行时，它将被销毁掉。

整个过程用代码表示：

```js
const dishes = ['番茄炒蛋', '蛋炒番茄', '鸡蛋炒西红柿', '西红柿炒鸡蛋']; // 引用计数 + 1，变成 1
const anotherDishes = dishes; // 引用计数再次 + 1，变成 2
dishes = null; // 引用计数 - 1，变成 1
anotherDishes = null // 引用计数再 - 1，变成 0
```

一切看上去是那么的美好，但是**引用计数策略有一个致命的缺陷，那就是「循环引用」**。

什么是循环引用？来看代码：

```js
function fn() {
  const father = { name: '小头爸爸' }; // { name: '小头爸爸' } 这坨数据的引用计数 + 1
  const son = { name: '大头儿子' }; // { name: '大头儿子' } 这坨数据的引用计数 + 1

  father.familyMember = son; // 父亲的家人是儿子，{ name: '大头儿子' } 这坨数据的引用计数 + 1
  son.familyMember = father; // 儿子的家人是父亲，{ name: '小头爸爸' } 这坨数据的引用计数 + 1
}
fn();
```

这个例子中，`father` 和 `son` 这两个对象通过它们的属性 `familyMember` 互相引用，这就产生了循环引用。

代码执行后，对于例子中的两坨数据 `{ name: '小头爸爸' }` 和 `{ name: '大头儿子' }`，它们的引用计数都是 2。其中一次是定义变量赋值时，另一次是给对象属性赋值时。

在“标记-清除”策略下，这不会造成问题，因为当 `fn()` 函数执行后，执行环境栈中不再能访问到那两坨数据，自然会被标记成“垃圾数据”清除。

但是在“引用计数”策略下，由于这两坨数据互相引用对方，即便函数执行完，它们的引用计数也永远不会变成 0，这样也就永远不会被销毁。循环引用一旦激增，便会造成内存泄漏。

因此，**由于存在循环引用这种场景，“引用计数”策略逐渐被“标记-清除”策略所取代**。

## （四）WeakMap 弱映射

`WeakMap` 弱映射的 API 是 `Map` 的子集。

`WeakMap` 与 `Map` 主要有 **3 点区别**：

1. `WeakMap` 的 `key` 只能是对象（使用其他类型会抛 `TypeError` 的错，`key` 是 `null` 也不行）；
2. `WeakMap` 的键名所指向的对象，不计入垃圾回收机制；
3. `WeakMap` 没有迭代其键值对的能力（即不可迭代）。

下面我们一一说明。

### `WeakMap` 的 `key` 只能是对象

来看一个创建 `WeakMap` 的例子：

```js
const key1 = { id: 1 };
const key2 = { id: 2 };
const key3 = { id: 3 };

const vm = new WeakMap([
  [key1, 'val1'],
  [key2, 'val2'],
  [key3, 'val3'],
]);
```

上面代码中，`WeakMap` 构造函数接收一个可迭代对象，包含着键值对数组。

如果继续给 `vm` 这个 `WeakMap` 实例添加键名是非对象的键值对，那就会报 `TypeError` 错：

```js
vm.set('skill', '睡觉'); // Uncaught TypeError: Invalid value used as weak map key
vm.set(null, '空空如也'); // Uncaught TypeError: Invalid value used as weak map key
```

### `WeakMap` 的键名所指向的对象，不计入垃圾回收机制

这一点至关重要，这也是为什么要叫 `WeakMap` 弱映射的原因。

前文在说明 JS 垃圾回收机制时有提到，JS 会自动地将内存中不再使用的数据回收掉。

但试想如果在哈希结构中存在对某块数据的引用，那这块数据是不是就会一直不被垃圾回收呢？

这似乎在某些场景下存在着内存泄漏的风险。

比如让一个 DOM 节点作为哈希的键，把节点的已点击状态作为哈希的值，点击节点以后更新这个值。

后续一旦这个节点被销毁了，那它对应的状态信息怎么办？不销毁的话就会造成内存泄露，手动销毁又太麻烦！

这时就要用到 `WeakMap` 弱映射了。

“弱”指的是“弱弱地拿着”，意思是 `WeakMap` 的键名所指向的对象，不属于正式的引用，不会阻止垃圾回收。

如果 `WeakMap` 的键指向的对象在其他地方被清除了，那么 `WeakMap` 中以该对象为键名的键值对，也会被自动清除，也就是此时不会阻止垃圾回收。

来看一个直观的例子：

```js
const container = {
  key: {},
};
const vm = new WeakMap();

// 为 WeakMap 实例设置 key
vm.set(container.key, 'val');
console.log(vm.get(container.key)); // "val"

// vm 实例键名所指向的对象被清除了
container.key = null;

// vm 实例中以该对象为键名的键值对，被自动清除了
console.log(vm.get(container.key)); // undefined
```

再看一个更简单粗暴的例子：

```js
const vm = new WeakMap();

vm.set({}, 'val');
```

上面使用一个对象字面量作为 `WeakMap` 实例的 `key`。执行 `set()` 方法时会创建一个空对象，因为再没有指向这个空对象的其他引用，所以代码执行后，这个空对象就会被自动垃圾回收，从而以这个自动创建的空对象作为键的键值对也会被自动销毁。

PS：另外需要特别注意，`WeakMap` 只是键名所指向的对象是弱引用，键值的引用并不是弱引用！

### `WeakMap` 不可迭代

因为 `WeakMap` 的键值对随时可能被销毁，所以没必要为它提供迭代键值对的能力，同样也没有类似 `clear()` 一并清除所有键值对的能力。

也正是因为 `WeakMap` 不可迭代，所以也不可能在不知道对象引用的情况下从 `WeakMap` 中取得值。

### `WeakMap` 的使用场景



## （五）Map VS Object 各方面对比

用一张表格来说明 `Map` 和 `Object` 的主要区别：

| | Map | Object
-- | -- | --
`key` 的类型 | 任意 | `String` 或 `Symbol`
`Key` 的顺序 | 有序，按插入 `key` 的顺序遍历 | ES5 无序，ES6 后按插入 `key` 的顺序遍历
意外的 `key` | 初始不包括任何 `key`，只包含显式插入的 `key` | 原型链上有若干 `key`
计算 `key` 的个数 | 通过 [`size`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/size) 属性轻易得到 | 只能通过遍历手动计算
性能 | 内存空间利用率更好；在频繁增删键值对场景下表现更好 | 在频繁增删键值对场景下未做优化

综合上表，如果很在乎内存和性能的话，编码时在选择 `Map` 和 `Object` 上还是有很大区别的。

### 从内存占用角度

不同浏览器在实现 `Map` 和 `Object` 有着明显差异，但相同的是，**随着键值对存储数量的增加，占用的内存也会相应地线性增加**。

不同的是，**Map 的内存空间利用率更好**，如果给定相同大小的内存，`Map` 大约可以比 `Object` 多存储 50% 的键值对。

### 从键值对的插入性能角度

向 `Map` 和 `Object` 中插入新的键值对的消耗大致相同（`Map` 会稍快一点）。

对于这两个类型，插入速度并不受已存储的键值对数量影响。

但**对于涉及大量插入操作的场景，显然 `Map` 的性能更好**。

### 从键值对的查找性能角度

在大型 `Map` 和 `Object` 中查找键值对的性能差异极小（如果只包含少量键值对，`Object` 查找更快）。

如果把连续整数作为 `Object` 的 `key`，也就是把对象当数组使用，浏览器引擎可以进行优化，这一点 `Map` 是无法做到的。

所以，**对于涉及大量查找键值对操作的场景，选择 `Object` 会更好一些**。

### 从键值对的删除性能角度

使用 `delete` 删除 `Object` 属性的性能一直饱受诟病。

对于大多数浏览器，`Map` 的 `delete()` 操作要快于插入和查找。

所以，**对于涉及大量删除键值对操作的场景，无疑 `Map` 会更好**。

对于性能，上面我们分别从“内存占用”、“插入”、“查找”、“删除”这 4 个角度对比了 `Map` 和 `Object`。

**在尤其考虑性能的时候，除了“涉及大量查找操作”的场景，`Map` 的表现都优于 `Object`**。
