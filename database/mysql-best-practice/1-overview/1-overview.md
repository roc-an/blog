## MySQL 生态与环境

### MySQL 数据库服务器及相关组件

在 [MySQL Community Downloads](https://dev.mysql.com/downloads/) 可以下载诸多 MySQL 相关软件，挑几个重点介绍：

* MySQL Community Server：MySQL 数据库服务器，是 MySQL 的核心组件；
* MySQL Router：轻量级的插件，在应用和数据库服务器之间，起到路由和负载均衡的作用；
* MySQL Shell：命令行工具，支持 SQL 语句、JavaScript、Python，支持调用 MySQL API 的接口；
* MySQL Workbench：官方提供的 MySQL 图形操作工具。
* Connector/xxx：这些是数据库驱动程序，通过它们可以让其他的语言开发环境、软件连接 MySQL。比如 Connector/ODBC 就可以让微软产品（如 Excel）连接 MySQL。

其中，MySQL Router 可以对前端发来的大量数据库访问请求进行调度，把访问均衡地分配给每一个数据库服务器（如果有多个数据库服务器的话）。

### MySQL 服务器配置

可以将 MySQL 服务器配置成 3 种：

* 开发计算机（Development Computer）：MySQL 服务只会占用最小的内存，以便其他应用也可以正常运行；
* 服务器计算机（Server Computer）：MySQL 服务占用中等程度的内存，会假设在这台计算机上有多个 MySQL 数据库服务器实例在运行；
* 专属计算机（dedicated Computer）：MySQL 服务占用计算机的全部内存资源。

可见，**这 3 种服务器类别的主要区别是 MySQL 服务将占用计算机内存的多少**。

**MySQL 数据库的 3 种连接方式**：

* 网络通讯协议（TCP/IP）
* 命名管道（Named Pipe）
* 共享内存（Shared Memory）

命名管道和共享内存方式的优势是访问速度更快，但这两种只能本地访问数据库。所以一般都选择网络通讯协议方式，默认的 TCP/IP 协议访问端口是 3306。

### MySQL 源码学习途径

如果要学习 MySQL 源码，那么[下载](https://dev.mysql.com/downloads/mysql/8.0.html)时将操作系统选成“SourceCode”。

MySQL 是用 C++ 写的，其中几个重点目录：

* `/sql`：MySQL 的核心代码；
* `/libmysql`：客户端程序的 API；
* `/mysql-test`：测试工具；
* `/mysys`：操作系统相关函数和辅助函数。

源码中写了大量且详尽的注释。

## 数据存储

在 MySQL 中，一个完整的数据存储过程总共有 4 步：

1. 创建数据库；
2. 确认字段；
3. 创建数据表；
4. 插入数据。

从系统架构层次上看，MySQL 数据库中从大到小依次是：

数据库服务器 -> 数据库 -> 数据表 -> 数据表的行与列

### 初始数据库

在安装 MySQL 服务器后**初始会自带 4 个数据库**：

* information_schema：保存 MySQL 服务器的系统信息，如数据库名称、表名称、字段名称、存取权限、数据文件所在目录等；
* performance_schema：监控 MySQL 的各类性能指标；
* sys：以一种更容易被理解的方式展示 MySQL 数据库服务器的各类性能指标，帮助系统管理员和开发者监控 MySQL 性能；
* mysql：保存数据库服务运行时的系统信息，如数据文件夹、当前使用的字符集、约束检查信息等。

## 数据操作

### 插入查询结果

MySQL 不仅支持向表中插入数据记录，还**支持向表中插入查询结果**。

举个实际场景，比如一个餐饮系统，有一张订单表 `order`，还有一张历史订单表 `order_history`。每天打烊了都会对当日订单进行结算，然后当日订单数据被插入到历史订单表中归档。

如果从 `order` 表中一条条取数据，然后再向 `order_history` 表一条条插数据，这样很低效。

有一个更高效的方式，先查询 `order` 表，再把查询结果一次性插入到 `order_history` 表。

插入查询结果的 SQL 语法：

```sql
INSERT INTO 表名 (字段列表)
SELECT 字段名或值
FROM 表名
WHERE 条件;
```

那在这个餐饮系统的场景，可以这样执行 SQL 语句（伪代码）：

```sql
INSERT INTO order_history (clearing_date, order_id, seat_number, ...)
SELECT 获取当前时间函数, order_id, seat_number, ...
FROM order;
```

其中，`clearing_date` 字段表示“日结时间”，这个字段只在历史订单表里有，其他字段两个表均相同。

在上面这种场景下，两个字段高度一致的表，通过将查询结果一次性插入表的方式可以大大提高插入效率。

### 删除数据

如果要使用 `DELETE` 硬删除数据，那么一定要加上条件语句 `WHERE`，防止误操作：

```sql
DELETE FROM 表名 WHERE ...;
```

## 怎么用好主键

MySQL 表的主键，是表中的一个字段或者几个字段的组合。它主要有 3 个特征：

1. 必须唯一，不能重复；
2. 不能是空；
3. 必须可以唯一标识数据表中的记录。

虽然 MySQL 也允许创建没有主键的表，但推荐总是给表设置主键，因为主键可以帮助减少错误数据，并提高查询速度

设置主键一般会想到 3 个维度：

* 用业务字段做主键；
* 用自增字段做主键；
* 为字段手动赋值做主键；

先放结论：

**不要使用业务字段做主键**。为什么？因为往往程序员把系统想的很完美，但实际情况可能会偏离理想情况很远。

比如一个理发店的会员管理系统，会员表中可以用“会员卡号”做主键么？

并不能，可能大多人认为会员卡号不会重复，但是如果商家收回了 A 的会员卡，然后把这张卡送给了 B，那么会员卡号还是同样的，但是前后代表的客户已经不同了。

同样，“电话号码”也往往不能作为主键，虽然他是唯一的，但也有可能被运营商收回后再发给其他人。

而且，像“电话号”、“邮箱”、“身份证号”这种，人家客户也不一定愿意给你，所以这些涉及个人隐私的字段在表设计时都要允许为空。

所以，不要用和业务相关的字段做主键，因为业务场景往往是多变的。

再来谈谈“用自增字段做主键”。**对于只有 1 个 MySQL 数据库的小型项目，使用自增字段做主键是没问题的**，因为自增字段与业务无关，而且唯一。

但对于涉及多个 MySQL 数据库的大型项目来说，一些场景并不推荐使用自增字段做主键。

比如接着理发店的例子，后面理发店做大做强了，整了个全国连锁，好多城市都有该品牌的理发店。如果这些当地的理发店，都用自增的 `id` 做主键，那等到将会员信息上传汇总到总部数据库的时候，就会出现 `id` 冲突，如图：

**在多库场景下，如果要避免不同库之间的主键冲突，就要使用手动赋值字段做主键了**。

当有新的理发店客户成为会员时，我们手动地对 `id` 字段赋值。步骤如下：

1. 先查询总部数据库，得到当前全国会员 `id` 最大值；
2. 用 `id` 最大值 +1，作为地方数据库（如图中的天津和平区分店数据库）新添加的会员 `id`；
3. 添加成功后，别忘了更新总部数据库中的 `id` 最大值。

我画了张图表示这个过程：

这样，无论有多少个分店，在添加新会员时都会查询总部数据库，拿到最新的 `id` 最大值，从而避免了不同库之间字段冲突的问题。

## 关联查询

把分散在多个表中的数据一次性查询出来，就是关联查询（也叫多表查询）。为了将表与表关联，要用到两个功能，它们的使用阶段不同：

* 外键（`FOREIGN KEY`）：「设计表」阶段就定义好；
* 连接（`JOIN`）：「查询」阶段进行表之间的连接。

### 主表 VS 从表

当表与表产生关联时，很多人对谁是主表、谁是从表分不清。

举个现实场景，一个班级里面有很多学生，那么班级表和学生表的字段如图：

班级和学生的关系是“一对多”，即一个班可以有多个学生。班级表和学生表通过公共字段“班级 ID”进行了关联。

* **主表：公共字段作为主键的表是主表**。“班级 ID”在班级表中是主键，所以班级表是主表，学生表是从表；
* **外键：从表中用于引用主表数据的公共字段，外键约束均在从表中定义**。每个学生都有一个“班级 ID”字段用来引用所属的班级信息，那么这个学生表中的“班级 ID”就是外键。

创建表的关联关系后，对于**删除操作**需要额外注意。MySQL 会根据外键约束来监控主、从表，如果从表中某条记录的外键引用了主表的某条记录，当主表的这条被引用记录要删除时，默认 MySQL 会报错。这样做主要是为了避免因为主表记录的删除，导致从表关联引用的数据丢失。如图：

> PS：外键约束信息存储在安装 MySQL 自带的 `information_schema` 数据库中。

### 内连接 VS 外连接

MySQL 的连接分两种：

* 内连接（`INNER JOIN`）：查询仅得到两个关联表中满足连接条件的记录
* 外连接（`OUTER JOIN`）：查询得到一个表中的所有记录，及另一个表中满足连接条件的记录

而外连接又可以分两种：

* 左连接（`LEFT JOIN`）：查询得到左表中所有记录，及右表中满足连接条件的记录
* 右连接（`RIGHT JOIN`）：查询得到右表中所有记录，及左表中满足连接条件的记录

这里的左和右，指的是 SQL 语句中关键字 `LEFT JOIN` 和 `RIGHT JOIN` 的左右，表示查询结果以关键字左右哪边的表为主，后文会详细展开讲解。

#### 内连接例子

继续举实际的例子，班级表 `classes` 和 学生表 `students` 的关系是一对多。

现在有两个班级和两个学生，如图：

这两个表通过公共字段 `classId` 进行了关联。我们现在想要通过一次查询，同时拿到学员和其所在班级的信息。

如果执行内连接查询，连接条件是两个表的 `classId` 相同，那么 SQL 语句是：

```sql
SELECT
  s.studentId, -- 查询出学生信息
  s.studentName,
  s.age,
  s.sex,
  c.className, -- 查询出班级信息
  c.startDate
FROM
  demo.students AS s -- 给 demo.students 表起个别名 s
JOIN
  demo.classes AS c ON (s.classId = c.classId);
```

执行后得到查询结果：

studentId | studentName | age | sex | className | startDate
-- | -- | -- | -- | -- | --
1 | 冯宝宝 | 307 | 女 | LOL零基础入门1班 | 2021-10-21 00:00:00

因为两表中满足 `classId` 相同的记录仅有一条，所以就仅得到了这一条。这就是内连接。

#### 外连接的左连接例子

继续这个例子，如果用外连接，那么会查询得到一个表的完整记录，来看一个左连接的 SQL：

```SQL
SELECT
  s.studentId, -- 查询出学生信息
  s.studentName,
  s.age,
  s.sex,
  c.className, -- 查询出班级信息
  c.startDate
FROM
  demo.students AS s -- 给 demo.students 表起个别名 s
LEFT JOIN
  demo.classes AS c ON (s.classId = c.classId);
```

整个 SQL 语句和内连接相比，只多了个 `LEFT`，其余都一样。

查询结果：

studentId | studentName | age | sex | className | startDate
-- | -- | -- | -- | -- | --
1 | 冯宝宝 | 307 | 女 | LOL零基础入门1班 | 2021-10-21 00:00:00
2 | 张楚岚 | 22 | 男 | NULL | NULL

可以看到，左连接把 SQL 中 `LEFT JOIN` 左侧的 `students` 表的所有记录都查出来了，继而右侧 `classes` 表仅带出了满足 `classId` 相同的记录信息。

#### 外连接的右连接例子

其实到这，你可以猜猜如果上边的 SQL 改成右连接，查询结果会怎样。

右连接 SQL：

```sql
SELECT
  s.studentId, -- 查询出学生信息
  s.studentName,
  s.age,
  s.sex,
  c.className, -- 查询出班级信息
  c.startDate
FROM
  demo.students AS s -- 给 demo.students 表起个别名 s
RIGHT JOIN
  demo.classes AS c ON (s.classId = c.classId);
```

查询结果：

studentId | studentName | age | sex | className | startDate
-- | -- | -- | -- | -- | --
1 | 冯宝宝 | 307 | 女 | LOL零基础入门1班 | 2021-10-21 00:00:00
NULL | NULL | NULL | NULL | LOL 进阶1班 | 2021-10-20 00:00:00

这回结果把 `RIGHT JOIN` 右侧的 `classes` 表的记录都查出来了，而左侧 `students` 表仅带出了满足条件的记录信息。和左连接正相反。

对于关联查询，最后要说的就是**对于一般的中小型系统，如果两个表存在关联关系，请一定要定义外键约束**！虽然不定义外键也可以进行连表查询，但**定义外键约束能有效避免误删**（比如班级数据删了，但是某个学生的 `classId` 还引用了这个班），从而提高系统的一致性。

不过，**对于超大型系统的中央数据库，定义过多的外键约束会在高并发场景下因大量系统开销而变慢，但这种场景下即便不在 MySQL 数据库层面定义外键约束，也要在应用层面通过程序来实现外键约束的功能，从而确保系统数据的一致性**。

## 区分 `WHERE` 与 `HAVING`

`WHERE` 和 `HAVING` 作为条件语句，都能对查询结果进行条件筛选：

* `WHERE`：对表中字段进行限定，筛选查询结果；
* `HAVING`：同分组关键字 `GROUP BY` 配合使用，通过分组字段/分组计算函数进行限定，筛选查询结果。

有些场景下，用 `WHERE` 和 `HAVING` 都能得到查询结果，但两种方式的查询效率却截然不同。

### `WHERE` 执行过程剖析

如果想彻底分清 `WHERE` 和 `HAVING`，那么一定要搞清楚它们的执行过程。

举个用 `WHERE` 的例子咱们一起来分析分析。入学后，学生要进行考试，一次考试中细分了不同的考试科目，表结构如图：

我把外键用黄色标了出来，可以看到考试表 `exams` 与学生表 `students` 和考试详情表 `exam_details` 都有关联。

提个需求，如果想查询考试分数小于 60 分的考试信息，看看是谁考的那么烂、都用了哪些英雄，这就要用到 `WHERE` 语句了。

联表查询的 SQL 语句如下：

```sql
SELECT
	e.examDate,
	e.examName,
	e.goal,
	s.studentName,
	ed.hero
FROM
	demo.exams AS e
JOIN
	demo.students AS s ON (e.studentId = s.studentId)
JOIN
	demo.exam_details AS ed ON (e.examId = ed.examId)
WHERE
	e.goal < 60;
```

得到的查询结果：

examDate | examName | goal | studentName | hero
-- | -- | -- | -- | --
2021-10-22 00:00:00 | LOL手游入学测试 | 32 | 张楚岚 | 诺手
2021-10-22 00:00:00 | LOL手游入学测试 | 32 | 张楚岚 | 蛮王

MySQL 进行这次 `WHERE` 查询有下面两步：

1. 先从考试表 `exams` 中筛出满足分数 < 60 的记录；
2. 分别连接学生表 `students` 拿到学生名，连接考试详情表 `exam_details` 拿到使用的英雄，返回查询结果。

如果用 SQL 语句来模拟上面的步骤，

那么**第一步，“先从考试表 `exams` 中筛出满足分数 < 60 的记录”的 SQL**：

```sql
SELECT *
FROM
	demo.exams AS e
WHERE
	e.goal < 60;
```

得到结果：

examId | examName | studentId | goal | examDate
-- | -- | -- | -- | --
2 | LOL手游入学测试 | 2 | 32 | 2021-10-22 00:00:00

然后**进行第二步，连接关联表拿数据，返回结果**

```SQL
SELECT
	e.examDate,
	e.examName,
	e.goal,
	s.studentName,
	ed.hero
FROM
	demo.exams AS e
JOIN
	demo.students AS s ON (e.studentId = s.studentId)
JOIN
	demo.exam_details AS ed ON (e.examId = ed.examId)
WHERE
	e.examId = 2; -- 上一步已经拿到了成绩小于 60 分的考试 ID
```

由此，我们归纳下 `WHERE` 的执行特点：

* 可以直接使用表的字段进行条件筛选；
* 先通过 `WHERE` 条件筛选，然后用一个范围更小的数据集进行连接，再拿到关联表数据。

### `GROUP BY` 对数据分组

`HAVING` 是同 `GROUP BY` 配合使用的，要想理解 `HAVING`，首先要搞明白 `GROUP BY`。**`GROUP BY` 可以对数据进行分组，从而可以对组内数据进行统计**。

继续学生考试的例子，如果想要看看这3天考试中，每天由学生们产生的总击杀数、总死亡数，就可以用分组查询了：

```sql
SELECT
	e.examDate,
	SUM(ed.killCount), -- 统计分组下的总击杀数
	SUM(ed.dieCount) -- 统计分组下的总死亡数
FROM
	demo.exams AS e
JOIN
	demo.exam_details AS ed ON (e.examId = ed.examId)
GROUP BY
	e.examDate; -- 按不同的考试日期分组
```

查询结果：

examDate | SUM(ed.killCount) | SUM(ed.dieCount)
-- | -- | --
2021-10-22 00:00:00 | 27 | 16
2021-10-28 00:00:00 | 24 | 6
2021-11-08 00:00:00 | 44 | 7

通过分组，在 `exams` 表中本来 3 天 6 条的考试记录，按考试日期分组后，得到了 3 天 3 条考试记录。

### `WHERE` 与 `HAVING` 的区别

了解了 `WHERE` 和 `HAVING` 的执行过程，那么就能 Get 到它们的显著区别了：

* **对于关联表查询场景，`WHERE` 是先筛选，后连接，而 `HAVING` 是先连接，后筛选**；
* **`HAVING` 可以配合分组计算函数和分组字段作为筛选条件，而 `WHERE` 不支持，所以对于分组统计场景，`HAVING` 能搞定 `WHERE` 搞不定的需求**。

**在关联查询场景下，`WHERE` 比 `HAVING` 更高效**，因为 `WHERE` 先进行筛选后可以得到一个较小的数据集，然后再进行关联表的连接，这样占用的资源更少。`HAVING` 是先通过连接，将所有可能的结果都准备出来，然后再在这个大的结果集里筛选，这样占用的资源更多。

所以在实际区分它们的使用时，要具体问题具体分析。`WHERE` 带来了更高的关联表查询效率，而 `HAVING` 带来了更多的分组统计功能，它们各有千秋。

## 其他资源推荐

* [SQL 编码规范指南](https://www.sqlstyle.guide/zh/)；
