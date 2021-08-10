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

## （一）引子

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

看来 JS 中的对象远没有只是简单定义一些标识符到值得映射这么简单，本文将会带着大家逐渐揭开 JS 对象背后的神秘面纱。

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

TODO：引用数据类型数据的属性，依然可以被修改

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

## TODO List

- [ ] `Object.defineProperty()` 实现数据双向绑定
