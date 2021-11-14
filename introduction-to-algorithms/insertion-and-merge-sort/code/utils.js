/**
 * @description 工具函数
 */
// 得到一个长度为 len，数字在 minNum 和 maxNum 之间随机整数的数组
const getRandomArr = (len = 10, minNum = 0, maxNum = 100) => {
  const array = [];
  for (let i = 0; i < len; i++) {
    const randomNum = Math.floor(Math.random() * (maxNum + 1 - minNum)) + minNum;
    array.push(randomNum);
  }
  return array;
};

module.exports = {
  getRandomArr,
}
