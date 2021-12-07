// const p1 = Promise.resolve().then(() => {
//   // 正常执行，return Fulfilled 状态的 Promise 实例，触发后续的 .then() 回调
//   return 100;
// })

// const p2 = Promise.resolve().then(() => {
//   // 抛错，return Rejected 状态的 Promise 实例，触发后续的 .catch() 回调
//   throw new Error('.then() 中出错')
// })

// p2.then(() => {
//   console.log('不会触发')
// }).catch((err) => {
//   console.log('会触发，p2 err', err)
// })

const p3 = Promise.reject('p3 err').catch(err => {
  console.log('p3 err', err); // 注意，这里 .catch() return 的是 Fulfilled 状态的 Promise 实例
})

p3.then(() => {
  console.log(100); // 会触发
}).catch((err) => {
  console.log(err); // 不会触发
})

const p4 = Promise.reject('p4 err').catch(err => {
  throw new Error('p4 catch err'); // 注意，这里 .catch() 中抛错，会 return Rejected 状态的 Promise 实例
})
p4.then(() => {
  console.log(100); // 不会触发
}).catch((err) => {
  console.log(err); // 会触发，由于没报错，最终 return 的是 Fulfilled 状态的 Promise 实例
})
