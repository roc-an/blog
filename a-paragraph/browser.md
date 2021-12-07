# 一段话说透一个前端知识点 - 浏览器

## 请描述 Event Loop（事件循环/事件轮询）的机制，可画图

* JS 是单线程运行的
* 异步要基于回调来实现
* Event Loop 就是异步回调的实现原理

JS 如何执行？

* 从前到后，一行行执行
* 如果某一行执行报错，则停止下面代码的执行
* 先把同步代码执行完，再执行异步

JS 引擎中和事件循环有关的一些模块：

* Call Stack，调用栈：用于执行函数代码
* Web APIs：用于完成浏览器提供的一些 API，如 `setTimeout` 的执行
* Event Loop，事件循环
* Callback Queue，回调函数的队列

### 一个简单的 Event Loop 示例

```js
// 1. 将 console.log('Hi') 推入 Call Stack 调用栈
// 2. 执行，控制台打印 'Hi'
console.log('Hi')
// 3. 执行完毕后，清空 Call Stack 调用栈

// 4. setTimeout cb1 推入 Call Stack 调用栈
// 5. 将 cb1 存入 setTimeout 对应的 timer 定时器中，并将 timer 定时器存入 Web APIs 中，进行计时 5 秒
// 6. Call Stack 调用栈的 setTimeout 逻辑执行完毕，清空调用栈
setTimeout(function cb1() {
  console.log('cb1')
}, 5000)

// 7. 将 console.log('Bye') 推入 Call Stack 调用栈
// 8. 执行，控制台打印 'Bye'
// 9. 执行完毕后，清空 Call Stack 调用栈
console.log('Bye')

// 10. 一旦所有同步代码执行完，即 Call Stack 调用栈空了，将启用 Event Loop 机制
// 11. Event Loop 会一遍遍进行循环，从 Callback Queue 回调队列中找是否有回调需要去执行。
//   如果有，就把回调取出来，推入 Call Stack 调用栈去执行

// 12. 5 秒后，定时器 timer 会将 cb1 推入 Callback Queue 回调队列中
// 13. 这时候 Event Loop 循环会发现 Callback Queue 中有 cb1 回调，于是取出 cb1 并推入 Call Stack 调用栈中
// 14. 执行 cb1，其函数体中的 console.log('cb1') 也会推入 Call Stack 调用栈中
//   （此刻，Call Stack 调用栈有 cb1 和 cb1 函数体的 console.log('cb1')）
// 15. 执行 console.log('cb1')，控制台打印 'cb1'，因为栈是先入后出
// 16. cb1 也执行完毕（因为其函数体就 1 行代码）
// 17. 清空 Call Stack 调用栈
```

Event Loop 过程小结：

* 同步代码，一行一行推入 Call Stack 调用栈去执行
* 遇到异步，会“记录”下，等待合适的执行时机（定时、网络请求等）
* 一旦时机到了，回调就会推入 Callback Queue 回调队列中
* 一旦同步代码执行完，即 Call Stack 调用栈为空，Event Loop 开始工作
* Event Loop 轮询查找 Callback Queue 回调队列，如果有回调，则取出并推入 Call Stack 调用栈去执行
* 然后继续查找（就像永动机一样）

### DOM 事件和 Event Loop 的关系

如下代码：

```html
<button id="btn">提交</button>

<script>
console.log('Hi')

// 代码执行至此，将 click 的回调存储在 Web APIs 模块中
// 当用户点击后，回调从 Web APIs 模块推入 Callback Queue 回调队列中
// 然后基于 Event Loop 的机制从 Callback Queue 回调队列中轮询到回调，并推入 Call Stack 调用栈去执行
document.querySelector('#btn').addEventListener('click', function(e) {
  console.log('Button clicked')
})

console.log('Bye')
</script>
```

由此可见：

* 因为 JS 是单线程的
* 所以，异步（`setTimeout`、AJAX 等）使用回调，基于 Event Loop
* 并且，DOM 事件也使用回调，基于 Event Loop（但不能说 DOM 事件是异步的，只能说 DOM 事件和异步回调都是基于 Event Loop）

## 什么是宏任务、微任务，两者有什么区别？

## Promise 有哪三种状态，如何变化？

三种状态：

* Pending
* Fulfilled
* Rejected

状态变化只能是：

* Pending -> Fulfilled
* Pending -> Rejected

并且状态变化「不可逆」

状态的表现：

* Pending 状态，不会触发 `.then()` 和 `.catch()`
* 若变为 Fulfilled 状态，会触发 `.then()` 回调的执行
* 若变为 Rejected 状态，会触发 `.catch()` 回调的执行

### `.then()` 和 `.catch()` 对于状态的改变

* `.then()` 中：
  * 正常执行会返回 Fulfilled 状态的 Promise 实例
  * 如果里面有报错，会返回 Rejected 状态的 Promise 实例
* `.catch()` 中：
  * 正常执行会返回 Fulfilled 状态的 Promise 实例
  * 如果里面有报错，会返回 Rejected 状态的 Promise 实例

或者可以这么说：

**不管是 `.then()` 或是 `.catch()`，只要里面正常执行，`return` 的就是 Fulfilled 状态的 Promise 实例，只要里面有报错，`return` 的就是 Rejected 状态的 Promise 实例**
