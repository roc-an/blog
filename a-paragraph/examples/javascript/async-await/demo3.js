async function async1() {
  console.log('async1 start')
  await async2()

  // 下面 3 行都是异步回调内容
  console.log('async1 end')
  await async3()

  // 下面 1 行是上面异步回调中，异步回调的内容
  console.log('async1 end 2')
}

async function async2() {
  console.log('async2')
}

async function async3() {
  console.log('async3')
}

console.log('script start')
async1()
console.log('script end')

// 打印结果
// script start
// async1 start
// async2
// script end
// async1 end
// async3
// async1 end 2
