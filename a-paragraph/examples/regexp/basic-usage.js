// 示例 1：将英文文本中的 is 单词替换为 IS
// 知识点：字面量 & 构造函数方式创建正则
const str1 = 'He is a boy. This is a dog. Where is she?';
const reg11 = /\bis\b/g; // 使用字面量创建正则
const reg12 = new RegExp('\\bis\\b', 'g'); // 使用构造函数创建正则
const res11 = str1.replace(reg11, 'IS');
const res12 = str1.replace(reg12, 'IS');
console.log('>>>>> res11', res11)
console.log('>>>>> res12', res12)

// 示例 2：
//   (2-1) 将字符中的 a 或 b 或 c，替换为 X
//   (2-2) 将字符串中不是 a 或 b 或 c 的字符，替换为 X
// 知识点：字符类的使用
const str2 = 'a1b2c3d4';
const reg21 = /[abc]/g;
const reg22 = /[^abc]/g; // 反向类
const res21 = str2.replace(reg21, 'X');
const res22 = str2.replace(reg22, 'X');
console.log('>>>>> res21', res21);
console.log('>>>>> res22', res22);
