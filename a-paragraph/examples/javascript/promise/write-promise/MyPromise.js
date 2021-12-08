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
    // 判断传参是否是函数
    fulfilledCb = typeof fulfilledCb === 'function' ? fulfilledCb : (v) => v;
    rejectedCb = typeof rejectedCb === 'function' ? rejectedCb : (err) => err;

    // 如果在执行 .then() 时状态已经是 fulfilled 了，那么立即执行 fulfilledCb
    if (this.state === 'fulfilled') {
      return new MyPromise((resolve, reject) => {
        try {
          const res = fulfilledCb(this.value);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    }

    // 如果在执行 .then() 时状态已经是 rejected 了，那么立即执行 rejectedCb
    if (this.state === 'rejected') {
      return new MyPromise((resolve, reject) => {
        try {
          const res = rejectedCb(this.reason);
          reject(res);
        } catch (err) {
          reject(err);
        }
      });
    }

    // 如果在执行 .then() 时状态是 pending，fulfilledCb 和 rejectedCb 会存储到对应的 callbacks 队列中
    if (this.state === 'pending') {
      return new MyPromise((resolve, reject) => {
        // 推入成功回调队列，当前 Promise 实例状态变为 fulfilled 时触发执行，执行后改变 return 的新 Promise 实例状态
        this.fulfilledCallbacks.push(() => {
          try {
            const res = fulfilledCb(this.value);
            resolve(res);
          } catch (err) {
            reject(err);
          }
        })

        // 推入失败回调队列
        this.rejectedCallbacks.push(() => {
          try {
            const res = rejectedCb(this.reason);
            reject(res);
          } catch (err) {
            reject(err);
          }
        })
      });
    }
  }

  // .catch() 本质上就是 .then() 的语法糖
  catch(rejectedCb) {
    return this.then(null, rejectedCb)
  }
}
