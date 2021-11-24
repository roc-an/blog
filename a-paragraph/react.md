# 一段话说透一个前端知识点 - React 技术栈

## Scheduler 调度模块的原理是什么？

`Scheduler` 将**回调任务分为了两类，「及时回调」和「延时回调」**：

* 及时回调是通过创建 [`MessageChannel`](https://developer.mozilla.org/zh-CN/docs/Web/API/MessageChannel) 实例，然后 `postMessage()` 收发消息进行的，每当收到消息（`onmessage`）便执行回调。这属于“宏任务”，所以 `Scheduler` 的回调都是异步执行的
* 延时回调通过 `setTimeout` 和 `clearTimeout` 延时调用和清除延时调用

`Scheduler` 中**记录时间使用的是 [`performance.now()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/now)**，相比于 `Date.now()`，它得到的时间戳精度能达到微秒级，而且不受系统时间的干扰

`Scheduler` 还实现了「时间切片」，见下一话题

## 什么是“时间切片”？

浏览器的 JS 线程和 GUI 线程互斥，在执行 JS 时没有办法进行布局、绘制，如果执行 JS 过久，会阻塞页面每一帧的渲染，导致卡顿

`Scheduler` 模块引入了「时间切片（Time Slice）」思想解决此问题，主要思路是**在每一帧中给 JS 的执行留一些时间（5ms）**，超过该时间就将控制权让出给主线程去做其他更高优先级的事情，比如绘制、用户输入、处理请求等。等到了下一帧，再继续执行之前中断的任务。

这种**将长任务拆分到每一帧的小任务中去执行而不阻塞 UI 渲染的思想，就是时间切片**。它的关键是**将同步更新变为可中断的异步更新**

在具体实现中还做了**优化**，实际上并不会一到 5ms 就让出控制权给主线程

`Scheduler` 将任务执行时间划分为 4 档：

* < 5ms：不让出；
* 5ms ~ 50ms（不含 50ms）：如果正在进行非连续的用户输入（如鼠标点击）就让出，对于非连续输入（如鼠标指针移动）这种情况可接受，不让出；
* 50ms ~ 300ms（不含 300ms）：只要有用户输入，不管是否连续，都让出；
* > 300ms：让出。因为任务已经执行够久了，可能有其他未知的任务比如网络请求处理需要主线程去做，所以让出。

通过这种优化，避免了频繁让出，可以让浏览器更智能地判断它当前应该处理的事