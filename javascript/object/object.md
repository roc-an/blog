# 深入理解 JavaScript 中的对象

> 发布于 2021.08.16，最后更新于 2021.08.16。

> 封面图取自王者荣耀官网，英雄曜的限定皮肤——李逍遥

ECMAScript 中定义，对象其实就是一组属性的无序集合。对象的属性和方法都由一个个标识符来标识，每个标识符映射到一个值。

第一个话题是「对象的存储」，也就是在浏览器中 JS 的对象是怎么存的。

其实这背后也意味着 JS 中数据是怎么存的。理解它将对我们使用各种数据类型有着莫大帮助，一些奇怪的现象得以解释，同时也会让我们在日常编码中规避很多低级失误。

## （一）对象在浏览器内存中的存储

目前为止（2021 年），JS 一共就只有 8 种数据类型，前 7 种是「基本类型」（也称「原始类型」）：

* Boolean
* Number
* String
* Symbol
* BigInt
* null
* undefined

最后 1 种 Object 是「引用类型」，它是由前 7 种基本类型组成的、包含着 Key-Value 键值对的数据类型。

我们要重点讨论的对象就属于引用类型。

之所以将他们区分开，本质上是因为基本类型和引用类型在内存中的存储情况是不同的。

JS 代码执行过程中，浏览器内存中主要分配了 3 种内存空间：

* 代码空间：存储着可执行代码
* 栈空间
* 堆空间

### 基本类型的值存在栈中

栈空间，也就是调用栈（Call Stack），是用来存储执行上下文的（比如全局执行上下文 window、函数的执行上下文）。

来看代码：

```js
let a = 10;
let b = a;
```

这段代码执行后，内存中的栈空间情况如图：

**对于基本数据类型，值都存在栈中。**

在执行 `let b = a;` 时，是将变量 `a` 的值 `10` 拷贝给了变量 `b`。

因此，**对于基本数据类型，变量的拷贝，拷贝的是值。**

这时候如果执行 `b = 100;`，再 `console.log(a);`，会发现 `a` 的值依然是 10。这是因为拷贝值以后，变量 `a` 与 `b` 之后的修改互不影响。

### 引用类型的值存在堆中，地址存在栈中

继续追加两行代码：

```js
let c = { name: '曜' };
let d = c;
```

这段代码执行后，内存中的栈空间、堆空间情况如图：

从图中可以看出，**对于对象这种引用类型来说，具体的值是放到堆中，地址是是放到栈中，通过栈中地址可以顺藤摸瓜访问到堆中的值。**

这时候如果通过变量 `d` 存储的地址，修改了对象数据，那么同时也会影响到变量 `c`：

```js
d.name = '吕布';
console.log(c); // { name: "吕布" }
```

这是因为在 JS 中，**对于引用类型的变量拷贝，拷贝的是地址。**

所以 `d = c;` 相当于将 `c` 存着的地址拷贝给了 `d`。之后变量 `c` 和 `d` 保存的是同一个地址，这个地址指向了堆中的对象数据。

小结一下，对于 JS 中变量的赋值拷贝：

* 对于基本类型，拷贝的是值；
* 对于引用类型，拷贝的是地址；

### 浏览器栈空间与堆空间的区别

考虑到数据量的存储以及程序的执行效率，才区分了栈空间和堆空间。

栈空间保存着函数的执行上下文，执行上下文中又保存着变量。当函数执行后，函数的执行上下文会被回收，如果所有数据都存在栈中，势必会影响上下文的切换效率，进而导致整个程序变慢。

所以从存储的大小来看：

* 栈空间更小，存着基本类型数据的值以及引用类型数据的地址，这些数据在内存中都是固定大小的；
* 堆空间更大，存着引用类型数据的值，这些值随着程序的执行可能还会更大（比如往数组中 `push` 新元素）；

这种栈空间+堆空间的机制虽然在分配和回收内存方面有一定开销，但总体而言既确保了大量数据的存储，又确保了程序的执行效率。

## （二）引子-属性类型

定义一个对象非常简单：

```js
const obj = { a: 1 };
```

但每个对象的背后都暗藏着玄机：

```js
Object.getOwnPropertyDescriptor(obj, 'a');
```

将会得到：

```js
{
  writable: true,
  configurable: true,
  enumerable: true,
  value: 1,
}
```

这些 `configurable`、`enumerable`、`value`、`writable` 又是什么鬼？

看来 JS 中的对象远没有只是简单定义一些标识符到值得映射这么简单。

至于上面得到的这些是什么，先卖个关子，后文会详述。我们先讨论一个话题 —— JS 对象属性的类型。

对象的属性分为 2 类：「数据属性」和「访问器属性」。

## （三）数据属性

顾名思义，"数据属性"是要携带具体数据的。

算上数据本身，ECMAScript 还通过一些内部特性来描述一个属性的行为，比如这个属性的值在定义后是否可改啦、属性是否可以被遍历到啦等等。

这些内部特性也叫「属性描述符」（`descriptor`），数据属性有 4 种属性描述符：

* `[[Writable]]` 是否可写
* `[[Configurable]]` 是否可配置
* `[[Enumerable]]` 是否可枚举
* `[[Value]]` 属性值

之所以加上 `[[]]` 是因为这些属性描述符都是 JS 引擎根据标准在浏览器内部实现的，没办法直接访问这些属性描述符。

下面来一一介绍它们。

### `[[Writable]]`

**该属性是否可写。**也就是该属性是否可以被修改。默认情况下为 `true`，这也就是说默认情况下我们定义的对象上的属性都是可以被再修改的。

后面示例中我们会看到，一旦把对象属性的 `[[Writable]]` 特性改为 `false`，那么该属性的值就没办法再重新赋值了，也就是不可写了。

### `[[Configurable]]`

**该属性是否可配置。**默认直接定义在对象上的属性，该特性都为 `true`。

如果是 `true`，则表示该属性可以通过 `delete` 将它从对象上删除：

```js
const obj = { a: 1 };
delete obj.a; // true
console.log(obj); // {}
```

另外，如果是 `true`，也表示该属性的特性可以被修改。

那怎么修改对象属性的特性呢？

#### `Object.defineProperty()` 基本使用

可以通过 [`Object.defineProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 来修改对象属性（或定义新属性）

语法：`Object.defineProperty(obj, prop, descriptor)`，其中：

* `obj`：要定义或修改属性的对象
* `prop`：要定义或修改的属性名
* `descriptor`：要定义或修改的属性描述符对象

举个例子：

```js
const obj = { a: 1 };
obj.a = 2; // 能正常修改 a 属性

Object.defineProperty(obj, 'a', {
  writable: false, // 将 a 属性的特性设置为不可修改
})
obj.a = 100;
console.log(obj.a); // 2，依旧是 2 因为 writable 为 false
```

如果属性 `a` 是一个引用类型呢？

```js
const obj2 = { a: [1, 2] };

Object.defineProperty(obj2, 'a', {
  writable: false,
});

obj2.a.push(3);
console.log(obj2.a); //  [1, 2, 3]
```

我们发现 `a` 的值还是变了，这是为什么？

其实这又回到一开始我们提到的对象的存储，属性 `a` 存的实际上是引用类型的地址，所以 `writable` 设为 `false` 后意味着这个地址不能变。也就是不能对其进行重新赋值：

```js
obj2.a = [5, 6];
console.log(obj2.a); // 还是 [1, 2, 3]
```

### `[[Enumerable]]`

**该属性是否可枚举。**枚举的意思说白了就是该属性是否可以被 `for-in` 循环和 `Object.keys()` 的遍历中被访问到。

默认为 `true`，也就是直接定义在对象上的属性，默认是可枚举的：

```js
const obj = { a: 1, b: 2, c: 3 }
Object.keys(obj); //  ["a", "b", "c"]
```

如果我们使用 `Object.defineProperty()` 将 `b` 属性设为不可枚举：

```js
Object.defineProperty(obj, 'b', { enumerable: false });

for (let key in obj) {
  console.log(obj[key]); // 打印 1, 3
}

Object.keys(obj); // ["a", "c"]
```

那么再使用 `for-in` 或 `Object.keys()` 对对象属性进行遍历，就不会访问该不可枚举属性了。

对象原型上提供了 [`Object.prototype.propertyIsEnumerable()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable) 方法，通过它可以判断对象的属性是否可枚举：

```js
obj.propertyIsEnumerable('a'); // true，a 属性是可枚举的
obj.propertyIsEnumerable('b'); // false，b 属性是不可枚举的
```

### `[[Value]]`

**该属性的值。**也就是对象实际读取和写入的属性值。默认是 `undefined`。可以将对象属性值设置成任何 JavaScript 值。

小结一下，当我们创建了一个新对象并让其携带初始属性，那么：

* 这些属性的 `[[Writable]]`、`[[Configurable]]`、`[[Enumerable]]` 均为 `true`；
* 这些属性的 `[[Value]]` 都会被设定为指定的值；

可以通过 [`Object.getOwnPropertyDescriptor()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) 这个对象的静态方法来获取对象属性的各特性。

你会发现，我们其实又回到了最初引言中的例子：

```js
const hero = {
  name: '曜',
};

Object.getOwnPropertyDescriptor(hero, 'name');
```

将得到：

```js
{
  writable: true,
  configurable: true,
  enumerable: true,
  value: "曜",
}
```

## （四）访问器属性

访问器属性没有具体的值，取而代之的是，拥有可选的取值（getter）、设置值函数（setter）。

访问器属性也有 4 种属性描述符：

* `[[Configurable]]`：同数据属性一致；
* `[[Enumerable]]`：同数据属性一致；
* `[[Get]]`：取值函数，非必需的，在读取对象属性值时会被调用。默认为 `undefined`；
* `[[Set]]`：设置值函数，非必需的，在写入对象属性值时会被调用。默认为 `undefined`；

### 定义访问器属性，模拟英雄升级加点

可以通过 `Object.defineProperty()` 来为对象定义访问器属性：

```js
// 模拟王者荣耀英雄，曜
const hero = {
  _level: 1,
  name: '曜',
  skills: [{
    name: '裂空斩',
    level: 1,
  }]
};

// 取曜的已学技能名
Object.defineProperty(hero, 'skillNames', {
  // skillNames 的取值函数
  get() {
    return this.skills.map(skill => skill.name);
  }
});

// 提升英雄等级，学习新的技能
Object.defineProperty(hero, 'level', {
  // level 的取值函数
  get() {
    return this._level;
  },

  // level 的设置值函数
  set(newValue) {
    this._level = newValue;

    switch (newValue) {
      case 2: // 2 级了，学 2 技能
        this.skills.push({
          name: '逐星',
          level: 1,
        });
        break;
      case 3: // 3 级了，升级已学的 1 技能
        this.skills[0].level += 1;
        break;
      case 4: // 4 级了，学大招
        this.skills.push({
          name: '归尘',
          level: 1,
        });
        break;
      default:
        console.log('本示例仅模拟曜的前 4 级升级加点情况');
    }
  }
});
```

上面代码中，我们定义了对象 `hero` 来模拟王者荣耀中的英雄曜在前 4 级的升级加技能点情况。

英雄每升一级就能新学习新技能或升级一个现有技能。

其中 `_level` 表示私有属性“等级”，虽然加了下划线前缀与其他属性从命名角度区分，但本质上 JS 对象是不存在私有属性的，所以 `_level` 算是一个伪私有属性。

接着我们通过 `Object.defineProperty()` 定义了 `skillNames` 的取值函数。只要一访问 `hero.skillNames` 就能得到已学技能名数组

另外也定义了 `level` 的取值和设置值函数，每当等级增加，学习或升级相应的技能。

我们用代码试一试：

```js
// 初始，曜 1 级，只会一个 1 技能“裂空斩”
console.log(hero.level); // 1
console.log(hero.skillNames); // ["裂空斩"]

// 曜升到 2 级，多学了一个 2 技能“逐星”
hero.level += 1;
console.log(hero.level); // 2
console.log(hero.skillNames); // ["裂空斩", "逐星"]

// 曜升到 3 级，已学的技能“裂空斩”升了 1 级
hero.level += 1;
console.log(hero.level); // 3
console.log(hero.skillNames); // ["裂空斩", "逐星"]
console.log(hero.skills[0]); // { name: "裂空斩", level: 2 }，发现此时技能裂空斩正如预期那样升了一级

// 曜升到 4 级，学习大招“归尘”
hero.level += 1;
console.log(hero.level); // 4
console.log(hero.skillNames); // ["裂空斩", "逐星", "归尘"]

// 再给英雄升级，就会得到打印提示
hero.level += 1; // 控制台输出 "本示例仅模拟曜的前 4 级升级加点情况"
```

上面例子中我们发现，虽然设置的是 `level` 属性的值，但同时又会影响到 `_level` 和 `skills` 属性，并且间接影响到了 `skillNames` 属性的取值。

这种**设置一个属性而导致其他事情发生的情况，是访问器属性非常典型的使用场景。**

如果要一次性为对象的多个属性定义属性描述符，可以使用 `Object.defineProperties()`，这里就不再赘述了。

## （五）对象的静态方法

对象的所有静态方法可以在这里查到：[Object | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)

我们挑一些典型的、在框架底层常用的以及 ES 标准新增的方法做介绍。方法的详细使用语法可以参考 MDN。

### `Object.assign()` 拷贝对象属性

`assign` 英文释义是分配、指派、赋值的意思。

`Object.assign()` 方法将一个或多个对象的可枚举属性赋值到目标对象。

语法：`Object.assign(target, ...sources)`，其中 `target` 是目标对象，`sources` 是一或多个源对象。示例：

```js
const hero1 = { name: '小乔' };
const hero2 = { age: 16 };
const hero3 = { age: 17, email: 'qiao@hero.com' };

const hero = Object.assign(hero1, hero2, hero3);
console.log(hero); // { name: "小乔", age: 17, email: "qiao@hero.com" }
```

需要注意的是，如果遇到同名属性，后面的会覆盖前面的。

**使用 `Object.assign()` 进行对象拷贝时，注意是「浅拷贝」：**

```js
const obj = {
  name: '曜',
  skills: ['裂空斩', '逐星'],
};

const dist = Object.assign({}, obj);
dist.skills.push('归尘');
// 修改了拷贝后的新对象的引用类型属性，也会影响旧对象
console.log(obj.skills); // ["裂空斩", "逐星", "归尘"]
```

**另外，`Object.assign()` 不会遍历不可枚举属性：**

```js
const obj = {
  name: '曜',
  skills: ['裂空斩', '逐星'],
};

Object.defineProperty(obj, 'skills', { enumerable: false });
console.log(Object.assign({}, obj)); // { name: "曜" }
```

### `Object.create()` 创建一个指定了原型的新对象

传入一个对象，得到一个新对象，传入对象作为新对象的原型。

语法：`Object.create(proto，[propertiesObject])`，其中：

* `proto`：要作为新对象原型的对象；
* `propertiesObject`：属性描述符对象，同 `Object.defineProperties()` 的第二个参数；

一个典型场景是使用它实现类的「寄生组合式继承」：

```js
// 虽然是构造函数，但是居然没有去 new 它，而是通过 .call() 调用
function Father(name, age) { // 父类
  this.name = name
  this.age = age
  this.skills = ['吃饭', '睡觉']
}
Father.prototype.getFatherSkill = function() { // 父类原型方法
  console.log(this.skills)
}

function Son(name, age) { // 子类
  // 1.通过在「子类构造函数」中调用「父类构造函」来「继承属性」
  Father.call(this, name, age)

  // 还可以追加定义子类自己的属性
  this.color = 'blue' // 基因突变
  this.name = '基因突变的儿子'
}

// 2.通过 子类原型 = Object.create(父类原型) 来「继承父类方法」
Son.prototype = Object.create(Father.prototype) // 寄生式 - 借鸡下蛋。避免了 1 次父类构造函数的执行

// 3. 补充完善 constructor 指向
Son.prototype.constructor = Son

const son = new Son('曜', 22);
son.getFatherSkill(); // ["吃饭", "睡觉"]，调用继承来的父类原型方法
```

寄生组合式继承，要理解它其实要拆开看，是 2 个思想：

* 组合式：通过在子类构造函数中调用父类构造函数，来继承属性；通过指定原型关系来继承方法。这两者打了个配合，从而叫组合式；
* 寄生式：使用 `Object.create()` 指定了原型指向关系，从而避免了 1 次父类构造函数的执行，这叫寄生式。

### `Object.freeze()` 冻结对象

`freeze` 是冻结的意思。

**`Object.freeze()` 可以冻结一个对象，冻结后没法再新增、删除属性，也没法修改属性的属性描述符，该对象的原型也不能修改。**

```js
const obj = { name: '曜', };
Object.freeze(obj);

obj.age = 22;
console.log(obj); // { name: "曜" }，冻结后无法新增属性

delete obj.name; // false
console.log(obj); // { name: "曜" }，冻结后无法删除属性

// Uncaught TypeError: Cannot redefine property: name，冻结后无法修改属性描述符
Object.defineProperty(obj, 'name', { enumerable: false });

// Uncaught TypeError: #<Object> is not extensible，冻结后无法修改原型
Object.setPrototypeOf(obj, { a: 1 });
```

**可以通过 `Object.isFrozen()` 来判断一个对象是否被冻结**，继续上面例子：

```js
Object.isFrozen(obj); // true
```

**`Object.freeze()` 还可以冻结数组，冻结后无法被修改：**

```js
const arr = ['吃饭', '睡觉'];
Object.freeze(arr);

// Uncaught TypeError: Cannot add property 2, object is not extensible，冻结的数组无法再 push
arr.push('打哈欠');

arr[0] = '打哈欠';
console.log(arr); // 结果依然是 ["吃饭", "睡觉"]
```

### `Object.seal()` 密封对象

`seal` 是密封的意思。

`Object.seal()` 可以密封一个对象，它和 `Object.freeze()` 的区别是，密封对象的属性值，如果之前可改，那么密封后也可改。

```js
const obj = { name: '曜' };
Object.seal(obj);

obj.age = 22;
console.log(obj); // { name: "曜" }，密封后，同样无法新增属性

obj.name = '小乔';
console.log(obj); // { name: "小乔" }，密封后，之前可改的属性依然可改

delete obj.name; // false
console.log(obj); // { name: "小乔" }，密封后，同样无法删除属性
```

同样地，JS 提供了 `Object.isSealed()` 方法来判断一个对象是否已冻结，继续上面代码：

```js
Object.isFrozen(obj); // false，该对象被密封而不是被冻结
Object.isSealed(obj); // true
```

### `Object.is()` 同值相等

在 ES5 时代，如果要比较两个值是否完全相等，会使用 `===` 而不是 `==`，因为 `==` 在比较时存在「隐式转换」，比如 `1 == '1' // true`。

但是 `===` 其实也有坑人的地方：

```js
NaN === NaN; // false，要想判断 NaN 需要使用 isNaN()
-0 === +0; // true
```

于是 ES6 提出了同值相等（Same-value equality）算法的实现，也就是 `Object.is()`。

`Object.is()` 与严格相等只有 2 处不同：

* `NaN` 等于 `NaN`
* `+0` 与 `-0` 不等

示例：

```js
Object.is(+0, -0); // false
Object.is(NaN, NaN); // true
```

### `Object.preventExtensions()` 与 `Object.isExtensible()`

**可以使用 `Object.preventExtensions()` 让对象变成「不可扩展的」，所谓不可扩展，意思就是不能增加新属性（原型也不可改）：**

```js
const obj = { name: '曜' };
Object.preventExtensions(obj); // 使 obj 这个对象不可扩展

obj.age = 12;
console.log(obj); // { name: "曜" }，无法新增新属性
Object.setPrototypeOf(obj, { a: 1 }); // Uncaught TypeError: #<Object> is not extensible，无法修改原型

obj.name = '小乔';
console.log(obj); // { name: "小乔" }，已有的可改属性依然可改
```

**可以使用 `Object.isExtensible()` 来判断对象是否可扩展，需要注意的是，被冻结、被密封的对象也是不可扩展的。**

```js
const frozen = Object.freeze({});
Object.isExtensible(frozen); // false

const sealed = Object.seal({});
Object.isExtensible(frozen); // false
```

### `Object.keys()`、`Object.values()` 与 `Object.entries()` 遍历对象的键和值

ES5 中，如果我们想遍历一个对象，一般使用 `for-in` 循环：

```js
const obj = { a: 1 };
for (let key in obj) {
  console.log(key); // "a"
}
```

但是，`for-in` 也会遍历原型链上的所有可枚举属性，比如在上面例子追加代码：

```js
// 为对象原型新增了属性 b
Object.prototype.b = 2;

// for-in 循环可以遍历到
for (let key in obj) {
  console.log(key); // "a" "b"
}
```

所以在 ES5 中，如果仅仅想遍历对象自身的属性，`for-in` 要与 `Object.prototype.hasOwnProperty()` 配合使用：

```js
for (let key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(key); // 只打印 "a"
  }
}
```

可是，类似 `Object.prototype.toString`，对象原型上不是应该还有很多其他属性吗，怎么没有被遍历到？因为它们是不可枚举的：

```js
Object.getOwnPropertyDescriptor(Object.prototype, 'toString'); // { writable: true, enumerable: false, configurable: true, value: ƒ }
```

ES6 及后续版本中，加入了 `Object.keys()`、`Object.values()` 和 `Object.entries()`，它们只会遍历对象自身上的属性

**`Object.keys()` 遍历对象自身的可枚举属性，得到属性的键名数组**

```js
const obj = { a: 1, b: 2 };
Object.prototype.c = 3;

Object.keys(obj); // 得到 ["a", "b"]，数组中没有原型上的 "c" 属性
```

**`Object.values()` 遍历对象自身的可枚举属性，得到属性的键值数组**

```js
const obj = { a: 1, b: 2 };
Object.prototype.c = 3;

Object.values(obj); // 得到 [1, 2]，数组中没有原型上 "c" 属性的值 3
```

`Object.entries()` 使用场景相对较少，**`Object.entries()` 遍历对象自身的可枚举属性，得到一个数组，数组元素是键值对数组。**

```js
const obj = { a: 1, b: 2 };
Object.prototype.c = 3;

Object.entries(obj); // [ ["a", 1], ["b", 2] ]
```

小结一下，如果你想遍历一个对象的属性，并且只想遍历对象自身上的，那么优先使用 `Object.keys()`、`Object.values()` 和 `Object.entries()` 而不是 `for-in` 循环。

## （六）Proxy 代理器

### Proxy 介绍

`Proxy` 代理器多用于代理对象。代理后一切对该对象的访问，都要经过拦截。可以拦截对象属性的读取、赋值、枚举。代理器也可以代理一个函数的调用。

从语法角度来看，**`Proxy` 是构造函数**，那么同其他构造函数一样，要想使用它，就得 `new` 构造函数从而得到实例。

语法：`const proxy = new Proxy(target, handler)`，其中：

* `target`：要代理的源对象
* `handler`：配置对象，用于定义代理操作
* `proxy`：得到的代理器 `Proxy` 实例

来看代码：

```js
const obj = { name: '曜' };

const proxyObj = new Proxy(obj, {
  /**
   * get 用来代理对对象的访问操作
   * @param {object} target 代理的源对象
   * @param {string} propKey 要访问的属性名
   * @return {any} 属性值
   */
  get: function(target, propKey) {
    if (propKey === 'name') {
      return '小乔';
    }
    return '未定义属性';
  },
});

proxyObj.name; // "小乔"
proxyObj.age; // "未定义属性"
obj.name; // "曜"
```

这段代码中，我们对对象 `obj` 进行代理，创建了 `Proxy` 实例 `proxyObj`。

我们还定义了代理操作 `get`，每当访问代理实例的属性时就会触发 `get` 函数。

另外需要注意，**要想使代理生效，那么操作的对象应是 `Proxy` 实例**，而不是代理的源对象。

### 13 种可代理操作

除了配置 `get` 进行属性访问的代理操作外，还能配置哪些代理操作呢？

截止 2021 年，目前算上 `get`，一共可以配置 13 种「代理操作」（也叫捕捉器）：

1. [`get(target, propKey, receiver)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/get)：代理读取属性；
2. [`set(target, propKey, value, receiver)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/set)：代理设置属性；
3. [`has(target, propKey)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/has)：代理 `in` 操作符操作；
4. [`deleteProperty(target, propKey)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/deleteProperty)：代理属性的 `delete` 操作；
5. [`ownKeys(target)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/ownKeys)：代理 `Object.getOwnPropertyNames()`、`Object.getOwnPropertySymbols()`、`Object.keys()`、`for-in` 循环等操作；
6. [`getOwnPropertyDescriptor(target, propKey)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/getOwnPropertyDescriptor)：代理 `Object.getOwnPropertyDescriptor()` 操作；
7. [`defineProperty(target, propKey, propDesc)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/defineProperty)：代理 `Object.defineProperty()` 和 `Object.defineProperties()` 操作；
8. [`preventExtensions(target)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/preventExtensions)：代理 `Object.preventExtensions()` 操作；
9. [`getPrototypeOf(target)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/getPrototypeOf)：代理 `Object.getPrototypeOf()` 操作；
10. [`isExtensible(target)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/isExtensible)：代理 `Object.isExtensible()` 操作；
11. [`setPrototypeOf(target, proto)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/setPrototypeOf)：代理 `Object.setPrototypeOf()` 操作；
12. [`apply(target, thisArg, argumentsList)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/apply)：代理函数的调用；
13. [`construct(target, args)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/construct)：代理函数作为构造函数去 `new` 实例的操作。

如果哪种代理操作没定义，那就采用源对象的默认行为。

上面 1~11 种代理操作已经覆盖了对象操作的方方面面，第 12、13 种甚至可以代理一个函数，来拦截函数的调用。

本文不再对每一种代理配置进行展开，详细可以看给出的链接，另外也可以在这里查到完整的 `Proxy` 代理操作方法：[Proxy | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)。

也可以参考阮一峰老师的 [Proxy | 《ECMAScript 6 入门》](https://es6.ruanyifeng.com/#docs/proxy)。

### Proxy 的典型使用场景

#### 数据验证

假设给英雄升级，级数不超过 15 级，那么给对象属性赋值的数据验证可以这样实现：

```js
// 代理操作配置
const validator = {
  /**
   * 代理设置属性
   * @param {object} target 代理的源对象
   * @param {string} propKey 将被设置属性名或 Symbol
   * @param {any} value 新属性值
   */
  set: function(target, propKey, value) {
    // 对 level 属性进行验证，不通过则抛错
    if (propKey === 'level') {
      if (!Number.isInteger(value)) {
        throw new TypeError('level 属性非整数');
      }
      if (value < 0 || value > 15) {
        throw new RangeError('level 值范围应在 0 ~ 15 之间');
      }
    }
    // 通过验证，保留设置对象属性值的默认行为
    target[propKey] = value;
    // set 返回 boolean 值表示设置属性是否成功
    return true;
  },
};

const hero = {
  name: '曜',
  level: 0,
}
const heroProxy = new Proxy(hero, validator); // 创建代理实例

heroProxy.level = 1.01; // Uncaught TypeError: level 属性非整数
heroProxy.level = -1; // Uncaught RangeError: level 值范围应在 0 ~ 15 之间
heroProxy.level = 18; // Uncaught RangeError: level 值范围应在 0 ~ 15 之间
heroProxy.level = 2; // 可正常设置
heroProxy.level; // 2
```

#### 扩展构造函数

结合 `construct` 和 `apply` 这两个代理操作配置，可以实现函数作为构造函数创建实例时的功能扩展：

```js
function getExtendedConstructor(srcConstructor, toExtendFunc) {
  // 得到要扩展的函数的原型的 constructor 属性描述对象
  const descriptor = Object.getOwnPropertyDescriptor(toExtendFunc.prototype, 'constructor');
  // 要扩展的函数的原型设为一个空对象，该空对象的原型是源构造函数的原型
  toExtendFunc.prototype = Object.create(srcConstructor.prototype);
  // 代理配置
  const handler = {
    /**
     * 代理 new 构造函数创建实例
     * @param {function} target 源构造函数
     * @param {array} argumentsList 构造函数的参数列表
     * @return {object} 创建的实例对象
     */
    construct: function(target, argumentsList) {
      // 创建一个新对象，该对象的原型是要扩展的函数的原型（也是个空对象，空对象的原型指向源构造函数的原型）
      // 这一步实现了创建的新对象的原型链式关系：新对象 -> 要继承的函数的原型（空对象） -> 源构造函数的原型
      const obj = Object.create(toExtendFunc.prototype);
      // this 绑定到代理配置对象 handler，这里执行 apply 代理操作
      this.apply(target, obj, argumentsList);
      return obj;
    },
    /**
     * 代理函数调用
     * @param {function} target 源函数
     * @param {any} thisArg 函数被调用时的上下文
     * @param {array} argumentsList 函数被调用时的参数数组
     * @return {any} apply 方法可以返回任何值
     */
    apply: function(target, thisArg, argumentsList) {
      // 以创建的新实例作为 this，执行源构造函数
      srcConstructor.apply(thisArg, argumentsList);
      // 以创建的新实例作为 this，执行要扩展的函数
      toExtendFunc.apply(thisArg, argumentsList);
    }
  };

  const proxy = new Proxy(toExtendFunc, handler); // 创建代理实例

  // 令要扩展的函数的原型的 constructor 指向代理实例
  descriptor.value = proxy;
  Object.defineProperty(toExtendFunc.prototype, 'constructor', descriptor);

  return proxy;
}

const Person = function(name) {
  this.name = name;
};

// 创建代理后的扩展了功能的代理实例
const Hero = getExtendedConstructor(Person, function(name, level) {
  this.level = level;
});

Hero.prototype.theme = '描边';

const yao = new Hero('曜', 1);

yao; // { name: "曜", level: 1 }，同时兼顾了源构造函数和扩展函数的功能
yao.theme; // "描边"，也能够正常访问构造函数的原型属性
```

## （七）Reflect

`Reflect` 意为反映、反射的意思。它同 `Proxy` 一样也是针对对象的：

* 将 `Object` 上属于语言内部的方法放到 `Reflect` 上，比如 `Object.defineProperty`，未来对象的语言内部方法都会部署到 `Reflect` 上；
* 修改某些 `Object` 方法的返回值，使其更加合理。比如 `Object.defineProperty` 无法定义属性时会抛错，而 `Reflect.defineProperty` 会返回 `false`，因而就可以进行 `if` 判断而无需 `try-catch`；
* 让 `Object` 相关操作都变成函数行为。比如 `key in obj` 和 `delete obj[key]` 都是指令式的，取而代之的是 `Reflect.has(obj, key)` 和 `Reflect.deletePRoperty(obj, key)`；
* `Reflect` 对象的方法与 `Proxy` 对象的方法一一对应，只要是 `Proxy` 对象的方法，就能在 `Reflect` 对象上找到对应的方法。这样无论怎么修改 `Proxy` 的代理操作，总能在 `Reflect` 上取到默认行为；

`Reflect` 一共有 13 个静态方法：

1. `Reflect.get(target, name, receiver)`
2. `Reflect.set(target, name, value, receiver)`
3. `Reflect.has(target, name)`
4. `Reflect.deleteProperty(target, name)`
5. `Reflect.ownKeys(target)`
6. `Reflect.getOwnPropertyDescriptor(target, name)`
7. `Reflect.defineProperty(target, name, desc)`
8. `Reflect.preventExtensions(target)`
9. `Reflect.getPrototypeOf(target)`
10. `Reflect.isExtensible(target)`
11. `Reflect.setPrototypeOf(target, prototype)`
12. `Reflect.apply(target, thisArg, args)`
13. `Reflect.construct(target, args)`

我故意将它们的顺序与上方列出的 `Proxy` 代理操作的顺序保持一致，而且也是 13 个，这说明 `Reflect` 的静态方法与 `Proxy` 的代理操作一一对应，并且大部分与 `Object` 的同名方法行为都是一致的。

详细的每个静态方法的使用可以参考 [Reflect | ECMAScript 6 入门](https://es6.ruanyifeng.com/#docs/reflect)，本文就不再赘述了。

## （八）小结

本文从介绍对象在浏览器内存中的存储开始，解释了很多对象相关的 JS 的奇葩现象。如果不理解对象的存储，那么我们在面对很多 JS 的不同数据类型的使用场景时会感到困惑。

接着深入对象的属性，介绍了数据属性和访问器属性，理解它们将会使我们站在更微观的视角来看待对象属性的操作。

再之后我们介绍了一些平时写业务不常用，但又常常出现在框架源码中的对象静态方法。

最后介绍了 `Proxy` 和 `Reflect` 这两块 ES 标准中与对象相关的比较新的扩展，`Proxy` 已在 Vue3 中作为底层被大量使用，而 `Reflect` 也是我们后面写对象静态方法可读性比较强的写法。

希望读者能有所感悟和收获，欢迎留言与我探讨:)
