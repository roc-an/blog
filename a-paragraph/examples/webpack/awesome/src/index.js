// 引入 CSS
import './style/style1.css'
import './style/style2.less'

// 引入第三方模块
// import _ from 'lodash'

// 引入 JS
import { sum } from './math'

// 引入图片
import imgFile1 from './img/1.jpeg'
import imgFile2 from './img/2.jpeg'

const sumRes = sum(10, 20)
console.log('sumRes', sumRes)

// 开启热更新之后的代码逻辑
// if (module.hot) {
//   module.hot.accept(['./math'], () => {
//     const sumRes = sum(10, 20)
//     console.log('sumRes in hot', sumRes)
//   })
// }

console.log('window.ENV', window.ENV)

// 引入图片
function insertImgElem(imgFile) {
  const img = new Image()
  img.src = imgFile
  document.body.appendChild(img)
}

insertImgElem(imgFile1)
insertImgElem(imgFile2)
