# 深入理解 JavaScript 中的数字类型

> 发布于 2021.08.08，最后更新于 2021.09.13。

JS 中所有数字都是用 64 位双精度浮点数表示的。

虽然标准对 JS 数字定义得很清晰，但：

* 64 位是什么意思？
* 单精度、双精度是啥？
* 浮点数又是啥？

其实 JS 数字相关的很多奇怪现象，都离不开上面这些知识，但要搞懂它们，光 JS 的知识还不够。是时候掏出《计算机组成原理》来补补课了！

## （一）什么是 64 位双精度浮点数

### 数据以二进制形式存储

先来聊聊数据在计算机中是如何存储的。

**各种数据（数字、文本、程序、音乐、视频等）在计算机中都是以二进制形式存储的。**

为什么用二进制存而不用其他进制存？—— 便宜。

大规模制造二进制电路是比较便宜的，但要制造出能够存储和处理 10 个十进制数 0~9 的电路那就难了，这需要电路能可靠地区分出十个不同的电压等级。

另外，使用二进制形式也有其他优势：

* 技术上容易实现：因为二进制只需要 0 和 1 这两个数码来表示，所以任何具有两个不同稳定状态的原件（双稳态电路）都可以用来表示一个数的某一位。
* 可靠：只使用 0 和 1，传输和存储时不易出错；
* 运算规则简单：相比十进制数，二进制的运算规则简单得多，四则运算都可归结为加法和移位，由此，运算线路可以得到简化，从而提高运算速度

### 位和字节

**计算机存储、处理信息的最小单位是「位」（bit，也就是比特）。**

bit 是二进制数 Binary Digit 这个英文单词的缩写。一个比特的值是 0 或 1，没办法再把它拆分成更小的信息单位了。

**1 字节（Byte）= 8 位（bit）**

计算机通常不会只对 1 个二进制位操作，而是通常对一组二进制位操作。

计算机能同时处理的位数越多，它的速度就会越快。第一个微处理只能处理 4 位数字，而如今现代计算机已经基本上都是 64 位的了，一些显卡甚至可以处理 128 位或 256 位宽的数据。

只要有了多个二进制位，那么就可以来表示不同数据了，如图：

* 如果只有 1 位，那么二进制值只可能是 0 或 1 这 2 个值；
* 如果有 2 位，那么二进制值可以是 00、01、10、11 这 4 个值；
* 如果有 3 位，那么二进制值可以是 000、001、010、011、100、101、110、111 这 8 个值；
* ......
* 如果有 n 位，那么二进制值就可以有 2 的 n 次幂个不同值；

这在专业术语中叫做「位模式」。

所以这下就知道计算机为什么能表示茫茫多不同的数字了。因为不同数字的二进制表示，每个位都可以不同！

### 浮点数的存储

接下来讨论浮点数，浮点数是相对于整数而言的。比如，123.456 和 13/14 这两个数就是浮点数。

**浮点数，也就是实数，是所有有理数和无理数的集合。**

什么是有理数、无理数？

有理数可以表示为分数，比如 7/12。

而无理数不能表示为一个整数除以另一个整数的形式，如 π、根号 2 等。

一个浮点数值分两部分存储：「数值」以及「小数点在数值中的位置」，因为小数点在数中的位置不是固定的，所以这也就是为什么叫浮点数的原因了。

一些天文问题一般会用科学计数法来表示浮点数，比如 1.2345 * 10 的 20 次幂。

多年以来，计算机系统使用了很多不同的方法来表示浮点数，最终形成一致的标准是 IEEE 754 浮点数标准，该标准下，提供了 3 种浮点数表示：

* 32 位单精度浮点数；
* 64 位双精度浮点数；
* 128 位四精度浮点数；

**精度（Precision）用来衡量数据被表示得有多好**，比如，π 就无法用二进制或十进制数来精确表示，无论用多少位都不行。如果用 5 位十进制数来表示 π，那么精度就是 1/(10 的 5次幂)，如果用 20 位，那么精度就是 1/(10 的 20 次幂)。

双精度和单精度的主要区别就是用来表示数字的位数不同，单精度下一共需要 32 位二进制数，而双精度下需要 64 位。

那这 64 位具体在计算机中是如何存储的呢？双精度浮点数的存储如图：

`S` 是符号位，指明这个数是整数还是负数，若 S = 0，该数为负，若 S = 1，该数为正。

`E` 是指数位，表示将浮点数的尾数扩大或缩小 2 的 E 次方倍，并且它的偏置值是 1023。

`M` 是尾数位，64 位双精度浮点数存储时有 52 个有效尾数位，还有 1 个隐藏位。因为 IEEE 浮点数的尾数都是规格化的（后面示例中会看到如何规格化），其值在 1.0000...00 至 1.1111...11 之间（除非这个浮点数是 0，此时尾数为 0.0000...00）。由于尾数是规格化的，那么它的最高位总是 1，因此将尾数存入存储器时没必要保存最高位的 1，从而被隐藏。

#### 十进制浮点数转二进制后存储

举个例子，比如要将十进制浮点数 4.12 转为二进制并存储在计算机的 64 位中，那么：

第一步，先将 4.12 转为二进制数：

`4.12.toString(2); // "100.00011110101110000101000111101011100001010001111011"`

第二步，规格化。将小数点左移，直到尾数变为 1.xxx 的形式，每当小数点左移 1 位，指数就加 1，那么规格化后将得到：

1.0000011110101110000101000111101011100001010001111011 * 2^2

由此：

* 符号位 S 为 1，因为该数是正数；
* 指数位 E 为 2 + 1023 = 1025（这是十进制），转为二进制数就是：`(1025).toString(2); // "10000000001"`
* 尾数位 M 为 0000011110101110000101000111101011100001010001111011，这里省略了起始位 1

所以最终 4.12 这个十进制浮点数，在 64 位双精度浮点数表示法下，存储的各个位的情况是：

1100000000010000011110101110000101000111101011100001010001111011

需要了解的是，存储时位数越多，那么意味着数的表示范围越大，精度也就越高。

**所以，“JS 中所有数字都是用 64 位双精度浮点数表示的”这句话，告诉我们 JS 中的数字都是以 IEEE 754 的 64 位双精度标准来存储和处理的，这背后意味着有限的数表示范围，和有限的表示精准度。**

后文会重点讨论由于有限的表示范围和精准度带来的一些特殊现象。在这之前，还有一个重点话题，就是 JS 中如何表示一个数。

## （二）JS 中数的表示

### JS 表示浮点型直接量

除了一般的表示小数的写法（实数，比如 `1.01`，由整数部分、小数点、小数部分组成），JS 中还可以用“指数记数法”来表示浮点型直接量。

指数记数法，就是用实数乘以 10 的指数次幂：`[digits][.digits][(E|e)[(+|-)]digits]`

eg：

```js
3.11e23 // 3.11+23，也就是 3.11 * 10 的 23 次幂
7.85E-3 // 0.00785，也就是 7.85 * 10 的 -3 次幂
```

### JS 表示进制数

**二进制**：

计算机技术中广泛采用的进制，是仅用 0 和 1 表示的数，基数是 2，进位规则“逢二进一”

一个数字对象，可以通过 `toString()`（[`Number.prototype.toString()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toString)）方法转成二进制表示的字符串，eg：

```
(6).toString(2); // "110"
(7).toString(2); // "111"
```

其中，`toString([radix])` 方法传入的参数是用于转换的基数（2 到 36）。

ES6 支持以 `0b`（或 `0B`）开头来直接表示二进制数，eg：

```js
0b110 // 6
0b111 // 7
```

**八进制**:

八进制数以 8 为基数，ES6 要求以 `0o`（或 `0O`）开始，后跟随由 0~7 表示的数字序列，eg：

```js


0o377 // 255，相当于十进制中的 255
0o377.toString(2); // "11111111"
Number(0o377); // 255，Number() 可以将其他进制字符串转为十进制数
```

PS：ES5 时代八进制数是以 0 开始的（eg. `0377`），但严格模式下，八进制直接量是禁止使用以 0 开头的。所以如果要用八进制，还是乖乖用 ES6 `0o` 开头的写法为佳。

**十进制**：

平时业务编码最常用的，基数是 10（意味着每列可以使用 0-9）。

用 JS 表示十进制数，eg. `1000`

**十六进制**：

十六进制数以 16 为基数，JS 中十六进制数以 `0x` 或 `0X` 为前缀，数值由 0~9 和 a~f 构成，eg：

`0xff // 255，相当于十进制的 255，15 * 16 + 15 = 255`

同样，也可以通过 `toString()` 方法将十六进制数转成其他进制数的字符串表示：

```js
0xff.toString(2); // "11111111"
0xff.toString(8); // "377"
0xff.toString(10); // "255"
```

设置 CSS 颜色时就会用到十六进制数。

## （三）算术运算

### Math 提供的静态方法

通过 `Math` 对象提供的各种静态方法（函数的方法）可以进行较复杂的算术运算：

```js
Math.pow(2, 8); // 256，2 的 8 次幂
Math.round(0.5); // 1，四舍五入到最接近的整数，注意 0.5 会四舍五入到 1
Math.ceil(0.3); // 1，向上求整，即返回大于等于给定数的最小整数
Math.floor(0.9); // 0.9，向下求整，即返回小于等于给定数的最大整数
Math.abs(-10); // 10，求绝对值
Math.max(-10, 3, 108); // 108，求几个数中最大值
Math.min(-10, 3, 108); // -10，求几个数中最小值
Math.random(); // 0.005132670423310115，得到大于等于 0 小于 1 的伪随机数
Math.PI; // 3.141592653589793，圆周率
Math.E; // 2.718281828459045，自然对数的底数
Math.sqrt(4); // 2，求平方根
Math.pow(8, 1/3); // 2，求立方根
Math.sin(0); // 0，三角函数，还有 Math.cos()、Math.atan() 等
Math.log(10); // 2.302585092994046，10 的自然对数
Math.log(100)/Math.LN10; // 2，以 10 为底 100 的对数
Math.exp(3); // 20.085536923187668，e 的 3 次幂
```

上面有提到 `Math.random()` 得到的是“伪随机数”，什么是伪随机数？

伪随机数是用确定性的算法计算出来自 `[0,1]` 均匀分布的随机数序列。并不真正的随机。

所以，`Math.random()` 不能提供像密码一样安全的随机数字，如果要生成符合密码学要求的安全随机值，可以使用 Web Crypto API：[`window.crypto.getRandomValues()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Crypto/getRandomValues)

### 算术运算的一些特殊现象

#### 浮点数的四舍五入误差

先来看一个现象：

```js
0.1 + 0.2 === 0.3; // false
0.1 + 0.2; // 0.30000000000000004
0.3-0.2; // 0.09999999999999998
```

这是不是很坑？

浮点数，也就是实数，应该有无数多个。但是 64 位双精度浮点数的表示只能使用有限的位数，所以也只能表示有限个浮点数（18 437 736 874 454 810 627 个）。

这意味着，**JS 中的实数，本质上来讲只是真实值的一个近似表示而已。**

当然，几乎所有现代编程语言同 JS 一样，都是采用 IEEE 754 浮点表示法，这种二进制表示法无法精确表现十进制分数，所以绝大部分编程语言都有误差问题。

所以，在进行重要的金融相关计算时，一个小技巧是不要使用不准确的浮点数，而是使用整数。比如，1.03 元，可以换算成 103 分。

#### `Number.isInteger()` 也有测不到的数

`Number.isInteger()` 用来判断一个数是否为整数，如果传参不是一个数，会返回 `false`：

```js
Number.isInteger(1024); // true
Number.isInteger(1024.1); // false
Number.isInteger([1, 2]); // false
```

以上都还符合预期，但是：

```js
Number.isInteger(3.0000000000000002); // true
```

这是为啥？想必又是和 JS 中只能表示有限个浮点数有关。

的确，上面说到，64 位双精度浮点数的二进制存储，位数一共有 53 位（1 个隐藏位，52 个有效位），如果数值超过这个位数那么就无法被精确表示。

如果将 `3.0000000000000002` 这个浮点数转成二进制，那么会超过 53 位，导致最后的 `2` 被丢弃了。

所以在 JS 中，过于精确的数会被四舍五入：

```js
3.0000000000000002 === 3; // true
3.0000000000000002.toString(2); // "11"
```

#### 溢出（Overflow）

当运算结果超过了 JS 所能表示的数的上限，就会得到正无穷或者负无穷：

* 正无穷：Infinity
* 负无穷：-Infinity

这种现象就是溢出。正负无穷进行四则运算后得到的结果还是无穷：

```js
Infinity-10000; // Infinity
-Infinity * 2; // -Infinity
```

另外在 JS 中，一个正数或负数除以 0，也将得到正负无穷：

```js
17/0; // Infinity
-0.3/0; // -Infinity
```

零除以零没有意义，将会得到一个 `NaN`：

`0/0; // NaN`

JS 中使用 `isNaN()` 来检测一个变量是否是 `NaN`：

```js
NaN === NaN; // false
isNaN(0/0); // true
```

可以通过 `Number` 上的静态属性来访问正负无穷值：

```js
Number.POSITIVE_INFINITY; // Infinity
Number.NEGATIVE_INFINITY; // -Infinity
```

通过 `isFinite()` 可以判断传入的参数是否是有限的，如果传参不是 `NaN`、`Infinity` 或 `-Infinity` 便会得到 `true`：

`isFinite(0.11e22); // true`

#### 下溢（Underflow）

如果运算结果无限接近 0，比 JS 能表示的最小值还要小时，就是下溢，这时 JS 中会得到 0。

如果是一个无限小（接近于 0）的负数，那么会得到负零（`-0`）。

PS：JS 能表示的最大、最小值究竟是多少？

```js
Number.MAX_VALUE; // 最大值，1.7976931348623157e+308
Number.MIN_VALUE; // 最小值，5e-324
```

#### `toFixed()` 的舍入规则以及与 `toPrecision()` 的区别

如果遇到需求要保留一个数的小数点后固定位数，那么我们就会想到 `Number.prototype.toFixed()` 方法。

但是大部分前端人都认为 `toFixed()` 是四舍五入，但实际不是，不信请看下面的例子：

```js
0.14.toFixed(1); // "0.1"
0.15.toFixed(1); // "0.1"，这说明并不是简单的四舍五入
0.25.toFixed(1); // "0.3"，不是说不是四舍五入吗，这又怎么解释？
```

其实，`toFixed()` 方法的舍入规则遵守的是 IEEE 754 标准定义的**银行家舍入法**，这是专门用于 IEEE 754 浮点数取整的算法，大部分的编程语言都是遵循该算法来处理浮点数取证。

对于银行家舍入法：

1. 如果小数位 <= 4，那就舍去，如果 >= 6，那就进位；
2. 如果是 5，那么看它的下一位：
  * 如果 5 的下一位非 0，那就进位；
  * 如果 5 的下一位是 0，那还得看 5 的上一位的奇偶性：
    * 如果 5 的上一位是偶数，那就进位；
    * 如果 5 的上一位是奇数，那就舍去；

来看示例验证一下该算法（重点看小数位是 5 的情况）：

```js
0.15.toFixed(1); // "0.1"，因为 5 后为 0，那么看上一位奇偶性，5 的上一位 1 是奇数，所以舍去
0.25.toFixed(1); // "0.3"，因为 5 后为 0，那么看上一位奇偶性，5 的上一位 2 是偶数，所以进位
0.151.toFixed(1); // "0.2"，因为 5 后有非 0 数 1，所以进位。也就是只要 5 后有非 0 数，不管是几，都会进位
```

银行家舍入法跟四舍五入相比，在处理平均数方面更能保持原有数据的特性。

与 `toFixed()` 方法类似，还有一个 `Number.prototype.toPrecison()` 方法。

不同的是，`toPrecision()` 是处理精度，精度是从左至右第一个不为 0 数开始数起。而不是简单地保留小数点后多少位。示例：

```js
0.888.toFixed(2); // "0.89"，保留小数点后 2 位
0.888.toPrecision(2); // "0.89"，乍一看和 toFixed() 没什么区别

1.888.toFixed(2); // "1.89"
1.888.toPrecision(2); // "1.9"，这就有差别了，因为从左至右第一个不是 0 的数是 1，所以精度从 1 算起

0.1.toPrecision(2); // "0.10"，toPrecision() 还会补 0
0.1.toFixed(2); // "0.10"，toFixed() 一样也会补 0，这点两者没区别
```

## （四）数值扩展

### 数值分隔符

平时写数字时，如果数字很长，那么可以用逗号每 3 位进行分隔，比如 1024314159 可以写成 1,024,314,159。

[ES2021 规范](https://github.com/tc39/proposal-numeric-separator) 中允许使用下划线 `_` 作为分隔符来写数字字面量：

```js
const num = 1_024_314_159;
num === 1024314159; // true
```

当然，不一定非要每 3 位就使用分隔符，另外小数和科学计数法也支持分隔符：

```js
10_24 === 102_4; // true
0.01_024 === 0.01024; // true
1e10_0; // 1e+100
```

分隔符的写法使得我们在编码大数字时有更好的可读性。

### `Number.EPSILON` 是 JS 能表示的最小精度

`Number.EPSILON` 表示 1 与大于 1 的最小浮点数之间的差。

对于 64 位双精度浮点数，大于 1 的最小浮点数就相当于二进制下 1.000...001，小数点后 51 个 0，因为一共有 53 位嘛。

然后用这个值减去 1，那么就得到 0.000...001，也就是 2 的 - 52 次方（是 2 的而不是 10 的 -52 次方是因为这里说的是二进制数）。

由此：

```js
Number.EPSILON === Math.pow(2, -52); // true
```

这个 `Number.EPSILON` 其实就是 JS 表示浮点数的最小精度，如果误差小于 `Number.EPSILON`，那么在 JS 中可以认为没有误差。

### 安全整数

JS 64 位双精度浮点数存储时，尾数是 53（1 隐藏位 + 52 有效位），所以能表示的整数在 -2 的 53 次幂到 2 的 53 次幂之间（不包含这 2 个端点），超过这个值就无法精确表示了：

```js
Math.pow(2, 53); // 9007199254740992
Math.pow(2, 53) + 1 === Math.pow(2, 53); // true
```

ES6 引入了 `Number.MAX_SAFE_INTEGER` 和 `Number.MIN_SAFE_INTEGER` 来分别表示 JS 所能精确表示的整数上下限：

```js
Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1; // true
Number.MIN_SAFE_INTEGER === -Math.pow(2, 53) + 1; // true
```

在 `Number.MIN_SAFE_INTEGER` 和 `Number.MAX_SAFE_INTEGER` 之间的整数称为**安全整数**，可以通过 `Number.isSafeInteger()` 这个静态方法来判断一个值是否是安全整数：

```js
Number.isSafeInteger('abc'); // false
Number.isSafeInteger(-Infinity); // false
Number.isSafeInteger(Number.MAX_SAFE_INTEGER); // true
```

### BigInt 数据类型

由于 JS 的数字都是用 IEEE 754 的 64 位双精度浮点数表示的，所以仅有的 53 个二进制尾数位无法精确表示大整数。

这样就无法使用 JS 用于金融和科学领域的精确计算。

另外如果一个数大于等于 2 的 1024 次方，在 JS 中会变为无穷大 `Infinity`：

```js
// 超过 53 个二进制位的数值，无法保持精度
Math.pow(2, 53) === Math.pow(2, 53) + 1 // true

// 大于等于 2 的 1024 次方的数值，无法表示
Math.pow(2, 1023); // 8.98846567431158e+307
Math.pow(2, 1024); // Infinity
```

[ES2020](https://github.com/tc39/proposal-bigint) 引入了一种新的数据类型 `BigInt`（大整数），来解决这个问题，这是 ECMAScript 的**第八种数据类型**。

`BigInt` 只用来表示整数，没有位数的限制，任何位数的整数都可以精确表示。

为了与 `Number` 类型区别，`BigInt` 类型的数据必须添加后缀 `n`：

```js
const a = 2172141653n;
const b = 15346349309n;

// BigInt 可以保持精度
a * b // 33334444555566667777n

// 普通整数无法保持精度
Number(a) * Number(b) // 33334444555566670000

// 可以使用 typeof 进行类型检测
typeof(a); // "bigint"
```

通过原生提供的 `BigInt()` 函数（注意，`BigInt` 并不是构造函数）可以将整数转为 BigInt 类型：

```js
BigInt(100); // 100n

// 传入其他无法转为数字类型的参数或者传小数都将报错
BigInt('100'); // 100n，能正常转换，因为 '100' 可以转成数字
BigInt(null); // Uncaught TypeError: Cannot convert null to a BigInt
BigInt(100.01); // Uncaught RangeError: The number 100.01 cannot be converted to a BigInt because it is not an integer
```

`BigInt` 数无法直接与普通数字进行运算：

```js
3n + 1; // Uncaught TypeError: Cannot mix BigInt and other types, use explicit conversions
3n + 1n; // 4n，大整数只能与大整数进行运算
```

## （五）总结

我们较深入地探讨了 JS 中数字类型相关的一些基础知识，甚至过程中还涉及到了数的存储结构这种计算机组成原理相关的知识。

这对于我们理解 JS 数字相关的一些表现很有帮助，另外，也可以站在更底层的角度来思考编程语言的一些局限性，以及语言标准进步的方向。

在进行科学计算或是金融数字相关的研发时，需要注意到浮点数导致的误差。这也侧面在提醒我们在进行日常编码时要注重严谨性。

希望看到这篇文章的朋友能够有所思考和感悟。
