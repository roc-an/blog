/**
 * @description 两数之和-散列表解法（钻石级）
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
const arr = [0, -28, 13, 22, 2, -6];
const target = 7;

const twoSum = (nums, target) => {
  // 创建散列表实例，数组的首项一定不在散列表中，所以直接添加就好
  const map = new Map([
    [nums[0], 0]
  ]);

  // 从数组第 2 项开始遍历
  for(let i = 1; i < nums.length; i++) {
    const expectedNum = target - nums[i]; // 期望找到的另一个数 = target - 当前数
    const searchedNumIndex = map.get(expectedNum); // 向 map 中查找数字索引

    if (searchedNumIndex === undefined) {
      // 如果没找到，那就向散列表添加信息
      map.set(nums[i], i);
    } else {
      // 如果找到，那就返回索引数组
      return [searchedNumIndex, i];
    }
  }
  throw new Error('没有匹配出现');
};

const indexArr = twoSum(arr, target);

console.log('待查找的数组：', arr);
console.log('待匹配的 target：', target);
console.log('得到的索引数组：', indexArr);
