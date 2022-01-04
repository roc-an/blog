/**
 * @description 回文数-反转一半数字
 * 进阶，不将数字转为字符串
 */

// 可以将数字转为字符串，并检测字符串是否是回文。但这需要额外的非常量空间来创建字符串
// 反转一半数字：
// 1. 可以将数字本身反转，如果反转后与原数字相同，那么就是回文数
// 2. 但如果反转后的数过大，将导致整数溢出问题
// 3. 为避免溢出，可以只反转数字的一半。如果是回文数，那么其后半部分反转后应与前半部分相同

// 临界情况分析：
// 1. 负数不可能是回文数，如 -121
// 2. 除 0 外，所有个位数为 0 的数，不可能是回文数

// 算法思路分析 - 得到反转数字
// 1. 对数字取余，得到最后 1 位。如 1221 % 10 得到 1
// 2. 去掉原数字已取到的最后 1 位。如 Math.floor(1221 / 10) 得到 122
// 3. 继续取余，得到倒数第 2 位，以此类推
// 4. 如果将最后 1 位乘以 10，再加上倒数第 2 位，就得到反转后数字，以此类推

// 算法思路分析 - 如何判断反转数字的位数已达到原始数字位数的一半？
// 1. 整个过程中，原始数字不断除以 10，反转数字不断乘以 10
// 2. 当原始数字 <= 反转数字，意味着已经处理了一半位数的数字了

// 算法思路分析 - 最终的相等性判断
// 1. 若是奇数位，如 12321，剩余原始数 12 === Math.floor(反转数 123 / 10)
// 2. 若是偶数位，如 123321，剩余原始数 123 === 反转数 123

// 空间复杂度：O(1)，只需要常数空间存储若干变量
function isPalindrome(x) {
  // 非整数或负整数
  if (!Number.isInteger(x) || x < 0) return false;

  // x 非 0，且末位为 0
  if (x !== 0 && x % 10 === 0) return false;

  let srcNumber = x; // 持续处理的原始数
  let revertedNumber = 0; // 持续处理的反转数

  // 终止条件是 srcNumber <= revertedNumber
  while (srcNumber > revertedNumber) {
    const lastNum = srcNumber % 10; // 原始数的最后 1 位
    revertedNumber = revertedNumber * 10 + lastNum; // 将最后 1 位添加到反转数
    srcNumber = Math.floor(srcNumber / 10); // 原始数去掉最后 1 位
  }

  // 回文判断 - 支持奇、偶
  if (srcNumber === revertedNumber || srcNumber === Math.floor(revertedNumber / 10)) {
    return true;
  }
  return false;
}
