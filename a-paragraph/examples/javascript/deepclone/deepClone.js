const user = {
  name: 'Roc',
  age: '18',
  address: {
    city: 'TianJin'
  },
  skills: ['吃饭', '睡觉']
}
user.mine = user;

const toString = Object.prototype.toString;

function deepClone(data, wm = new WeakMap()) {
  // 如果传参不是引用类型，直接返回就好
  if (typeof data !== 'object' || data === null) { return data; }

  const isDataArray = Array.isArray(data); // 判断 data 是否是数组
  const isDataObject = toString.call(data) === '[object Object]'; // 判断 data 是否是对象

  // 初始化 clone 数据为一个空数组或空对象，没有考虑 Map、Set 等其他引用类型
  let cloned
  if (isDataArray) {
    cloned = []
  } else if (isDataObject) {
    cloned = {}
  } else {
    return data;
  }

  // 通过一个 WeakMap 来解决递归过程中的循环引用问题
  // WeakMap 的 key 是源数据
  // WeakMap 的 value 是源数据对应的 clone 数据
  // 遍历过程中记录 cloned 克隆结果，先去取，能取到就直接得到之前的克隆结果
  const gotData = wm.get(data);
  if (gotData) {
    return gotData;
  } else {
    wm.set(data, cloned);
  }

  // 区分数组和对象的遍历方法，尽可能选择更高性能的
  if (isDataArray) {
    // 遍历数组
    for (let i = 0; i < data.length; i++) {
      cloned[i] = deepClone(data[i], wm);
    }
  } else {
    // 遍历对象，使用 Object.keys() 获取对象自身的 key，而不是用 for-in，因为会遍历原型链
    const keys = Object.keys(data);
    for (let j = 0; j < keys.length; j++) {
      const keyName = keys[j];
      cloned[keyName] = deepClone(data[keyName], wm);
    }
  }

  return cloned;
}

const user2 = deepClone(user);
console.log(user2);
