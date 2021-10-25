# MySQL 最佳实践之联表查询

把分散在多个表中的数据一次性查询出来，就是关联查询（也叫多表查询）。为了将表与表关联，要用到两个功能，它们的使用阶段不同：

* 外键（`FOREIGN KEY`）：「设计表」阶段就定义好；
* 连接（`JOIN`）：「查询」阶段进行表之间的连接。

## 主表 VS 从表

当表与表产生关联时，很多人对谁是主表、谁是从表分不清。

举个现实场景，一个班级里面有很多学生，那么班级表和学生表的字段如图：

班级和学生的关系是“一对多”，即一个班可以有多个学生。班级表和学生表通过公共字段“班级 ID”进行了关联。

* **主表：公共字段作为主键的表是主表**。“班级 ID”在班级表中是主键，所以班级表是主表，学生表是从表；
* **外键：从表中用于引用主表数据的公共字段，外键约束均在从表中定义**。每个学生都有一个“班级 ID”字段用来引用所属的班级信息，那么这个学生表中的“班级 ID”就是外键。

创建表的关联关系后，对于**删除操作**需要额外注意。MySQL 会根据外键约束来监控主、从表，如果从表中某条记录的外键引用了主表的某条记录，当主表的这条被引用记录要删除时，默认 MySQL 会报错。这样做主要是为了避免因为主表记录的删除，导致从表关联引用的数据丢失。如图：

> PS：外键约束信息存储在安装 MySQL 自带的 `information_schema` 数据库中。

## 内连接 VS 外连接

MySQL 的连接分两种：

* 内连接（`INNER JOIN`）：查询仅得到两个关联表中满足连接条件的记录
* 外连接（`OUTER JOIN`）：查询得到一个表中的所有记录，及另一个表中满足连接条件的记录

而外连接又可以分两种：

* 左连接（`LEFT JOIN`）：查询得到左表中所有记录，及右表中满足连接条件的记录
* 右连接（`RIGHT JOIN`）：查询得到右表中所有记录，及左表中满足连接条件的记录

这里的左和右，指的是 SQL 语句中关键字 `LEFT JOIN` 和 `RIGHT JOIN` 的左右，表示查询结果以关键字左右哪边的表为主，后文会详细展开讲解。

### 内连接例子

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

### 外连接的左连接例子

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

### 外连接的右连接例子

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

### `HAVING` 的执行过程剖析

新需求又来了，想知道在所有科目考试中，出现了 3 次的英雄有哪些，该怎么办？

这就没法通过 `WHERE` 简单得到结果了，因为只有先分别按不同的英雄分组后，才知道每组中英雄用了多少次，再从分组结果中找出出现了 3 次的英雄。

SQL 如下：

```sql
SELECT
	ed.hero
FROM
	demo.exams AS e
JOIN
	demo.exam_details AS ed ON (e.examId = ed.examId)
GROUP BY
	ed.hero
HAVING count(*) = 3; -- 筛选使用了 3 次英雄，也就是按英雄分组后，组内有 3 条记录
```

查询结果：

hero |
-- |
盖伦
易

在 SQL 的查询语法结构中，`WHERE` 要放在 `GROUP BY` 之前，这就决定了 `WHERE` 是没法用分组结果进行筛选的，而 `HAVING` 放在 `GROUP BY` 之后，`HAVING` 能做到。

那 `HAVING` 的执行过程又是怎样的呢？

1. 先将关联表连接起来，拿到所有记录；
2. 按分组字段分组；
3. 分组后再按 `HAVING` 的条件筛选，返回查询结果。

同样我用 SQL 模拟一下这 3 步。

**第一步，将关联表连接起来，拿到所有记录**：

```sql
SELECT
	e.*, ed.*
FROM
	demo.exams AS e
JOIN
	demo.exam_details AS ed ON (e.examId = ed.examId);
```

得到连接后的所有记录 12 条（6 场考试 x 每场考试 2 个科目 = 12 条）：

examId | examName | studentId | goal | examDate | id | hero | subject | killCount | dieCount | subjectGoal | examId(1)
-- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | --
1 | LOL手游入学测试 | 1 | 93 | 2021-10-22 00:00:00 | 1 | 盖伦 | 单人路对线 | 6 | 0 | 43 | 1
1 | LOL手游入学测试 | 1 | 93 | 2021-10-22 00:00:00 | 2 | 蛮王 | 打野Gank | 18 | 0 | 50 | 1
2 | LOL手游入学测试 | 2 | 32 | 2021-10-22 00:00:00 | 3 | 诺手 | 单人路对线 | 1 | 6 | 24 | 2
2 | LOL手游入学测试 | 2 | 32 | 2021-10-22 00:00:00 | 4 | 蛮王 | 打野Gank | 2 | 10 | 8 | 2
3 | LOL手游进阶测试 | 1 | 96 | 2021-10-28 00:00:00 | 5 | 易 | 单人路对线 | 10 | 0 | 48 | 3
3 | LOL手游进阶测试 | 1 | 96 | 2021-10-28 00:00:00 | 6 | 易 | 打野Gank | 7 | 1 | 48 | 3
4 | LOL手游进阶测试 | 2 | 76 | 2021-10-28 00:00:00 | 7 | 盖伦 | 单人路对线 | 4 | 1 | 43 | 4
4 | LOL手游进阶测试 | 2 | 76 | 2021-10-28 00:00:00 | 8 | 易 | 打野Gank | 3 | 4 | 33 | 4
5 | LOL手游毕业测试 | 1 | 99 | 2021-11-08 00:00:00 | 9 | 刀锋 | 单人路对线 | 12 | 0 | 50 | 5
5 | LOL手游毕业测试 | 1 | 99 | 2021-11-08 00:00:00 | 10 | 盲僧 | 打野Gank | 18 | 2 | 49 | 5
6 | LOL手游毕业测试 | 2 | 88 | 2021-11-08 00:00:00 | 11 | 盖伦 | 单人路对线 | 6 | 2 | 46 | 6
6 | LOL手游毕业测试 | 2 | 88 | 2021-11-08 00:00:00 | 12 | 盲僧 | 打野Gank | 8 | 2 | 42 | 6

**第二步，按分组字段分组**

按英雄名分组，那么就是把这 12 条记录中，相同英雄名的归为一组，分组情况如下：

第 1 组-盖伦：

examId | examName | studentId | goal | examDate | id | hero | subject | killCount | dieCount | subjectGoal | examId(1)
-- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | --
1 | LOL手游入学测试 | 1 | 93 | 2021-10-22 00:00:00 | 1 | 盖伦 | 单人路对线 | 6 | 0 | 43 | 1
4 | LOL手游进阶测试 | 2 | 76 | 2021-10-28 00:00:00 | 7 | 盖伦 | 单人路对线 | 4 | 1 | 43 | 4
6 | LOL手游毕业测试 | 2 | 88 | 2021-11-08 00:00:00 | 11 | 盖伦 | 单人路对线 | 6 | 2 | 46 | 6

第 2 组-蛮王：

examId | examName | studentId | goal | examDate | id | hero | subject | killCount | dieCount | subjectGoal | examId(1)
-- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | --
1 | LOL手游入学测试 | 1 | 93 | 2021-10-22 00:00:00 | 2 | 蛮王 | 打野Gank | 18 | 0 | 50 | 1
2 | LOL手游入学测试 | 2 | 32 | 2021-10-22 00:00:00 | 4 | 蛮王 | 打野Gank | 2 | 10 | 8 | 2

第 3 组-诺手：

examId | examName | studentId | goal | examDate | id | hero | subject | killCount | dieCount | subjectGoal | examId(1)
-- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | --
2 | LOL手游入学测试 | 2 | 32 | 2021-10-22 00:00:00 | 3 | 诺手 | 单人路对线 | 1 | 6 | 24 | 2

第 4 组-易：

examId | examName | studentId | goal | examDate | id | hero | subject | killCount | dieCount | subjectGoal | examId(1)
-- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | --
3 | LOL手游进阶测试 | 1 | 96 | 2021-10-28 00:00:00 | 5 | 易 | 单人路对线 | 10 | 0 | 48 | 3
3 | LOL手游进阶测试 | 1 | 96 | 2021-10-28 00:00:00 | 6 | 易 | 打野Gank | 7 | 1 | 48 | 3
4 | LOL手游进阶测试 | 2 | 76 | 2021-10-28 00:00:00 | 8 | 易 | 打野Gank | 3 | 4 | 33 | 4

第 5 组-刀锋：

examId | examName | studentId | goal | examDate | id | hero | subject | killCount | dieCount | subjectGoal | examId(1)
-- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | --
5 | LOL手游毕业测试 | 1 | 99 | 2021-11-08 00:00:00 | 9 | 刀锋 | 单人路对线 | 12 | 0 | 50 | 5

第 6 组-盲僧：

examId | examName | studentId | goal | examDate | id | hero | subject | killCount | dieCount | subjectGoal | examId(1)
-- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | --
5 | LOL手游毕业测试 | 1 | 99 | 2021-11-08 00:00:00 | 10 | 盲僧 | 打野Gank | 18 | 2 | 49 | 5
6 | LOL手游毕业测试 | 2 | 88 | 2021-11-08 00:00:00 | 12 | 盲僧 | 打野Gank | 8 | 2 | 42 | 6

**最后一步，按 `HAVING` 的条件去筛选分组结果，返回查询结果**

上面 6 组中，英雄使用了 3 次的是盖伦和易，查询的字段是英雄名。最终返回查询结果。

从 `HAVING` 的执行过程可以发现，**`HAVING` 是先连接查询所有记录，然后再分组，分组后进行筛选。而且 `HAVING` 是可以使用分组计算函数的**。

### `WHERE` 与 `HAVING` 可以同时使用

既然 `WHERE` 与 `HAVING` 执行过程是反着的，那是不是他俩在一段 SQL 中，用了一个，另一个就不会用了？答案是，可以一起使用。

我们把演示 `HAVING` 的需求再改一下，改成：在 10 月 22 号和 28 号这两次考试中，想知道所有科目考试中出现了 3 次的英雄有哪些。

我们加了个限定条件是“在 10 月 22 号和 28 号这两次考试中”，SQL 如下：

```sql
SELECT
	ed.hero
FROM
	demo.exams AS e
JOIN
	demo.exam_details AS ed ON (e.examId = ed.examId)
WHERE
	e.examDate IN ('2021-10-22', '2021-10-28') -- 限定在 10 月 22 号和 28 号这两次考试中
GROUP BY
	ed.hero
HAVING count(*) = 3; -- 筛选使用了 3 次英雄，也就是按英雄分组后，组内有 3 条记录
```

查询结果：

hero |
-- |
易

这种情况下，我们先通过 `WHERE` 限定考试日期是 10 月 22 号或 28 号，得到一个小的范围，然后再连接表，分组筛选挑出 3 次的英雄。简直妙不可言。

### `WHERE` 与 `HAVING` 的区别

了解了 `WHERE` 和 `HAVING` 的执行过程，那么就能 Get 到它们的显著区别了：

* **对于关联表查询场景，`WHERE` 是先筛选，后连接，而 `HAVING` 是先连接，后筛选**；
* **`HAVING` 可以配合分组计算函数和分组字段作为筛选条件，而 `WHERE` 不支持，所以对于分组统计场景，`HAVING` 能搞定 `WHERE` 搞不定的需求**。

**在关联查询场景下，`WHERE` 比 `HAVING` 更高效**，因为 `WHERE` 先进行筛选后可以得到一个较小的数据集，然后再进行关联表的连接，这样占用的资源更少。`HAVING` 是先通过连接，将所有可能的结果都准备出来，然后再在这个大的结果集里筛选，这样占用的资源更多。

所以在实际区分它们的使用时，要具体问题具体分析。`WHERE` 带来了更高的关联表查询效率，而 `HAVING` 带来了更多的分组统计功能，它们各有千秋。

## 配合分组进行高效统计

联表查询常常配合分组进行统计，要想进行高效地分组，前提是搞懂 MySQL 常用聚合函数的执行过程。

MySQL 中有 5 种较为常用的聚合函数：

* 求和函数：`SUM()`
* 求平均函数：`AVG()`
* 最大值函数：`MAX()`
* 最小值函数：`MIN()`
* 计数函数：`COUNT()`

### 求和函数 `SUM()` 执行过程剖析
