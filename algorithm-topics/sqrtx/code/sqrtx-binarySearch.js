/**
 * @description 求非负整数的算术平方根（忽略小数部分）- 二分查找法求解
 * 时间复杂度：O(logn)
 * 空间复杂度：O(1)
 */

// 取 low 到 high 之间的中位数，之所以用位运算是为了优化性能
function getMid(low, high) {
  return low + ((high - low) >> 1);
}

// 核心思路，x 平方根的整数部分 ans，是满足 k^2 <= x 的最大 k 值。采用二分查找求解
function sqrt(x) {
  if (!Number.isInteger(x) || x <= 0) return false;

  let low = 0;
  let high = x;
  let ans = -1; // 输出结果

  while (low <= high) {
    const mid = getMid(low, high); // 计算中位数

    if (mid * mid <= x) {
      // 若中位数平方小于 x，那么缓存中位数，并在中位数右区间继续找
      ans = mid;
      low = mid + 1;
    } else {
      // 若中位数平方大于 x，在中位数左区间继续找
      high = mid - 1;
    }
  }
  return ans;
}

console.log(sqrt(1)); // 1
console.log(sqrt(8)); // 2
console.log(sqrt(9)); // 3
