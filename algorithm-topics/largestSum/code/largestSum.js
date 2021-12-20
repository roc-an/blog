// 给定一个数组，找到一个具有最大和的连续子数组，返回其最大和
// 输入：[1, -2, 4, 5, -1, 1]
// 输出：9
// 最大子数组：[4, 5]

// 解法错了，还不如暴力求解
function largestSum(arr) {
  if (!Array.isArray(arr)) { return 0 }

  const len = arr.length;

  if (len < 2) { return len === 0 ? 0 : arr[0] }

  let largestSum = 0; // 已计算出的最大和
  let stashSum = 0; // 正在计算的和

  for (let i = 0; i < len; i++) {
    stashSum = arr[i]

    for (let j = i + 1; j < len; j++) {
      const nextNum = arr[j]
      if (nextNum > 0) {
        stashSum += nextNum
        if (j === len - 1) {
          largestSum = largestSum > stashSum ? largestSum : stashSum
        }
      } else if (nextNum < 0) {
        largestSum = largestSum > stashSum ? largestSum : stashSum // 更新 largestSum
        break;
      }
    }
  }

  return largestSum
}

const res = largestSum([1, -2, 4, 5, -1, 1])

console.log(res)
