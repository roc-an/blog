/**
 * @description 将文件转为 string
 */
module.exports = function(source) {
  // 考虑 ES6 模板字符串安全性
  const json = JSON.stringify(source)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  return `export default ${json}`;
}
