/**
 * @description 求无重复字符的最长子串 - 滑动窗口（宗师级）
 * @param {string} s
 * @return {number}
 */
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
