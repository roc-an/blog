# 一段话说透一个前端知识点 - JavaScript

## 实现深拷贝函数

```js
const toString = Object.prototype.toString;

function deepClone(data, wm = new WeakMap()) {
  // 如果传参不是引用类型，直接返回就好
  if (typeof data !== 'object' || data === null) { return data; }

  const isDataArray = Array.isArray(data); // 判断 data 是否是数组
  const isDataObject = toString.call(data) === '[object Object]'; // 判断 data 是否是对象

  // 初始化 clone 数据为一个空数组或空对象，没有考虑 Map、Set 等其他引用类型
  let cloned
  if (isDataArray) {
    cloned = []
  } else if (isDataObject) {
    cloned = {}
  } else {
    return data;
  }

  // 通过一个 WeakMap 来解决递归过程中的循环引用问题
  // WeakMap 的 key 是源数据
  // WeakMap 的 value 是源数据对应的 clone 数据
  // 遍历过程中记录 cloned 克隆结果，先去取，能取到就直接得到之前的克隆结果
  const gotData = wm.get(data);
  if (gotData) {
    return gotData;
  } else {
    wm.set(data, cloned);
  }

  // 区分数组和对象的遍历方法，尽可能选择更高性能的
  if (isDataArray) {
    // 遍历数组
    for (let i = 0; i < data.length; i++) {
      cloned[i] = deepClone(data[i], wm);
    }
  } else {
    // 遍历对象，使用 Object.keys() 获取对象自身的 key，而不是用 for-in，因为会遍历原型链
    const keys = Object.keys(data);
    for (let j = 0; j < keys.length; j++) {
      const keyName = keys[j];
      cloned[keyName] = deepClone(data[keyName], wm);
    }
  }

  return cloned;
}
```

## Promise 有哪三种状态，如何变化？

三种状态：

* Pending
* Fulfilled
* Rejected

状态变化只能是：

* Pending -> Fulfilled
* Pending -> Rejected

并且状态变化「不可逆」

状态的表现：

* Pending 状态，不会触发 `.then()` 和 `.catch()`
* 若变为 Fulfilled 状态，会触发 `.then()` 回调的执行
* 若变为 Rejected 状态，会触发 `.catch()` 回调的执行

### `.then()` 和 `.catch()` 对于状态的改变

* `.then()` 中：
  * 正常执行会返回 Fulfilled 状态的 Promise 实例
  * 如果里面有报错，会返回 Rejected 状态的 Promise 实例
* `.catch()` 中：
  * 正常执行会返回 Fulfilled 状态的 Promise 实例
  * 如果里面有报错，会返回 Rejected 状态的 Promise 实例

或者可以这么说：

**不管是 `.then()` 或是 `.catch()`，只要里面正常执行，`return` 的就是 Fulfilled 状态的 Promise 实例，只要里面有报错，`return` 的就是 Rejected 状态的 Promise 实例**

## 如何用 Promise 封装一个原生 AJAX 请求？

一个简单的用 `Promise` 配合 `XMLHttpRequest` 封装 AJAX 请求的例子：

```js
function fetchRequest({
  url, // 请求 URL
  method = 'GET', // 请求方法，默认为 GET
  isAsync = true, // 是否异步，默认为 true
  postData, // POST 请求的数据
}) {
  return new Promise((resolve, reject) => {
    // 1. 创建 XHR 对象（不考虑低版本 IE 兼容问题）
    const xhr = new XMLHttpRequest();

    // 2. 设置请求方法、URL、是否异步（第三个参数为 true 默认异步）
    xhr.open(method, url, isAsync);

    // 3. 发送请求给服务器
    postData
      ? xhr.send(postData)
      : xhr.send();

    // 4. 监听响应
    xhr.onreadystatechange = () => {
      // XHR 实例的 5 种 readyState：
      //   0: 请求未初始化
      //   1: 已建立服务器链接
      //   2: 请求已接收
      //   3: 正在处理请求
      //   4: 请求已完成，且响应已准备好
      if (xhr.readyState === 4) {
        // 如果 HTTP Status 为 200，则响应成功
        if (xhr.status === 200) {
          // 通过 xhr.responseText 拿到响应内容
          resolve(xhr.responseText);
        } else {
          reject({
            httpStatus: xhr.status,
            responseText: xhr.responseText,
          });
        }
      }
    };
  });
}
```

## async/await

* 背景：回调地狱 Callback Hell
* 虽然 `Promise` 的 `.then()`、`.catch()` 支持链式调用，但也是基于回调函数
* `async/await` 是同步语法，彻底消灭回调函数。用同步的语法来编写异步逻辑

### async/await 与 Promise 有什么关系

* `async/await` 是消灭异步回调的终结武器
* 但和 `Promise` 并不互斥
* 反而，两者是相辅相成的

`async/await` 与 `Promise` 的结合使用：

* 执行 `async` 函数，`return` 的是 `Promise` 实例
* `await` 相当于 `Promise` 的 `.then()`
  * 情况 1：`await` 后跟一个 `Promise` 实例
  * 情况 2：`await` 后跟一个值，就相当于 `await Promise.resolve(值)`
  * 情况 3：`await` 后跟一个 `async` 函数的执行，相当于情况 1
* `try...catch` 可捕获异常，代替了 `Promise` 的 `.catch()`
