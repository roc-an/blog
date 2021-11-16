/**
 * @description 两数相加
 */
// 单向链表节点构造函数
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * 将两个节点的值相加，得到新节点
 * @param prevNode 新链表的前置节点，初始为 null
 * @param n1 链表 1 的当前节点
 * @param n2 链表 2 的当前节点
 * @param carry 由上一次节点计算得到的待进位数
 * @returns 初始情况下，会 return 新链表头节点，其余情况不需要 return
 */
const setNextNode = (prevNode, n1, n2, carry) => {
  let sum = 0; // 本次计算求和
  // 如果 l1、l2 这两个链表不等长，那么必然有 1 个先遍历完，
  // 这种情况下，n1 和 n2 有 1 个会是 null
  if (n1 !== null) {
    sum += n1.val;
  }
  if (n2 !== null) {
    sum += n2.val;
  }
  // 累加待进位数
  sum += carry;

  // 计算要带到下个节点的进位
  const nextCarry = Math.floor(sum/10);
  // 计算要创建的新节点的 val
  const toSetVal = sum%10;

  // 创建一个 next 指向 null 的新节点
  const node = new ListNode(toSetVal);

  // 下一次计算要传递的 n1、n2
  let nextN1 = null;
  let nextN2 = null;
  if (n1 !== null && n1.next) {
    nextN1 = n1.next;
  }
  if (n2 !== null && n2.next) {
    nextN2 = n2.next;
  }

  // 如果 nextN1 和 nextN2 其中有 1 个不是 null，说明 l1 和 l2 还未遍历完，那么继续遍历
  // 如果 nextN1 和 nextN2 都是 null，但 nextCarry 不为 0，说明虽然 l1 和 l2 已经遍历完了，
  // 但最后一次计算还有进位，因此依然要创建一个新节点
  if (nextN1 !== null || nextN2 !== null || nextCarry !== 0) {
    setNextNode(node, nextN1, nextN2, nextCarry);
  }

  if (prevNode === null) {
    // 初始情况下，会 return 新链表头节点
    return node;
  } else {
    // 让新链表前置节点的 next 指向新创建的节点
    prevNode.next = node;
  }
}

const addTwoNumbers = (l1, l2) => {
  return setNextNode(null, l1, l2, 0);
};

// 测试用例
// 构造 l1：2 -> 4 -> 3
const l1HeadNode = new ListNode(2);
const l1Node2 = l1HeadNode.next = new ListNode(4);
l1Node2.next = new ListNode(3);

// 构造 l2：5 -> 6 -> 4
const l2HeadNode = new ListNode(5);
const l2Node2 = l2HeadNode.next = new ListNode(6);
l2Node2.next = new ListNode(4);

// 期望的新列表：7 -> 0 -> 8
console.log('得到的新链表头节点：', addTwoNumbers(l1HeadNode, l2HeadNode));
