/**
 * @description 回文链表
 * 给定一个链表的头结点 head，请判断其是否为回文链表
 * 如果一个链表是回文，那么链表结点序列从前往后看和从后往前看是相同的
 */

// 链表结点
function Node(data, next) {
  this.data = data;
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

const linkedList1 = getLinkedList('abcba');
console.log(linkedList1);

/**
 * @param {ListNode} head
 * @return {boolean}
 */
// 「快慢指针」核心思路解析：
// 1. 将链表的后半部分反转，然后和前半部分比较，比较后将链表复原
// 2. 并发场景下函数运行时需要锁定其他线程或进程对链表的访问，因为在函数执行过程中，链表会被修改

// 「快慢指针」算法步骤：
// 1. 找到前半部分链表的尾结点
// 2. 反转后半部分链表
// 3. 判断是否回文
// 4. 恢复链表，返回结果

// 如何找到前半部分的尾结点？
// 使用快、慢指针在一次遍历中找到。慢指针一次走一步，快指针一次走两步，快、慢指针同时出发
// 当快指针移动到链表的末尾时，慢指针恰好到链表的中间。通过慢指针将链表分为两部分
// 若链表有奇数个结点，则中间结点应归为前半部分
function isPalindrome(head) {

}
