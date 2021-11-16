# 无重复字符的最长子串

> 发布于 2021.11.16，最后更新于 2021.11.16。
>
> 虽然我的算法实现使用了 JS，但思想都是相通的，与语言无关。

## （一）题目描述

给定一个字符串 `s`，请你找出其中不含有重复字符的**最长子串**的长度。

**示例 1**：

```
输入: s = "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

**示例 2**：

```
输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
```

**示例 3**：

```
输入: s = "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是子串的长度，"pwke" 是一个子序列，不是子串。
```

**示例 4**：

```
输入: s = ""
输出: 0
```

**提示**：

* 0 <= s.length <= 5 * ![10^{4}](http://latex.codecogs.com/png.image?\dpi{110}%2010^{4})；
* `s` 由英文字母、数字、符号和空格组成。

## （二）青铜级解法 - 枚举所有子串

这是一种暴力解法，核心思路：

* 通过双层循环，遍历 `s`，得到所有子串的情况。第一层循环从 `s` 的开始位置向后遍历，第二层从外层索引的下一个字符开始遍历，直到 `s` 结尾。当然双层循环的方式可以有很多，但总之是用了双层循环才能枚举穷尽所有子串情况；
* 在遍历过程中，不断判断子串是否有重复字符，用变量记录无重复字符的最长子串长度，并不断更新它。

### JS 实现通过散列表判断字符串中是否有重复字符

上面思路中，“判断子串是否有重复字符”，这本身需要一个小算法。可以通过散列表来解决。

上菜（代码）：

```js
// 判断传入字符中是否有重复的字符
const isHasRepeatingStr = (str) => {
  const strLen = str.length;

  if (strLen < 2) { return false; } // 空字符或单字符直接 return false

  // 初始化散列表，存入字符串首字符和其索引
  const map = new Map([
    [str[0], 0]
  ]);

  // 从第二个字符开始遍历
  for (let i = 1; i < str.length; i++) {
    // 当前遍历的字符
    const currentStr = str[i];
    // 尝试从散列表中取当前遍历的字符
    const searchedStr = map.get(currentStr);

    // 如果取到，说明有重复字符
    if (searchedStr !== undefined) { return true; }

    // 如果没取到，就添加进散列表
    map.set(currentStr, i);
  }
  return false;
}

// 测试用例 - 判断传入字符中是否有重复的字符
const str1 = 'abc'; // 期望 false
const str2 = ''; // 期望 false
const str3 = 'abca'; // 期望 true

[str1, str2, str3].forEach((str) => {
  console.log(isHasRepeatingStr(str)); // 依次输出 false, false. true
});
```

**散列表**，也就是哈希表，里面存储着键值对（键-值映射）。

核心思路是：遍历传入字符串的每个字符，尝试从散列表中取当前遍历字符：

* 如果能取到值，说明有重复字符，结束遍历，`return true`；
* 如果取不到值，说明还未重复，那就向散列表添加值；
* 如果完全遍历后，依然没有重复值，那就最终 `return false`；

另外我在代码中使用了 `Map`，这是 ES6 新增的集合引用类型，可以用它来表示散列表。如果不熟悉的话，可以看看我的另一篇文章：[《“可圈可点”的 Map 与 Set》](https://github.com/roc-an/blog/issues/10)。

### 暴力求解

上菜：

```js
const lengthOfLongestSubstring = (s) => {
  const sLen = s.length;
  if (sLen === 1) { return 1; } // 如果只有 1 个字符，直接 return 1

  let longestLen = 0; // 最长子串长度

  for (let i = 0; i < sLen; i++) {
    for (let j = i + 1; j < sLen + 1; j++) {
      // 在 s 中按索引截取子串
      const subStr = s.slice(i, j);
      const subStrLen = subStr.length;

      // 如果子串无重复字符，那么判断并更新最长子串长度
      if (!isHasRepeatingStr(subStr) && subStrLen > longestLen) {
        longestLen = subStrLen;
      }
    }
  }
  return longestLen;
};
```

其中调用了我们之前实现的 `isHasRepeatingStr()` 函数来检测子串是否有重复字符。

在 LeetCode 上跑暴力求解的算法，在执行最后一个超长字符串时超出时间限制了（我用秒表计时了 15s）...

### 暴力求解算法的时间、空间复杂度分析

先来分析时间复杂度，有两种关键操作：

* 双层遍历，取到所有子串。该操作时间复杂度是 ![O(n^{2})](http://latex.codecogs.com/png.image?\dpi{110}%20O(n^{2}))；
* 使用散列表判断子串中是否有重复字符，时间复杂度是 `O(n)`；

所以整体的**时间复杂度**是 ![O(n^{3})](http://latex.codecogs.com/png.image?\dpi{110}%20O(n^{3}))

空间复杂的话，由于使用了散列表，所以**空间复杂度**是 `O(m)`，`m` 是字符串的长度。
