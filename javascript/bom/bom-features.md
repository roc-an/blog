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
