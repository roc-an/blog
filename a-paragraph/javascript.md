# 一段话说透一个前端知识点 - JavaScript

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
