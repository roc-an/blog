# 一段话说透一个前端知识点 - 性能优化

## 前端性能优化方式

**性能优化原则**：

* 多使用内存、缓存或其他方法
* 减少 CPU 计算量，减少网络加载耗时
* 适用于所有编程的方案——空间换时间

**让加载更快**：

* 减少资源体积：代码压缩。
  * Webpack Mode 设为 `production`，压缩前端脚本
  * 网络传输 Gzip 压缩，一般能将体积压缩到 1/3 左右
* 减少 HTTP 访问次数：
  * 合并代码
  * SSR 服务端渲染：
    * SSR：服务器端连同数据和页面一并返回给前端
    * 非 SSR：加载网页 -> 加载数据 -> 渲染数据
  * 利用缓存：
    * 为静态资源文件名加 Hash 后缀，根据文件内容计算 Hash
    * 文件内容不变，则 Hash 不变，请求的 URL 不变
    * 触发 HTTP 缓存机制，返回 304
* 使用更快的网络：CDN，根据区域区分 IP，访问得更快

**让渲染更快**：

* CSS 放在 `<head>` 中，JS 放在 `<body>` 中的最后面
* 尽早开始执行 JS，用 `DOMContentLoaded` 触发
* 懒加载（图片懒加载，下滑加载更多）
* 对 DOM 查询进行缓存
* 涉及频繁操作 DOM 的场景，将它们合并到一起插入 DOM 结构

**让渲染更加流畅**：

* 节流 Throttle / 防抖 Debounce，体验性的优化

### 图片懒加载

步骤：

1. 先给图片一个用于预览的、体积很小的 URL，将真正的 URL 通过自定义属性 `data-*` 设置
2. 当合适的时机，比如用户滑动到图片，图片出现在屏幕上时，再以真正的 URL 加载、显示图片

示例代码：

```html
<img id="img1" src="preview.png" data-realsrc="abc.png" />
<script type="text/javascript">
  const img1 = document.getElementById('img1');
  img1.src = img1.getAttribute('data-realsrc');
</script>
```
