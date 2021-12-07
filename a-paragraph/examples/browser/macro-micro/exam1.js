console.log(100);
setTimeout(() => {
  // 宏任务
  console.log(200);
})
setTimeout(() => {
  console.log(201);
})
Promise.resolve().then(() => {
  // 微任务
  console.log(300)
})
console.log(400)

// 打印顺序：100 -> 400 -> 300 -> 200 -> 201
