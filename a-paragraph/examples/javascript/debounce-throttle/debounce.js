/**
 * @description 防抖
 */
const input1 = document.querySelector('#input1')

// let timer = null; // 定时器

// input1.addEventListener('keyup', function() {
//   // 频繁触发时，如果之前的定时器未结束，那么清空它
//   if (timer) {
//     clearTimeout(timer)
//   }
//   timer = setTimeout(() => {
//     console.log(input1.value);

//     timer = null
//   }, 500)
// })

// 防抖函数 - 调用后得到新函数
function debounce(fn, delay = 500) {
  let timer = null;
  return function() {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments) // 重要，透传参数
      timer = null
    }, delay)
  }
}

input1.addEventListener('keyup', debounce(() => {
  console.log(input1.value)
}, 2000))
