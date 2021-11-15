/**
 * @description 两数之和-双层遍历解法（青铜级）
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
const arr = [0, -28, 13, 22, 2, -6];
const target = 7;

const twoSum = (nums, target) => {
  const len = nums.length;

  for (let i = 0; i < len - 1; i++) {
    for (let j = i + 1; j < len; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j]
      }
    }
  }
  throw new Error('没有匹配出现');
};

const indexArr = twoSum(arr, target);

console.log('待查找的数组：', arr);
console.log('待匹配的 target：', target);
console.log('得到的索引数组：', indexArr);
