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

/**
 * @param {ListNode} head
 * @return {boolean}
 */
// 「快慢指针」核心思路解析：
// 1. 将链表的前半部分反转，然后和后半部分比较
// 2. 并发场景下函数运行时需要锁定其他线程或进程对链表的访问，因为在函数执行过程中，链表会被修改

// 「快慢指针」算法步骤：
// 1. 找到前半部分链表的尾结点
// 2. 过程中反转前半部分链表
// 3. 判断是否回文

// 如何找到前半部分的尾结点？
// 使用快、慢指针在一次遍历中找到。慢指针一次走一步，快指针一次走两步，快、慢指针同时出发
// 当快指针移动到链表的末尾时，慢指针恰好到链表的中间。通过慢指针将链表分为两部分
// 若链表有奇数个结点，则中间结点应归为前半部分
function isPalindrome(head) {
  // 边界：空结点 return false
  if (head === null) return false;

  // 边界：单结点 return true
  if (head.next === null) return true;

  let slowPoint = head; // 慢指针
  let fastPoint = head; // 快指针
  let reversedLeftListHead = null; // 新构建的前半部分反转链表的头结点（不影响原始链表）

  // 循环终止条件: 快指针遍历到链表尾结点
  // 遍历后：
  // 12 ---> slowPoint 是 1
  // 12321 ---> slowPoint 是 3
  // 123321 ---> slowPoint 是第一个 3
  while(!(fastPoint.next === null || fastPoint.next.next === null)) {
    // 由当前遍历结点创建新结点，反转
    reversedLeftListHead = new Node(slowPoint.val, reversedLeftListHead);

    slowPoint = slowPoint.next; // 慢指针走 1 步
    fastPoint = fastPoint.next.next; // 快指针走 2 步
  }

  // 锁定前半部分反转后链表、后半部分链表的头结点
  let rightListHead = slowPoint.next; // 后半部分链表头结点
  reversedLeftListHead = new Node(slowPoint.val, reversedLeftListHead); // 中间结点 slowPoint 作为前半部分反转链表的头结点

  // 回文比较
  if (reversedLeftListHead.val !== rightListHead.val) {
    // 可能是奇数情况
    reversedLeftListHead = reversedLeftListHead.next;
  }

  console.log('>>> reversedLeftListHead', reversedLeftListHead)
  console.log('>>> rightListHead', rightListHead)

  while (reversedLeftListHead !== null || rightListHead !== null) {
    if (reversedLeftListHead === null || rightListHead === null) return false;
    if (reversedLeftListHead.val !== rightListHead.val) {
      return false;
    }
    reversedLeftListHead = reversedLeftListHead.next; // 遍历至前半部分反转链表的下个结点
    rightListHead = rightListHead.next; // 遍历至后半部分链表的下个结点
  }
  // 如果完全比较后，每个节点都相同
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
