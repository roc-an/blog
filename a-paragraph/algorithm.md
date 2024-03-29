# 一段话说透一个前端知识点 - 数据结构与算法

## 树

树是一种非线性数据结构。树根衍生出枝干，枝干衍生出小枝干，最终衍生出叶子。几个术语：

* 根节点：最开始发生衍生的节点；
* 兄弟节点：由同一个父节点衍生出来的节点；
* 叶子节点：树的末端，没有孩子的节点；
* 高度/深度：树的最大层级树。

### 什么是二叉树？

**二叉树是一种特殊的树，每个节点最多有 2 个子节点**。

#### 满二叉树

* 所有非叶子节点都有左、右 2 个子节点；
* 所有叶子节点都处于同一层级。

满二叉树的每个分支都是满的

#### 完全二叉树

如果一个二叉树的所有节点和同深度满二叉树的节点的位置都相同，那么这个二叉树就是完全二叉树。

完全二叉树的条件没有满二叉树的苛刻，只需要保证最后一个节点前的所有节点都齐全即可。

#### 二叉查找树

也叫二叉排序树，在二叉树的基础上，还要满足：

* 如果左子树不为空，则左子树上所有节点的值都小于根节点；
* 如果右子树不为空，则右子树上所有节点的值都大于根节点；
* 左、右子树也都是二叉查找树。

顾名思义，二叉查找树就是为了便于数据查找的，将待查找的值与树中节点比较，较小就往左子树上找，较大就往右子树上找，直到找到。

节点数为 `n` 的二叉查找树，搜索节点的时间复杂度是 `O(logn)`，和树的高度相同

### 二叉树的遍历方式有哪些？

二叉树的遍历，总体上可以按「深度优先遍历」和「广度优先遍历」这两大类来分。

深度优先遍历，一头扎到底，偏向纵深，一个方向走到头。

广度优先遍历，先把各个能走的方向走一步，然后再在各方向走第二步，以此类推。

二叉树深度优先遍历方式：

* 前序遍历：依次遍历根节点、左子树、右子树
* 中序遍历：依次遍历左子树、根节点、右子树
* 后序遍历：依次遍历左子树、右子树、根节点

二叉树的广度优先遍历方式：

* 层序遍历：按照从根节点到叶子节点的层级关系，一层层地横向遍历各节点

### 什么是二叉堆？

二叉堆本质上是一种完全二叉树，它分为「最小二叉堆」和「最大二叉堆」：

* 最大二叉堆：任何父节点的值，都大于或等于它左、右子节点的值
* 最小二叉堆：任何父节点的值，都小于或等于它左、右子节点的值

二叉堆的根节点，叫「堆顶」

所以，最大堆的堆顶是整个堆中的最大元素，最小堆的堆顶是整个堆中的最小元素

### 如何对二叉堆进行排序？

要想理解二叉堆排序，首先要理解二叉堆的 3 个基本操作：构建二叉堆、插入节点、删除节点

以最小二叉堆为例：

* 构建二叉堆：从完全二叉树的最后一个非叶子节点开始，依次遍历所有非叶子节点，并做“下沉”调整
  * 下沉：与左、右子节点比较值的大小，如果自己值最大，不调整，否则与比自己值小的互换位置。如果左、右节点值都比自己小，那与最小值互换位置
* 插入节点：先将新节点插入到最小堆的末尾，然后进行“上浮”调整
  * 上浮：与父节点比较值的大小，如果比父节点值小，就与父节点互换位置，直到比较到根节点
* 删除节点：从堆顶删除。将堆顶与最后一个叶子节点互换位置，互换后那个之前的叶子节点从堆顶做“下沉”调整

二叉堆排序：

排序就是循环提取二叉堆根节点的过程，当所有节点都提取完，被提取的节点构成的数组就是有序数组。

* 如需升序排序，应该构造最大堆。因为最大的元素最先被提取出来，被放置到了数组的最后，最终数组中最后一个元素为最大元素
* 如需降序排序，应该构造最小堆。因为最小的元素最先被提取出来，被放置到了数组的最后，最终数组中最后一个元素为最小元素
* 堆排序是一种不稳定排序。对于相同大小的元素，排序后可能次序被打乱
* 二叉堆排序的时间复杂度是 `O(nlogn)`
