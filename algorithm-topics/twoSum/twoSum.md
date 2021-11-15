# 两数之和

## （一）题目描述

给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出**和为目标值** `target`  的那**两个**整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

示例1：

```
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
```

示例2：

```
输入：nums = [3,2,4], target = 6
输出：[1,2]
```

示例3：

```
输入：nums = [3,3], target = 6
输出：[0,1]
```

提示：

* 2 <= nums.length <= ![10^{4}](http://latex.codecogs.com/png.image?\dpi{110}%2010^{4})
* ![-10^{9}](http://latex.codecogs.com/png.image?\dpi{110}%20-10^{9}) <= nums[i] <= ![10^{9}](http://latex.codecogs.com/png.image?\dpi{110}%2010^{9})
* ![-10^{9}](http://latex.codecogs.com/png.image?\dpi{110}%20-10^{9}) <= target <= ![10^{9}](http://latex.codecogs.com/png.image?\dpi{110}%2010^{9})
* **只会存在一个有效答案**

进阶：

你可以想出一个时间复杂度小于 ![O(n^{2})](http://latex.codecogs.com/png.image?\dpi{110}%20O(n^{2})) 的算法吗？

> 题目来源：力扣（LeetCode）

## （二）青铜级解法 - 双层遍历

核心思路：双层遍历，用数组的每一项，和它之后的所有项一一求和，过程中记录索引，求和等于 `target` 时，`return` 索引数组。

上菜（代码）：

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
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
```

你也可以在[这里]()找到代码。

这种解法的时间复杂度是 ![O(n^{2})](http://latex.codecogs.com/png.image?\dpi{110}%20O(n^{2}))
