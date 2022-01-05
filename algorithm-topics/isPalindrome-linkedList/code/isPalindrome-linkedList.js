/**
 * @description 回文链表
 * 给定一个链表的头结点 head，请判断其是否为回文链表
 * 如果一个链表是回文，那么链表结点序列从前往后看和从后往前看是相同的
 */

// 链表结点
function Node(val, next) {
  this.val = val;
  this.next = next;
}
// 字符串转单链表，得到头结点
function getLinkedList(str) {
  // 过滤非字符串、空字符串
  if (typeof str !== 'string' || str === '') return null;

  const arr = str.split('');
  let linkedList = null; // 单链表头结点
  let prevNode = null; // 上个创建的结点

  arr.forEach((str, index) => {
    const node = new Node(str, null); // 创建新结点

    if (index === 0) {
      // 记录头结点
      linkedList = node;
    } else {
      // 非头结点
      prevNode.next = node; // 上个结点的 next 指向当前创建结点
    }

    prevNode = node; // 更新缓存的上个创建结点
  });
  return linkedList;
}

// 反转链表，得到一个新链表
function getReversedList(head) {
  let prev = null; // 缓存上一步遍历的节点
  let cur = head; // 当前遍历的结点

  while (cur !== null) {
    const node = new Node(cur.val, prev);
    prev = node;
    cur = cur.next;
  }
  return prev;
}

/**
 * @param {ListNode} head
 * @return {boolean}
 */
// 「快慢指针」核心思路解析：
// 1. 将链表的后半部分反转，然后和前半部分比较
// 2. 并发场景下函数运行时需要锁定其他线程或进程对链表的访问，因为在函数执行过程中，链表会被修改

// 「快慢指针」算法步骤：
// 1. 找到前半部分链表的尾结点
// 2. 反转后半部分链表，得到反转后的新链表（过程中不影响原链表）
// 3. 判断是否回文

// 如何找到前半部分的尾结点？
// 使用快、慢指针在一次遍历中找到。慢指针一次走一步，快指针一次走两步，快、慢指针同时出发
// 当快指针移动到链表的末尾时，慢指针恰好到链表的中间。通过慢指针将链表分为两部分
// 若链表有奇数个结点，则中间结点应归为前半部分

// 时间复杂度 O(n)
// 空间复杂度 O(n)
// 对于空间复杂度，在过程中创建了新的后半部分反转链表。如果对于空间要求严苛的场景，可以将后半部分链表反转、回文比较后再复原，这样空间复杂度可降为 O(1)，但多了还原的时间开销
function isPalindrome(head) {
  // 边界：空结点、单结点 return true
  if (head === null || head.next === null) return true;

  let slowPoint = head; // 慢指针
  let fastPoint = head; // 快指针

  // 快、慢指针找到链表中间结点 slowPoint
  // 循环终止条件: 快指针遍历到链表尾结点
  // 遍历后：
  // 12 ---> slowPoint 是 1
  // 12321 ---> slowPoint 是 3
  // 123321 ---> slowPoint 是第一个 3
  while(!(fastPoint.next === null || fastPoint.next.next === null)) {
    slowPoint = slowPoint.next; // 慢指针走 1 步
    fastPoint = fastPoint.next.next; // 快指针走 2 步
  }

  // 得到反转后半部分的新链表头结点
  let reversedSecondHalfHead = getReversedList(slowPoint.next);

  // 回文比较
  // 循环终止条件：反转后的后半部分链表遍历结束
  while (reversedSecondHalfHead !== null) {
    if (head.val !== reversedSecondHalfHead.val) return false;
    // 前半部分、后半部分反转后链表，各进一步
    head = head.next;
    reversedSecondHalfHead = reversedSecondHalfHead.next;
  }
  return true;
}

const linkedList1 = getLinkedList('abcba');
const linkedList2 = getLinkedList('123321');
const linkedList3 = getLinkedList('1221');
const linkedList4 = getLinkedList('12');

console.log('>>>', isPalindrome(linkedList1));
console.log('>>>', isPalindrome(linkedList2));
console.log('>>>', isPalindrome(linkedList3));
console.log('>>>', isPalindrome(linkedList4));
