/**
 * @description 归并排序
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
