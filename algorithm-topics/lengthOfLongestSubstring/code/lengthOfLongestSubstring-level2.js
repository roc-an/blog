/**
 * @description 求无重复字符的最长子串 - 单次遍历配合散列表（钻石级）
 * @param {string} s
 * @return {number}
 */
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
