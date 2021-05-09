# 宏任务与微任务

## （一）消息队列与事件循环机制

在浏览器多进程架构中，渲染进程是专门用来将 HTML/CSS/JS 解析、渲染成页面的。排版引擎 Blink 和 V8 引擎都运行在渲染进程中：

![浏览器多进程架构](https://user-images.githubusercontent.com/79783808/117564223-abb5a000-b0dd-11eb-8ce1-67cd70d93bb1.png)

渲染进程负责调度相关线程来完成渲染任务。
