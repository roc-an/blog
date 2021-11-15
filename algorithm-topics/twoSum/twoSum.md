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

这是暴力解法。

核心思路：双层遍历，用数组的每一项，和它之后的所有项一一求和，过程中记录索引，求和等于 `target` 时，`return` 索引数组。也就是说，通过双层遍历枚举了所有可能的情况。

上菜（代码）：

```js
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
```

你也可以在[这里](https://github.com/roc-an/blog/blob/main/algorithm-topics/twoSum/code/twoSum-level1.js)找到代码。

复杂度分析：

* 时间复杂度：![O(n^{2})](http://latex.codecogs.com/png.image?\dpi{110}%20O(n^{2}))，`n` 是数组长度；
* 空间复杂度：O(1)，只用到常数个临时变量（`len`、`i`、`j`）；

## （三）钻石级解法 - 使用散列表空间换时间

青铜级解法的时间复杂度是 ![O(n^{2})](http://latex.codecogs.com/png.image?\dpi{110}%20O(n^{2}))，空间复杂度是 O(1)。对于这种情况，通常的算法优化方向是：**空间换时间**。

两数之和为 `target`，这其实限定了数组中满足条件的这两个数的关系。如果数组中一个数 A，如果想找到满足条件的另一个数，那另一个数一定是 `target - A`。

因此，可以使用 `查找表法`，核心思路：

* 遍历数组时，记录信息，从而省去一层循环，这是空间换时间；
* 需要记录数字值，及其索引。可以通过查找表来实现；

查找表通常有两种实现：

* 散列表；
* 平衡二叉搜索树；

由于不需要维护查找表中元素的顺序，所以用**散列表**就可以了。
