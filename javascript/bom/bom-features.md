# 异彩纷呈的 BOM

## （一）BOM 究竟是什么

相比于 BOM，DOM（Document Object Model）文档对象模型更加广为人知。

BOM 的“OM”和 DOM 的“OM”一致，都是 Object Model 对象模型的意思。

**BOM（Browser Object Model），浏览器对象模型**，意思是 JS 中提供了诸多操作浏览器的 API，这些 API 被归类为 BOM API。

BOM 在语言层面上，属于 JS 的三大组成部分之一：

* ECMAScript
* DOM API
* BOM API

随着 BOM 相关规范的发展，如今使用 BOM API 能够实现的功能越来越多，也越来越有趣。

BOM 的核心是 `window` 对象，表示浏览器的实例。`window` 对象有两重身份：

1. 作为 ECMAScript 的 `Global` 对象，所有全局变量、函数都可以在它上面访问；
2. 提供浏览器窗口面向 JS 的 API；

利用 BOM API 可以实现很多关键而有趣的功能，比如地理定位、截图、自定制的复制粘贴等等。

这篇文章会以 BOM API 实际使用场景的角度来一一讨论这些实用功能的实现原理，相信阅读实践后，你会对 BOM 有一个全面而深层次的理解。

## （二）`window.location` 小 Tips

### `location.assign()`

曾几何时，写了一个简简单单的 `location.href = https://xxxxxx.com/`，它就能跳转了。

可是写完后你没发现这有些别扭吗？要跳转到某个页面，使用一个方法而不是修改 `href` 属性岂不是更好？

于是后续 HTML5 规范就更新了一个方法，[`location.assign()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/assign)，使用它可以进行页面跳转。比如：

`window.location.assign('https://github.com/roc-an');`

**使用 `location.assign()` 让页面跳转这种行为以对象方法的方式调用，这在可读性上就更加合理了**。

但我曾经还有个疑问——“为什么修改了 `location` 的 `href` 属性，就能跳转了呢？”

这是因为 **`href` 属性有 getter 和 setter**

如果在控制台打印 `Object.getOwnPropertyDescriptor(location, 'href')`，就可以看到：

```js
Object.getOwnPropertyDescriptor(location, 'href');
// {enumerable: true, configurable: false, get: ƒ, set: ƒ}
```

> PS：[Object.getOwnPropertyDescriptor(obj, prop)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) 可以拿到对象属性的属性描述符，如果对这块不熟悉，也可以看我的另一篇文章 [《深入理解 JavaScript 中的对象》](https://github.com/roc-an/blog/issues/6)。

可以看到，`href` 属性是有 getter 和 setter 函数的。

然后我就翻了翻 H5 的 `location.href` 标准，我把 setter 部分的标准列出来：

> The `href` attribute's setter must run these steps:
>
> 1. If this Location object's relevant Document is null, then return.
> 2. Parse the given value relative to the entry settings object. If that failed, throw a TypeError exception
> 3. Location-object navigate given the resulting URL record
>
> Note: The href attribute setter intentionally has no security check.

从标准可以看到，使用 `location.href` 跳转时，是不会进行安全性检查的。

但是 **`location.assign()` 会进行安全检查**，如果因为安全原因跳转失败，会抛出一个 `SECURITY_ERROR` 类型的异常。这是 `location.assign()` 优于 `location.href` 的地方。

下面是 H5 标准中 `location.assign()` 部分，可以看到步骤中明确进行了跨域检测：

> When the `assign(url)` method is invoked, the user agent must run the following steps:
>
> 1. If this Location object's relevant Document is null, then return.
> 2. If this Location object's relevant Document's origin is not same origin-domain with the entry settings object's origin, then throw a "SecurityError" DOMException.
> 3. Parse url relative to the entry settings object. If that failed, throw a "SyntaxError" DOMException.
> 4. Location-object navigate given the resulting URL record.

## （三）`navigator.userAgent` 浏览器用户代理信息

如果你想知道访问自己网站的用户都是使用的什么品牌的浏览器，操作系统又是怎样的，那就要用到 `navigator.userAgent` 了。

只要浏览器启用了 JavaScript，那就一定存在 [`window.navigator`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator) 对象。这个对象上有很多关于浏览器信息的属性，不同浏览器的实现也各不相同，但是所有浏览器都实现了 `navigator.userAgent` 字段。

我在自己的 MacPro Chrome 浏览器控制台打印 `navigator.userAgent` 会得到：

```js
'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36'
```

这是浏览器的用户代理字符串。**用户代理字符串出现在每个 HTTP 请求头中，在 JS 中可以通过 `navigator.userAgent` 访问**。

* 在服务器端，常见做法是根据收到的用户代理字符串确定浏览器并执行相应操作；
* 在客户端，用户代理检测是不可靠的，只有在没有其他检测办法时再使用。

为什么说这种方式检测浏览器不可靠呢？因为浏览器可以通过携带错误或有误导性信息的 `userAgent` 来欺骗服务器。

### 微软曾利用 `userAgent` 成功让 IE 上位

这一行为是有真实历史依据的。

在 1996 年，Netscape Navigator 3 是当时最受欢迎的浏览器。运行在 Windows 95 上的该浏览器的 `userAgent` 是这样的：

```js
'Mozilla/3.0 (Win95; U)'
```

在 Netscape Navigator 3 发布后不久，微软首次对外发布了 IE3。但是当时 Netscape Navigator 3 市场占有率最高，很多网站服务器都特意检测了 `userAgent`，所以很多网站用 IE3 根本打不开。

再这么下去 IE3 就得垮掉，于是“机智的”微软将 IE3 的 `userAgent` 改成了这种格式：

```js
Mozilla/2.0 (compatible; MSIE Version; Operating System)
```

在 Windows 95 上一个 IE3.02 浏览器的 `userAgent` 是这样的：

```js
'Mozilla/2.0 (compatible; MSIE 3.02; Windows 95)'
```

当时大多数检测用户代理的程序只判断了产品名称是不是 `Mozilla`，就这样，IE 浏览器成功伪装成了最火的 Netscape Navigator 3（PS：至于为啥 IE 用的版本号是 `2.0` 而不是最火的 `3.0` 已经无法考究，可能是因为一时疏忽，也可能是因为比较怂~）。

微软当时的这一做法饱受争议，但它确实就这么发生了...这也说明了单纯靠 `userAgent` 信息来区分浏览器是不可靠的。类似地，在 2003 年苹果首次发布 Safari（WebKit 内核）时也这么干过。

当然也有非常头铁的浏览器，比如 Opera，曾经的 Opera 是唯一一个坚持使用产品名称和版本完全标识自身的主流浏览器。比如 `userAgent` 是这样：

```js
Opera/8.0 (Windows NT 5.1; U; en)
```

这种做法受到了一些开发者赞赏。然而为什么说是“曾经”呢，因为自 Opera 9 以后，它不要贞操了，又将自己改成了 `Mozilla/5.0` 开头，甚至还有更骚的——根据访问网站的不同，设置不同的 `userAgent` 来伪装成其他主流浏览器还不通知用户 :)

IOS 和 Android 手机的系统自带浏览器都是基于 WebKit 的，所以它们的 `userAgent` 也有 `Mozilla/5.0`。

随着各个浏览器的发展，为了让所有旧网站都能用自家浏览器打开，于是现在你会发现，只要你的浏览器是基于 WebKit 的，那么你的 `userAgent` 一定会包含 `Mozilla/5.0`...

### 识别 `userAgent` 的库 `ua-device`

百度团队有个库 [`ua-device`](https://github.com/fex-team/ua-device)，它会爬取大量的浏览器信息，然后根据提供的 `userAgent` 来判断出是哪种浏览器。

我试用了下，nodeJS 文件是这样的（完整项目文件在 [ua-device-test](https://github.com/roc-an/blog/tree/main/javascript/bom/ua-device-test）：

```js
const UA = require('ua-device');
const input = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36'

const output = new UA(input);
console.log(output);
```

执行后得到的输出结果：

```js
{
  options: { useFeatures: false, detectCamouflage: true },
  // 浏览器信息
  browser: {
    stock: false,
    hidden: false,
    channel: 'Nightly',
    name: 'Chrome',
    version: { original: '94.0.4606.71', alias: null }
  },
  // 浏览器内核
  engine: { name: 'Webkit', version: { original: '537.36', alias: null } },
  // 操作系统
  os: {
    name: 'Mac OS X',
    version: { alias: '10.15.7', original: '10.15.7' }
  },
  // 硬件信息
  device: { type: 'desktop', identified: false },
  camouflage: false,
  features: []
}
```

检查了下，信息是正确吻合的。

对于咱们目前的国内市场，PC 浏览器还好，移动浏览器及其背后的设备可谓五花八门，利用这个库来判断手机型号还算准确（PS：看最后更新时间已经几年以前了，现在不知道还是否准确度高）。
