// 直接得到一个 Fulfilled 状态的 Promise 实例
const p1 = Promise.resolve(100);
p1
  .then(data => {
    console.log('p1 data1', data); // 会触发，打印 100
  })
  .catch(err => {
    console.log('p1 err1', err); // 不会触发
  })

console.log('p1', p1) // Promise {<fulfilled>: 100}

// 直接得到一个 Rejected 状态的 Promise 实例
const p2 = Promise.reject('Err');
p2
  .then(data => {
    console.log('p2 data2', data); // 不会触发
  })
  .catch(err => {
    console.log('p2 err2', err); // 会触发，打印 'Err'
  })

console.log('p2', p2) // Promise {<rejected>: 'Err'}
