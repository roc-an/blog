/**
 * @description 第三大的数
 * 给你一个非空数组，返回数组中第三大的数，如果不存在，则返回数组中最大的数
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 */
function thirdMax(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  if (arr.length === 1) return arr[0];

  // 用 3 个变量 a、b、c 来维护遍历过程中，数组中的最大值、次大值、第三大值
  let a = -Infinity;
  let b = -Infinity;
  let c = -Infinity;

  for (let i = 0; i < arr.length; i++) {
    const num = arr[i]; // 当前遍历数

    if (num > a) {
      // 若当前数 > 最大数，那么更新最大值，并依次更新次大值、第三大值
      c = b;
      b = a;
      a = num;
    } else if (num < a && num > b) {
      // 若当前数比最大数小，又比次大数大，那么更新次大数、第三大数
      c = b;
      b = num;
    } else if (num < b && num > c) {
      // 若当前数比次大数小，又比第三大数大，那么更新第三大数
      c = num;
    }
  }

  if (c === -Infinity) return a;
  return c;
}

console.log(thirdMax([2, 2, 3, 1]));
