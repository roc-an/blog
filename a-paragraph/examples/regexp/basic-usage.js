// 示例 1：将英文文本中的 is 单词替换为 IS
const str1 = 'He is a boy. This is a dog. Where is she?';
const reg11 = /\bis\b/g; // 使用字面量创建正则
const reg12 = new RegExp('\\bis\\b', 'g'); // 使用构造函数创建正则
const res11 = str1.replace(reg11, 'IS');
const res12 = str1.replace(reg12, 'IS');
console.log('>>>>> res11', res11)
console.log('>>>>> res12', res12)
