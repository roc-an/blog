/**
 * @description 求无重复字符的最长子串-枚举所有子串（青铜级）
 */

// 判断传入字符中是否有重复的字符
const isHasRepeatingStr = (str) => {
  const strLen = str.length;

  if (strLen < 1) { return false; } // 空字符直接 return false

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

