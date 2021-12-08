async function async1() {
  console.log('async1 start')
  await async2()
  // 后面是微任务 1
  console.log('async1 end')
}
async function async2() {
  console.log('async2')
}
console.log('script start')

setTimeout(function() {
  // 宏任务
  console.log('setTimeout')
}, 0)

async1()

new Promise(function(resolve) {
  console.log('promise1')
  resolve()
}).then(function() {
  // 微任务 2
  console.log('promise2')
})

console.log('script end')

// 打印顺序：
// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout
