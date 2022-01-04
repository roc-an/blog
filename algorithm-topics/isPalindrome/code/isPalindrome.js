/**
 * @description 回文数
 * 给一个整数 x，如果 x 是一个回文整数，返回 true，否则返回 false
 * 回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数
 * 例如，121 是回文，而 123 不是
 */
// 回文匹配有 2 种情况：
// 奇数个字符：121
// 偶数个字符：1221
function isPalindrome(x) {
  if (typeof x !== 'number') return false;
  const xStr = String(x);
  let lIndex = 0; // 左指针
  let rIndex = xStr.length - 1; // 右指针

  // 如果是奇数个字符，lIndex === rIndex 时终止循环
  // 如果是偶数个字符，lIndex > rIndex 时终止循环
  while (lIndex < rIndex) {
    const lStr = xStr[lIndex];
    const rStr = xStr[rIndex];

    if (lStr !== rStr) return false;

    lIndex++;
    rIndex--;
  }

  return true;
}
