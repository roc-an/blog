/**
 * @description interface 的基本使用
 */
// 定义接口 interface
interface Person {
  // readonly name: string; // name 属性只能读取，不能设置
  name: string;
  age?: number; // age 属性可有可无
  say(): string; // say 属性是个对象方法
  [propName: string]: any; // 还可以有其他字符串类型的键的属性，属性值可以是任意类型
}

// 定义类型别名 type
type Person1 {
  name: string;
}

// 类型别名可以代表基本类型，而 interface 不可以
// TS 的规范是，如果能使用 interface 应优先使用 interface，interface 表示不了的情况再使用 type
// type Person2 = string;

// 接口间可以相互继承
interface Teacher extends Person {
  teach(): string;
}

// 接口可以定义函数
interface SayHi {
  (word: string): string;
}

const getPersonName = (person: Person): void => {
  console.log(person.name);
}

const setPersonName = (person: Person, name: string): void => {
  person.name = name;
}

const person = {
  name: 'Roc',
  say() {
    return '~';
  }
};
getPersonName(person);
setPersonName(person, 'Bird');

// 类 User 实现 Person 接口
// 类可以实现接口，通过类创建的实例必须满足接口的定义
class User implements Person {
  name = 'Roc';
  say() {
    return '~';
  }
}
