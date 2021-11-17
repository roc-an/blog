# 滑动窗口巧解“无重复字符的最长子串”问题

> 发布于 2021.11.17，最后更新于 2021.11.17。
>
> 封面图来自 Pexels 上的 Ron Lach 拍摄的图片
> 我的算法实现使用了 JS，思想都是相通的，其他语言也无妨

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

> 题目来源：力扣（LeetCode）

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

## （三）钻石级解法 - 单次遍历配合散列表

这是我一开始想的解法，核心思路是：

* 遍历字符串的每个字符，用变量 `maybeLongest` 存储遍历过程中可能的最长子串，并记录最长子串长度 `longestLen`；
* 每当遍历到 1 个字符，就判断它是否在 `maybeLongest` 中：
  * 如果在，说明重复了。那么下一个可能的最长子串，一定是从当前可能的最长子串中与当前遍历值不重复的地方开始的。比如，当前可能的最长子串是 `abc`，当前遍历的字符又遇到了 `b`，那么下一个可能的最长子串一定会是 `cb` 开头；
  * 如果不在，那就没重复，就把当前遍历字符添加到可能的最长子串中，继续遍历。

代码如下：

```js
const lengthOfLongestSubstring = (s) => {
  const sLen = s.length; // 传入字符的长度
  let longestLen = 0; // 遍历过程中，最长子串的长度
  let maybeLongest = ''; // 遍历过程中构造的、可能是最长子串的字符串

  for (let i = 0; i < sLen; i++) {
    const currentStr = s[i]; // 当前遍历的字符
    const indexOfRepeatingStr = maybeLongest.indexOf(currentStr); // 可能的最长子串中，重复字符的索引，-1 表示未重复

    if (indexOfRepeatingStr !== -1) {
      // 如果当前遍历到的字符，在 maybeLongest 中已经出现了

      // 下一个可能的最长子串，一定是从当前可能的最长子串中与当前遍历值不重复的地方开始的
      // 比如，当前可能的最长子串是 abc，当前遍历的字符又遇到了 b，那么下一个可能的最长子串一定会是 cb 开头
      maybeLongest = maybeLongest.slice(indexOfRepeatingStr + 1) + currentStr; // 更新可能最长子串

      // 如果更新后的可能最长子串长度 + s 未遍历的长度 <= 已得到的最长子串长度，那就没必要再遍历下去了
      // 比如，s = abcdcef，遍历到第二个 c，此时：
      //   已得到的最长子串是 abcd，长度为 4
      //   更新后的可能最长子串是 dc，长度为 2
      //   s 未遍历的字符串是 ef，长度为 2
      // 就算未遍历的字符都不重复，直到遍历完 s，得到的最长子串长度还是 4，不会超过先前的。所以没必要再遍历下去了
      if ((maybeLongest.length + (sLen - i -1)) <= longestLen) {
        break;
      }
    } else {
      // maybeLongest 中没有当前遍历的字符
      maybeLongest += currentStr;

      // 在每次可能最长子串新添加字符时判断：根据可能的最长子串，更新最长子串长度
      const maybeLongestLen = maybeLongest.length;
      longestLen = maybeLongestLen > longestLen ? maybeLongestLen : longestLen;
    }
  }
  return longestLen;
};

// 测试用例
const s1 = 'abcabcbb'; // 期望得到 3
const s2 = 'bbbbb'; // 期望得到 1
const s3 = 'pwwkew'; // 期望得到 3
const s4 = ''; // 期望得到 0
const s5 = ' '; // 期望得到 1

[s1, s2, s3, s4, s5].forEach((s) => {
  console.log(lengthOfLongestSubstring(s)); // 依次输出 3, 1, 3, 0, 1
});
```

其中，判断子串中是否含有当前遍历字符，我用了 JS 的 `String.prototype.indexOf()` 方法。如果不直接使用该方法，那就得借助散列表了。方案与前面的判断字符串是否包含某字符类似，散列表记录字符和其索引，添加前先尝试访问散列表，如果能访问到就能拿到索引。

分析一下时间、空间复杂度：

* 时间复杂度：![O(n^{2})](http://latex.codecogs.com/png.image?\dpi{110}%20O(n^{2}))。一层遍历的时间复杂度是 `O(n)`，用散列表获取重复字符的索引的时间复杂度也是 `O(n)`，所以整体是 ![O(n^{2})](http://latex.codecogs.com/png.image?\dpi{110}%20O(n^{2}))；
* 空间复杂度：`O(n)`，因为使用了散列表。

## （四）宗师级解法 - 滑动窗口

其实上面的方案距离最优解已经非常近了，上面方案中的 “可能的最长子串”，实际上就是一个「滑动窗口」，滑动窗口这种算法思维在求解子串类场景中非常常见。

以字符串 `"abcbd"` 为例，我画了张图来描述利用滑动窗口解题的思路，如图：

核心思路是：

* 通过散列表记录遍历过程中可能的最长子串的字符。使用散列表的好处是：
  * 能快速判断当前遍历字符是否重复；
  * 能记录字符的同时，映射它在 `s` 的索引；
* 利用窗口右侧索引不断遍历新字符，如果未重复，就右移右侧索引（滑动窗口扩张）；
* 若遇到重复字符，就不断地右移左侧索引，从散列表删字符，直到删除了散列表中的原有重复字符为止（滑动窗口收缩）；
* 若遇到重复字符，如果此时散列表长度 + `s` 未遍历的字符数 `<=` 已记录的最长子串长度，那就没必要再遍历下去了，这是一个提前终止遍历的小优化点。

上菜：

```js
const lengthOfLongestSubstring = (s) => {
  const sLen = s.length;
  // 遍历过程中的散列表，存着：“字符 -> 该字符在 s 中索引”的映射
  const map = new Map();
  // 遍历过程中，不断更新的最长子串的长度
  let longestLen = 0;
  // 初始化滑动窗口的左、右侧索引
  let lIndex = 0;
  let rIndex = 0;

  // 右侧索引不断右移去遍历字符
  while (rIndex < sLen) {
    const currentStr = s[rIndex]; // 当前遍历字符
    const searchedIndex = map.get(currentStr); // 尝试在散列表取重复字符索引

    if (searchedIndex === undefined) {
      // 若未取到，说明未重复
      map.set(currentStr, rIndex); // 添加到散列表
      const mapSize = map.size;
      longestLen = mapSize > longestLen ? mapSize : longestLen; // 更新最长子串长度
    } else {
      // 若取到，说明遇到重复字符了
      while (lIndex <= searchedIndex) {
        // 不断右移左侧索引，删除散列表重复字符及其之前的字符
        map.delete(s[lIndex]);
        lIndex++;
      }
      map.set(currentStr, rIndex); // 删除操作后，添加到散列表

      // 如果此时散列表长度 + s 未遍历的字符数 <= 已记录的最长子串长度，那就没必要再遍历下去了
      if (map.size + (sLen - rIndex - 1) <= longestLen) {
        break;
      }
    }
    rIndex += 1; // 滑动窗口右侧右移 1 位
  }
  return longestLen;
};

// 测试用例
const s1 = 'abcabcbb'; // 期望得到 3
const s2 = 'bbbbb'; // 期望得到 1
const s3 = 'pwwkew'; // 期望得到 3
const s4 = ''; // 期望得到 0
const s5 = ' '; // 期望得到 1

[s1, s2, s3, s4, s5].forEach((s) => {
  console.log(lengthOfLongestSubstring(s)); // 依次输出 3, 1, 3, 0, 1
});
```

注释多其实代码本身并不多。除了自己写的测试用例外，代码也通过了 LeetCode 上 987 个测试用例：

相比于前面的钻石级解法，你会发现，算法里也是既有遍历又有散列表呀。不同的是，在钻石级解法中，对于每次遍历，都会创建一个新的散列表，来取到遍历字符在可能的最长子串中的索引（这导致遍历了一次可能的最长子串）。而王者级解法从头到尾就维护着 1 个散列表，通过左、右侧索引的不断右移来增、删散列表中的数据。

利用「滑动窗口」策略，该算法的**时间、空间复杂度**：

* 时间复杂度：`O(n)`。虽然代码用了双重 `while` 循环，但并不是对于每次右侧索引右移，都要进行左侧索引遍历。实际上是，随着右侧索引右移遍历字符，左侧索引按条件跟着右移。对于左、右索引，都不存在要重复遍历 `s` 的过程；
* 空间复杂度：`O(n)`。主要使用了散列表来记录可能的最长子串的字符。

## （五）小结

我们前后用了 “青铜级 -> 钻石级 -> 王者级” 3 种方案对 “无重复字符的最长子串” 进行了解题。

可以在[这里](https://github.com/roc-an/blog/tree/main/algorithm-topics/lengthOfLongestSubstring/code)找到 3 种方案的完整代码。

核心的**解题意识**可以概括为两点：

* 通过**散列表**这种数据结构，实现“**查找、判重**”；
* 通过**滑动窗口**右移左、右侧索引来实现“**取子串**”。

另外我们在代码实现中，还使用了 JS ES6 `Map`，这是 `Map` 的一个典型使用场景。

最后，感谢阅读，欢迎 Star 和订阅，每次发布新的文章我都会 release，这样好文章一旦发布你就能够收到通知。我的文章更新频率是每周至少 1 篇，上头时可能会 2~3 篇，欢迎大家与我交流！
