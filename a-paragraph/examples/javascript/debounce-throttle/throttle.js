/**
 * @description 节流
 * @要点：保持一定频率去触发，比如拖拽元素过程中获取位置
 */
const div1 = document.getElementById('div1');

// let timer = null;
// div1.addEventListener('drag', function(e) {
//   if (timer) { return; }

//   timer = setTimeout(() => {
//     console.log(e.offsetX, e.offsetY);

//     timer = null;
//   }, 500);
// })

function throttle(fn, delay = 500) {
  let timer = null;

  return function() {
    if (timer) { return; }

    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  }
}

div1.addEventListener('drag', throttle((e) => {
  console.log(e.offsetX, e.offsetY);
}))
