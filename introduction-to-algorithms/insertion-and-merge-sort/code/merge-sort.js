/**
 * @description 归并排序（升序）
 */
const { getRandomArr } = require('./utils');

// 归并子程序
const getMergedArr = (arr1, arr2) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    throw new Error('出错，待合并的数据不是数组');
  }

  // 最终合并至的数组
  const distArr = [];
  // 总长度意味着要向 distArr 中 push 几次
  const totalLength = arr1.length + arr2.length;

  // 将正无穷哨兵 push 进两个待合并数组
  arr1.push(Infinity);
  arr2.push(Infinity);

  // 分别作为 arr1、arr2 的取值索引
  let i = 0;
  let j = 0;

  // 循环取到 arr1、arr2 中的最小数字，然后 push 进 distArr
  for (let pushCount = 0; pushCount < totalLength;) {
    // 分别取 arr1、arr2 中未 push 进 distArr 的最小值
    const num1 = arr1[i];
    const num2 = arr2[j];

    if (num1 === num2) {
      // 如果两数相等，那就都 push 进 distArr
      distArr.push(num1);
      distArr.push(num2);

      i += 1;
      j += 1;
      pushCount += 2; // 由于连着 push 了两次，所以 pushCount + 2
    } else if (num1 > num2) {
      // 如果 arr2 的数更小，那就 push arr2 的数，然后 arr2 的取值索引 + 1
      distArr.push(num2);
      j += 1;
      pushCount += 1;
    } else {
      // 如果 arr1 的数更小，那就 push arr1 的数，然后 arr1 的取值索引 + 1
      distArr.push(num1);
      i += 1;
      pushCount +=1;
    }
  }
  return distArr;
};

// 归并排序
const getMergeSortedArray = (arr) => {
  if (!Array.isArray(arr)) {
    throw new Error('所提供的的数据中含有非数组元素');
  }

  const len = arr.length;
  // 如果待归并的数组长度是奇数，那递归后一定有 1 次是 arr 就 1 个元素
  if (len === 1) { return arr; }

  // 如果 arr 有两个元素，那么比较大小后，返回升序数组
  if (len === 2) {
    if (arr[0] <= arr[1]) {
      return arr;
    } else {
      return [arr[1], arr[0]]
    }
  }

  // 如果 arr 超过两个元素，那么递归调用自身，取得待 merge 的两个数组
  const midIndex = Math.floor(len/2); // 取得中间的索引，向下取整
  const subArr1 = getMergeSortedArray(arr.slice(0, midIndex));
  const subArr2 = getMergeSortedArray(arr.slice(midIndex, len));

  // 调用归并子程序对两个子数组进行合并
  return getMergedArr(subArr1, subArr2);
}

const arr = getRandomArr(13, 0, 10);
console.log('待归并排序的初始数组：', arr);
console.log('归并排序后的数组：', getMergeSortedArray(arr));
