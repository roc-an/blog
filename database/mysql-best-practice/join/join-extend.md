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
