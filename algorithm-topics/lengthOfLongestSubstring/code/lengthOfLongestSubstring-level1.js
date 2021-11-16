/**
 * @description 求无重复字符的最长子串-枚举所有子串（青铜级）
 */

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

// 暴力求解
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

// 测试用例 - 判断传入字符中是否有重复的字符
const str1 = 'abc'; // 期望 false
const str2 = ''; // 期望 false
const str3 = 'abca'; // 期望 true

[str1, str2, str3].forEach((str) => {
  console.log(isHasRepeatingStr(str)); // 依次输出 false, false. true
});

// 测试用例 - 求无重复字符的最长子串
const s1 = 'abcabcbb'; // 期望得到 3
const s2 = 'bbbbb'; // 期望得到 1
const s3 = 'pwwkew'; // 期望得到 3
const s4 = ''; // 期望得到 0
const s5 = ' '; // 期望得到 1

[s1, s2, s3, s4, s5].forEach((s) => {
  console.log(lengthOfLongestSubstring(s)); // 依次输出 3, 1, 3, 0, 1
});
