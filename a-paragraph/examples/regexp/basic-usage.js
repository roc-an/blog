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

// 示例 3：将字符中的字母替换为 Q
// 知识点：范围类的使用
const str3 = 'a1b2d3x4z9YEAH';
const reg31 = /[a-z]/g; // 仅匹配小写字母
const reg32 = /[a-zA-Z]/g; // 匹配大小写字母
const res31 = str3.replace(reg31, 'Q');
const res32 = str3.replace(reg32, 'Q')
console.log('>>>>> res31', res31);
console.log('>>>>> res32', res32);
