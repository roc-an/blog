// 声明函数，并不会立即执行
async function async1() {
  console.log('async1 start') // Step 2：虽然 async1 是异步函数，但还是要立即执行其中的代码
  // 先执行 async2()，再执行 await 的操作
  await async2()
  // await 表达式后面的内容，都可以看做是 Callback 里的内容，即异步逻辑
  // 所以执行 await 后，要把其后的内容放入 Callback 中，去等待 EventLoop 轮询去执行
  console.log('async1 end') // Step 5：Event Loop 轮询到回调，去执行
}

// 声明函数，并不会立即执行
async function async2() {
  console.log('async2') // Step 3：虽然 async2 是异步函数，但还是要立即执行其中的代码
}

console.log('script start') // Step 1
async1()
console.log('script end') // Step 4

// Step 4 之后，同步代码都已执行完，开始 Event Loop，轮询回调队列

// 打印顺序：
// script start
// async1 start
// async2
// script end
// async1 end
