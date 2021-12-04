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

## 如何实现圣杯布局和双飞翼布局？

## 手写 clearfix

## flex 实现一个三点的骰子

## offsetWith

`HTMLElement.offsetWith` 是一个只读属性，它是元素的「布局宽度」，测量内容包含：

* `border`
* `padding`
* CSS 设置宽度 `width`
* 滚动条宽度
