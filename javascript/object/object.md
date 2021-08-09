# 深入理解 JavaScript 中的对象

## （一）引子

ECMAScript 中定义，对象其实就是一组属性的无序集合。对象的属性和方法都由一个个标识符来标识，每个标识符映射到一个值。

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
  configurable: true,
  enumerable: true,
  value: 1,
  writable: true
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

* `[[Writable]]`
* `[[Configurable]]`
* `[[Enumerable]]`
* `[[Value]]`

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
