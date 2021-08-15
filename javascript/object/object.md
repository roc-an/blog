# 深入理解 JavaScript 中的对象

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

### `Object.assign()`

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

### `Object.create()`

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
