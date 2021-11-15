# 散列表巧解“两数之和”问题

> 发布于 2021.11.15，最后更新于 2021.11.15。
>
> 封面图来自 Pexels 上的 Bert 拍摄的图片

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

## （四）散列表介绍

散列表（Hash Table），也叫哈希表。它是实现字典操作的一种有效数据结构。在一些合理的假设下，在散列表中查找一个元素的平均时间是 O(1)。

散列算法的作用是尽可能快地在数据结构中找到一个值。这要借助「散列函数」。

「散列函数」的作用是给定一个键值，然后按照一定逻辑返回对应的值在表中的地址。

### JavaScript 中的散列表

JS 中所有对象本质上就是使用散列表来表示的，对象的属性和方法作为 `key`，通过 `key` 可以快速取到对应值。

散列表最基本地至少要支持 3 种字典操作：

* INSERT：插入；
* SEARCH：查询；
* DELETE：删除。

JS 中，ES5 对象的这种哈希映射其实并不完美，因为对象的 `key` 必须是字符串类型的，也就是只能实现 “字符串->值” 的映射。

ES6 新增了 [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 数据类型，它可以完美实现 “值->值” 映射，`key` 的数据类型不再被限制。

关于 ES6 的 `Map` 可以参考我的另一篇文章：[《“可圈可点”的 Map 与 Set》](https://github.com/roc-an/blog/issues/10)，里面做了充分的介绍。

## （五）图解散列表解两数之和

我画了张图来描述算法过程，从左往右看，如图：

其中：

* `target = 2`；
* `nums = [-4, 2, 6, 1, -3]`；

遍历数组，对每项进行判断，如果用 `target` 减去该项数值所得到的数值不在散列表中，那就将它记录在散列表（记录数值和索引）。

依次类推，直到某次遍历，计算后发现得到的数就在散列表中，那么直接取索引，解题完毕。

## （六）JavaScript 实现散列表解两数之和

上菜：

```js
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
```

你也可以在[这里](https://github.com/roc-an/blog/blob/main/algorithm-topics/twoSum/code/twoSum-level2.js)找到完整代码。

我们分析下使用散列表求解两数之和的时间、空间复杂度：

* 时间复杂度：O(n)，`n` 是数组长度，我们仅进行了 1 次数组遍历，且存、取散列表的时间复杂度是 O(1)；
* 空间复杂度：O(n)，最坏的情况是遍历到数组最后才找到值，所以散列表最多要存 `n - 1` 个键值对；

## （七）小结

我们介绍了两种求解两数之和的方案，暴力解法的时间复杂度是 ![O(n^{2})](http://latex.codecogs.com/png.image?\dpi{110}%20O(n^{2}))，而使用散列表的时间复杂度只有 O(n)。

相比于多花点便宜的存储空间，时间肯定更宝贵。所以这种策略的核心是用空间换时间。

散列表可以方便地进行键值对映射，存取它的时间复杂度是 O(1)。

我还用 JS 代码完成了这两种方案，过程中使用了 ES6 Map，这也是 Map 的一个典型使用场景。

最后，感谢阅读，欢迎 Star 和订阅，每次发布新的文章我都会 release，这样好文章一旦发布你就能够收到通知。我的文章更新频率是每周至少 1 篇，上头时可能会 2~3 篇，欢迎大家与我交流！
