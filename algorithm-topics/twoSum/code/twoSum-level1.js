/**
 * @description 两数之和-双层遍历解法（青铜级）
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
const arr = [0, -28, 13, 22, 2, -6];
const target = 7;

const twoSum = (nums, target) => {
  for (let i = 0; i < nums.length; i++) {
    const num1 = nums[i]; // 外层循环要比较的值

    for (let j = i + 1; j < nums.length; j++) {
      const num2 = nums[j]; // 内层循环要比较的值

      if (num1 + num2 === target) {
        return [i, j]
      }
    }
  }
  return [];
};

const indexArr = twoSum(arr, target);

console.log('待查找的数组：', arr);
console.log('待匹配的 target：', target);
console.log('得到的索引数组：', indexArr);
