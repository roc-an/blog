/**
 * @description 三数之和
 */

const threeSum = (arr) => {
  if (!Array.isArray(arr)) { throw new Error('所传入的数据不是数组') }

  const len = arr.length;
  // 如果数组不满 3 个数，return []
  if (len < 3) { return [] }

  // 先将数组升序排序：
  //   1. 这样第一层循环从小到大依次遍历，不会出现重复解
  //   2. 也为后续双指针法求两数之和准备
  arr.sort((a, b) => (a - b));

  const dist = []; // 结果数组
  let stashNum1 = null; // 缓存上一次第一层遍历的节点，如果下次遍历值相同，直接跳过，防止重复解

  for (let i = 0; i < len - 2; i++) {
    // 第一层遍历，遍历到数组倒数第 3 个数即可
    const num1 = arr[i]; // 第一个数

    if (num1 === stashNum1) {
      // 如果第一个数与之前第一层遍历的数一致，跳过，继续下一次遍历
      continue;
    }

    // 如果第一个数 > 三数之和了，那就没必要遍历下去了，因为后面的值都比这个数大
    if (num1 > 0) { break; }

    // 从 i + 1 开始寻找两数之和
    const toFindSum = 0 - num1; // 两数之和
    let lIndex = i + 1; // 头指针
    let rIndex = len - 1; // 尾指针

    while (lIndex < rIndex) {
      const lNum = arr[lIndex];
      const rNum = arr[rIndex];

      // 如果头节点 > 要找的两数之和，那就没必要继续遍历下去了，因为头节点之后的值都比头节点大
      if (lNum > toFindSum) { break; }

      const sum = lNum + rNum; // 当前遍历的两个数的和

      if (sum === toFindSum) {
        // 如果头、尾节点和正好是要找的两数之和，push 进结果数组
        dist.push([num1, lNum, rNum]);
        // 右移头指针，直到一个不重复的值
        while (arr[lIndex + 1] === lNum) { lIndex++; }
        // 左移尾指针，直到一个不重复的值
        while (arr[rIndex - 1] === rNum) { rIndex--; }
        lIndex++;
        rIndex--;
      } else if (sum < toFindSum) {
        // 如果头、尾节点和 < 要找的两数之和，那么右移头节点
        while (arr[lIndex + 1] === lNum) { lIndex++; }
        lIndex++;
      } else {
        // 如果头、尾节点和 > 要找的两数之和，那么左移尾节点
        while (arr[rIndex - 1] === rNum) { rIndex--; }
        rIndex--;
      }
    }

    stashNum1 = num1; // 缓存本次第一层遍历的值
  }

  return dist;
}

// 测试用例
const nums1 = [-1, 0, 1, 2, -1, -4];
console.log(threeSum(nums1)); // [ [ -1, -1, 2 ], [ -1, 0, 1 ] ]

const nums2 = [];
console.log(threeSum(nums2)); // []

const nums3 = [0];
console.log(threeSum(nums3)); // []
