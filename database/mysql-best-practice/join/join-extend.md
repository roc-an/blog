# MySQL 最佳实践之联表查询（补充）

## 求平均函数：`AVG()`

`AVG` 是 average 的缩写，`AVG()` 函数会根据分组内对应字段的和，以及记录数，求得平均值。

还是学生考试的例子，库表结构如图：

如果要统计每天考试的击杀数平均值，并按降序排列，那么 SQL：

```sql
SELECT
	LEFT(e.examDate, 10), -- 取考试间字符串的左边 10 个字符，得到年月日
	AVG(ed.killCount) -- 对分组内的击杀数求平均
FROM
	demo.exams AS e
JOIN
	demo.exam_details AS ed ON (e.examId = ed.examId)
GROUP BY
	e.examDate
ORDER BY
	AVG(ed.killCount) DESC;
```

得到查询结果：

LEFT(e.examDate, 10) | AVG(ed.killCount)
-- | --
2021-11-08 | 11.0000
2021-10-22 | 6.7500
2021-10-28 | 6.0000

## 最大值函数：`MAX()` 和最小值函数：`MIN()`

我们以求最大值 `MAX()` 为例，如果要查询每天考试中的最大死亡数，并按降序排列，那么 SQL：

```sql
SELECT
	LEFT(e.examDate, 10), -- 取考试间字符串的左边 10 个字符，得到年月日
	MAX(ed.dieCount) -- 对分组内的死亡数求最小值
FROM
	demo.exams AS e
JOIN
	demo.exam_details AS ed ON (e.examId = ed.examId)
GROUP BY
	e.examDate
ORDER BY
	MAX(ed.dieCount) DESC;
```

得到查询结果：

LEFT(e.examDate, 10) | MAX(ed.dieCount)
-- | --
2021-10-22 | 10
2021-10-28 | 4
2021-11-08 | 3

求最小值函数 `MIN()` 的使用与 `MAX()` 类似，不再赘述。

## 计数函数：`COUNT()`

通过 `COUNT()` 函数可以计算数据集记录的条目。

`COUNT()` 常用于分页场景，计算出符合条件的记录一共有多少条，然后结合前端要求的每页显示几条数据，才能计算出一共有多少页。

`COUNT()` 的两种使用方式：

1. `COUNT(*)`：统计一共有多少条记录；
2. `COUNT(字段)`：统计一共有多少个非空字段值。

### `COUNT(*)` 的使用

如果要统计这些考试中，不同英雄分别出场了几次，那么 SQL：

```sql
SELECT
	ed.hero,
	COUNT(*)
FROM
	demo.exams AS e
JOIN
	demo.exam_details AS ed ON (e.examId = ed.examId)
GROUP BY
	ed.hero;
```

查询结果：

hero | COUNT(*)
-- | --
盖伦 | 3
蛮王 | 2
诺手 | 1
易 | 3
刀锋 | 1
盲僧 | 2

在这个例子中，`COUNT(*)` 与分组 `GROUP BY` 配合使用，统计的是每组中的记录数。如果不配合分组使用，那就是统计整个数据集的记录数，相当于只有 1 组。
