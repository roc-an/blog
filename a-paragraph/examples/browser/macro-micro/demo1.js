/**
 * @description DOM 渲染和 Event Loop 关系
 */
const p1 = document.createElement('p')
const p2 = document.createElement('p')
const p3 = document.createElement('p')

p1.textContent = '一段文字'
p2.textContent = '一段文字'
p3.textContent = '一段文字'

const container = document.querySelector('#container')

container.appendChild(p1)
container.appendChild(p2)
container.appendChild(p3)

console.log('length', container.children.length);
// alert 会阻断 JS 执行，也会阻断 DOM 渲染，便于查看效果
// alert('本次 Call Stack 结束，DOM 结构已更新，但尚未触发渲染')

// 微任务：DOM 渲染前触发
Promise.resolve().then(() => {
  console.log('微任务：DOM 渲染前触发')
  alert('Check 微任务是否是在 DOM 渲染前执行')
})

// 宏任务：DOM 渲染后触发
setTimeout(() => {
  console.log('宏任务：DOM 渲染后触发')
  alert('Check 宏任务是否是在 DOM 渲染后执行')
})
