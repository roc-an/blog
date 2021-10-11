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
