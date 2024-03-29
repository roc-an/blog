# 一段话说透一个前端知识点 - CSS

## `margin` 纵向层叠问题

* 相邻元素的 `margin-top` 和 `margin-bottom` 会发生重叠
* 空内容标签（比如 `<p></p>`）也会重叠，注意是重叠而不是忽略

示例，CSS：

```css
p {
  margin-top: 10px;
  margin-bottom: 15px;
  font-size: 16px;
  line-height: 1;
}
```

HTML：

```html
<body>
  <!-- Q: AAA 和 BBB 之间的距离是多少 px？ -->
  <p>AAA</p>
  <p></p>
  <p></p>
  <p></p>
  <p>BBB</p>
</body>
```

答案：15px

## `margin` 负值问题

对 `margin` 的 `top`、`right`、`bottom`、`left` 设置负值，有何效果？

* `margin-top` 和 `margin-left` 设为负值，元素会分别向上、向左移动
* `margin-right` 设为负值，右侧元素左移，自身不受影响
* `margin-bottom` 设为负值，下方元素上移，自身不受影响

## 谈谈对于 BFC 的理解？

BFC，Block Format Context，块级格式化上下文，它是一块**独立的渲染区域，内部元素的渲染不会影响边界以外元素**。

形成 BFC 的常见条件：

* `float` 不是 `none`
* `position` 是 `absolute` 或 `fixed`
* `overflow` 不是 `visible`
* `display` 是 `flex`、`inline-block` 等

BFC 的常见应用：清除浮动

## 如何实现圣杯布局和双飞翼布局？

圣杯布局和双飞翼布局的目的：

* 三栏布局，中间一栏最先加载和渲染
* 两侧宽度固定，中间内容随着宽度自适应
* 一般用于 PC 布局

圣杯布局和双飞翼布局的技术总结：

* 使用 `float` 布局
* 两侧使用 `margin` 负值，以便和中间内容横向重叠
* 防止中间内容被两侧覆盖，一个用 `padding`，一个用 `margin`：
  * 圣杯布局用 `padding` 为两侧留白
  * 双飞翼布局用（较简单） `margin` 为两侧留白

## 手写 `.clearfix`

```css
.clearfix:after {
  content: '';
  display: table;
  clear: both;
}
.clearfix {
  *zoom: 1; /* 兼容 ID 低版本 */
}
```

## flex 实现一个三点的骰子

## offsetWith

`HTMLElement.offsetWith` 是一个只读属性，它是元素的「布局宽度」，测量内容包含：

* `border`
* `padding`
* CSS 设置宽度 `width`
* 滚动条宽度
