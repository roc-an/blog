// Tips 1：async 函数执行后，得到 Promise 实例
// async function fn1() {
//   // async 函数会将返回值封装成一个 Promise 实例去 return
//   // 相当于：return Promise.resolve(100)
//   return 100
// }
// const res1 = fn1()
// console.log('res1', res1); // 得到一个 Fulfilled 的 Promise 实例
// res1.then((data) => {
//   console.log('res1 data', data); // 100
// })

// Tips 2：await 相当于 .then()
// !(async function() {
//   const p1 = Promise.resolve(300);
//   const data = await p1; // await 相当于 .then()
//   console.log('data', data)
// })()

// Tips 3：如果 await 后跟的是一个值，那么相当于 await Promise.resolve(值)
// !(async function() {
//   const data = await 400;
//   console.log('data', data)
// })()

// !(async function() {
//   const data = await fn1()
//   console.log(data); // 100
// })()

// Tips 4：try...catch 相当于 .catch()
!(async function() {
  const p2 = Promise.reject('err')
  try {
    const res = await p2 // await 相当于 .then()
    console.log(res) // 不会打印，因为 p2 是 Rejected 状态，就会走 catch 逻辑
  } catch (ex) {
    console.log('ex', ex)
  }
})()
