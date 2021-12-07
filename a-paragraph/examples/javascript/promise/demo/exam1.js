// 第 1 题
// 打印结果：1 -> 3，最终 return Fulfilled 状态的 Promise 实例
// Promise.resolve().then(() => {
//   console.log(1); // 触发
// }).catch(() => {
//   console.log(2); // 不触发
// }).then(() => {
//   console.log(3); // 触发
// })

// 第 2 题
// 打印结果：1 -> 2 -> 3，最终 return Fulfilled 状态的 Promise 实例
// Promise.resolve().then(() => {
//   console.log(1); // 触发
//   throw new Error('err')
// }).catch(() => {
//   console.log(2); // 触发
// }).then(() => {
//   console.log(3); // 触发
// })

// 第 3 题
// 打印结果：1 -> 2，最终 return Fulfilled 状态的 Promise 实例
Promise.resolve().then(() => {
  console.log(1); // 触发
  throw new Error('err')
}).catch(() => {
  console.log(2); // 触发
}).catch(() => {
  console.log(3); // 不触发
})
