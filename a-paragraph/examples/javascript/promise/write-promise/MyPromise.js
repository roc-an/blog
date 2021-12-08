/**
 * @description MyPromise
 */
class MyPromise {
  state = 'pending'; // 状态，还有 'fulfilled' 和 'rejected'
  value = undefined; // 该 Promise 实例状态变为 fulfilled 后携带的值
  reason = undefined; // 该 Promise 实例状态变为 rejected 后携带的值

  fulfilledCallbacks = []; // pending 状态下，存储成功的回调
  rejectedCallbacks = []; // pending 状态下，存储失败的回调

  constructor(fn) {
    const resolveHandler = (value) => {
      if (this.state === 'pending') {
        // 该状态、设置值、遍历成功回调队列依次执行
        this.state = 'fulfilled'
        this.value = value;
        // 遍历成功回调队列去依次执行
        this.fulfilledCallbacks.forEach(fn => fn(this.value));
      }
    }
    const rejectHandler = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        // 遍历失败回调队列去依次执行
        this.rejectedCallbacks.forEach(fn => fn(this.reason));
      }
    }

    try {
      fn(resolveHandler, rejectHandler);
    } catch(err) {
      rejectHandler(err)
    }
  }

  // 原型方法
  // 执行 .then() 时，Promise 实例的状态可能是 pending、fulfilled 或 rejected
  then(fulfilledCb, rejectedCb) {
    // 当 pending 状态下，fulfilledCb 和 rejectedCb 会存储到对应的 callbacks 队列中
  }
}
