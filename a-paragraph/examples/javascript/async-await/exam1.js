// 题目 1
// async function fn() {
//   return 100;
// }

// (async function () {
//   const a = fn() // ?? Promise {<fulfilled>: 100}
//   const b = await fn() // ?? 100

//   console.log(a, b)
// })()

// // 调用一个 async 函数，总是得到 Promise 实例

// 题目 2
(async function() {
  console.log('start')
  const a = await 100
  console.log('a', a)
  const b = await Promise.resolve(200)
  console.log('b', b)
  const c = await Promise.reject(300)
  console.log('c', c)
  console.log('end')
})() // 执行完毕打印哪些内容？

// 答案：
// start
// a 100
// b 200
// 报错
