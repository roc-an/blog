/**
 * @description 插入排序（升序）
 */
const { getRandomArr } = require('./utils');

const insertionSort = (arr) => {
  if (!Array.isArray(arr)) { return [] }

  let key; // 存储待插入的值
  for (let j = 1; j < arr.length; j++) {
    let i = j - 1;
    key = arr[j];

    while (i >= 0 && arr[i] > key) {
      arr[i + 1] = arr[i]; // 当前索引为 i 的数字，因为较大，所以右移 1 位
      i--;
    }
    arr[i + 1] = key; // 插入 key 值
  }
}

const arr = getRandomArr();

console.log('插入排序前：', arr);
insertionSort(arr);
console.log('插入排序后：', arr);

module.exports = insertionSort;
