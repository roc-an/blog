function multi(num) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num * num)
    }, 1000)
  })
}

const arr = [1, 2, 3]

// 1 秒钟后，1、4、9 同时打印出来
// 因为 forEach 的遍历是同步的，一瞬间将 arr 遍历完
// arr.forEach(async (num) => {
//   const res = await multi(num)
//   console.log(res);
// })

// 1 秒钟后，打印 1，再过 1 秒，打印 4，再过 1 秒，打印 9
// 因为 for...of 是一次次地去遍历
!(async function() {
  for (let num of arr) {
    const res = await multi(num);
    console.log(res)
  }
})()
