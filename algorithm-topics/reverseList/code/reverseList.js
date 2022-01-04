/**
 * @description 反转单链表
 * 给你单链表的头结点 head，请你反转链表，并返回反转后的链表
 * 例如，1->2->3->4->5，反转为 5->4->3->2->1
 */
// 链表结点
function Node(data, next) {
  this.data = data;
  this.next = next;
}
// 由数字数组生成单链表
function getLinkedList(arr) {
  // 过滤掉非数组、空数组
  if (!Array.isArray(arr) || arr.length === 0) return null;

  let headNode = null; // 单链表头结点
  let prevNode = null; // 上个创建的结点

  arr.forEach((num, index) => {
    const node = new Node(num, null); // 创建新结点

    if (index === 0) {
      // 记录头结点
      headNode = node;
    } else {
      // 非头结点
      prevNode.next = node; // 上个结点的 next 指向当前创建结点
    }
    prevNode = node; // 更新缓存的上个创建结点
  });
  return headNode;
}

// 反转单链表
// 时间复杂度：O(n)。需要完整遍历 1 次链表
// 空间复杂度：O(1)
function reverseList(head) {
  let prevNode = null; // 遍历到的上个结点，初始为 null
  let curNode = head; // 当前遍历的结点

  // 遍历终止条件：
  while (curNode) {
    const stash = curNode;

    curNode = stash.next; // 下一次要遍历的结点
    stash.next = prevNode; // 让当前遍历结点的 next 指向上一个结点
    prevNode = stash;
  }

  return prevNode;
}

const linkedList = getLinkedList([1, 2, 3, 4, 5]);
const distList = reverseList(linkedList);
console.log('>>>', distList);
