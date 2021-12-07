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
