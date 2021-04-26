# MySQL 数据库边学边练光速入门

## （一）MySQL 数据库的一二事

### 数据库是什么

简单说，**数据库就是存储和管理数据的仓库**。用户可以对其中的数据进行增、删、改、查。

数据可以存在内存中呀，为什么需要数据库？

* 一旦电脑死机、断电或者程序意外退出，内存中的数据还没来及保存，不就没了吗

那数据也可以存在文本文件中呀，为什么需要数据库？

* 文件的读和写是相对较慢的
* 数据量变大后，数据与数据之间的关系变得难以维护
* 访问数据的用户变多后，这么多人对同一个文件进行读/写数据又怎么确保不出问题？
* 硬盘坏了数据丢了怎么办？需要高效的方式来数据备份

所以，需要数据库这类更加专业的工具来存储和管理宝贵的数据。

数据库是企业非常珍贵的财产，一不小心删了库，那只能想办法跑路了~

### MySQL 是关系型数据库

MySQL 目前属于 Oracle（甲骨文）公司，它是一种关系型数据库，使用二维表（比如 Excel 表格）的结构，来存储实体信息，以及实体与实体之间的联系。

比如一张记录了王者荣耀英雄的表，可以是这样的：

| id | name | age | sex | desc |
| -- | -- | -- | -- | -- |
| 1 | "曜" | 18 | "男" | "剑指的方向，就是天才的故乡。" |
| 2 | "孙尚香" | 17 | "女" | "来一发吗，满足你。" |
| 3 | "夏侯惇" | 28 | "男" | "独眼，是男人的浪漫。" |

至于非关系型数据库（NoSQL），比如 MongoDB，很适合用来处理用户操作日志、地理位置信息、社交记录等这类数据量庞大、却又没有复杂关系的数据

在 Web 应用中，最广泛使用的就是 MySQL，它的优势：

* 开源、免费：能力强的公司甚至可以在 MySQL 基础上做二次开发，增强性能
* 功能强大，功能足以应对绝大多数的使用场景，支持千万级别的并发访问

### 基本术语

一个「数据库」是由多张「数据表」（简称“表”）组成的，一张表中又分了「行」和「列」，一行数据就视作一条「记录」。

* 数据库（DataBase）：存储和管理数据的仓库；
* 表（Table）：数据库中的数据集合都放在表（二维表）内；
* 行（Row）和列（Column）：数据表由数据行和数据列构成；
* 记录（Record）：一个数据行就是一个条记录；
* 字段（Field）：记录内的每个列，就是一个字段；

Q：SQL 又是什么？SQL 和 MySQL 有什么关系？
A：SQL 是一门语言，用这门语言可以访问和处理数据库。所以 SQL 和 MySQL 的关系就是——可以用 SQL 语句处理 MySQL 中的数据。

后文会讲解 SQL 语句的基本使用。

### 下载和安装

#### MySQL 安装

这里是 MySQL 的 [官网](https://www.mysql.com)，可以通过官网的 [下载页](https://dev.mysql.com/downloads/mysql/) 根据自己电脑的系统选择下载安装。

#### PhpStudy 安装（可选）

通过 [PhpStudy](https://www.xp.cn) 来安装 MySQL 也是可以的，全中文，对新手非常友好。除了 MySQL 数据库，还提供了 Apache 服务器、FTP、Nginx 代理等模块，傻瓜式配置，上手非常轻松。
#### 数据库可视化操作工具安装

平时浏览数据库中的数据不可能每次都输入一堆 SQL 语句，既花时间又容易出错，这时候一款可视化工具就尤为重要了，它可以大大提高咱们平时学习、使用数据库的效率。

推荐2款市面上常用的数据库可视化工具：

1. Navicat：[http://www.navicat.com.cn](http://www.navicat.com.cn)，支持 MySQL、MongoDB、Oracle 等多达7种数据库。价格比较贵，有能力的朋友还是推荐支持下正版。对于没有收入来源的学生党，白嫖版网上也是有的；
2. MySQL Workbench：[MySQL Workbench](https://www.mysql.com/cn/products/workbench/)，MySQL 官方提供的，免费，同样支持 Windows/Mac OS X/Linux 等各平台。功能同 Navicat 类似，提供数据建模、SQL 开发、服务器配置、用户管理、备份等工具，对数据库进行可视化操作。

这些软件按照提示下载安装即可，遇到安装问题可以在网上搜搜，相关教程有很多，不再赘述。

## （二）使用 Navicat 对数据库进行基本操作

这里以 Navicat 为例做演示，可视化工具之间功能和操作都类似，一通百通。

### 创建连接

数据库下载安装后，设置初始的用户名密码。

然后打开 Navicat，找到「连接」，点击选择 MySQL，先创建与数据库的连接：

输入连接名，这里叫 `hello-mysql`，输入数据库的密码，保存。
### 创建数据库

双击连接可以打开连接，里面初始已经有一些数据库了，不用管它们。

在连接上点右键 -> 新建数据库。

给数据库起名字，这里叫 `test`，字符集选 utf-8，排序规则选第一个，保存。

### 创建表

在界面上双击数据库可以「打开数据库」，在「表」上右键 -> 新建表。

之后就可以在右侧的表操作界面，为表「添加字段」，如图：

其中：

* `id`：`int` 类型，整数;
  * 长度就用默认的 0 就好（MySQL 还是会采用 11 位，这里对于 `int` 类型指的是显示宽度）;
  * 设为主键（整个表每条记录的主键值是唯一的，不允许重复）；
  * 选中，勾选下方的「自动递增」；
* `name`：姓名。`varchar` 类型，字符串，长度设成 10；
* `age`：年龄。`int` 类型，整数；
* `sex`：性别。`varchar` 类型，字符串，长度设成 1；
* `desc`：描述。`text` 类型，长文本，长度默认 255；
* `ctime`：创建时间。`timestamp` 类型，时间戳，设置默认值为 `CURRENT_TIMESTAMP`，即当前时间的时间戳；

添加字段后点击「保存」，或者直接 CTRL + S，输入表名 `user`，创建表成功。

### 添加记录

在表界面右键 -> 添加记录。

按照之前设定的字段类型，输入各字段数据：

其中 `id` 和 `ctime` 不用手动输入，因为咱们设了 `id` 值自增，`ctime` 默认值是当前时间的时间戳。

### 删除表

想删除一个表非常简单，在表上右键 -> 删除表。

先放心大胆地删，后面会学习用 SQL 来创建表。

## （三）常用数据类型

MySQL 支持多种数据类型，主要分为 3 类：

* 数值
* 字符串
* 时间日期

较常用的数据类型举例：

* `varchar(50)`：字符串
* `int`：整数
* `timestamp`：时间戳
* `text`：长文本

完整的数据类型，可以参考 [MySQL Data Types](https://dev.mysql.com/doc/refman/8.0/en/data-types.html)

下面对数值、字符串、时间日期这3种数据类型进行展开，这块内容简单了解即可

### 数值类型

* `TINYINT`：小整数值，1 byte
* `SMALLINT`：大整数值，2 bytes
* `MEDIUMINT`：大整数值，3 bytes
* `INT` 或 `INTEGER`：大整数值，4 bytes
* `BIGINT`：极大整数值，8 bytes

* `FLOAT`：单精度浮点值，4 bytes
* `DOUBLE`：双精度浮点值，8 bytes
* `DECIMAL`：小数值。大小计算，对 DECIMAL(M, D) ，如果 M > D，为 M + 2 否则为 D + 2

### 字符串类型

* `CHAR`：定长字符串
* `VARCHAR`：变长字符串

* `TINYBLOB`：不超过 255 个字符的二进制字符串
* `BLOB`：二进制形式的长文本数据
* `MEDIUMBLOB`：二进制形式的中等长度文本数据
* `LONGBLOB`：二进制形式的极大文本数据

* `TINYTEXT`：短文本字符串
* `TEXT`：长文本数据
* `MEDIUMTEXT`：中等长度文本数据
* `LONGTEXT`：极大文本数据

### 时间日期类型

* `DATE`：日期值，格式 `YYYY-MM-DD`，3 bytes
* `TIME`：时间值或持续时间，格式ß `HH:MM:SS`，3 bytes
* `YEAR`：年份值，格式 `YYYY`，1 bytes
* `DATETIME`：混合日期和时间值，格式 `YYYY-MM-DD HH:MM:SS`，8 bytes
* `TIMESTAMP`：时间戳，混合日期和时间值，格式 `YYYYMMDD HHMMSS`，4 bytes

可以发现不同的数据类型所占用的字节大小是不同的，因此在实际业务中，合理定义数据字段的类型对于数据库的优化是十分重要的。

## （四）SQL 基础语句

### 什么是 SQL

SQL 是结构化查询语言（Structured Query Language）的简称，执行 SQL 语句可以操作数据库。

当然：

* 虽然叫“查询语言”，不仅仅可以查询，还可以增、删、改；
* 也不仅仅只能操作数据库，数据库中的表、表中的数据都是可以操作的。

另外，SQL 是各个数据库都要遵循的规范，虽然各数据库厂商都有一些自己特有的内容，但核心内容都是一致的。

### 使用 Navicat 执行 SQL 语句

在 Navicat 上方点击「新建查询」，然后输入 SQL 语句后点击「运行」按钮就可以执行 SQL 语句。

下图是创建 `user` 表的 SQL 语句：

执行后，也可以 CTRL + S 将这段 SQL 语句保存，留作后续简单修改后再次执行。

### 创建表

语法：

``` sql
CREATE TABLE 表名(
  字段1 类型 [可选修饰符],
  字段2 类型 [可选修饰符]
  ...
);
```

SQL 示例，创建一个 `user` 表：

``` sql
CREATE TABLE `user`(
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(10),
  `age` INT,
  `sex` VARCHAR(1),
  `desc` TEXT,
	`ctime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

其中：

* 将字段 `id` 设为主键（`PRIMARY KEY`），主键值不允许重复，另外也设成了自增的（`AUTO_INCREMENT`），这样新增一条记录后，该记录的 `id` 就会自动加1；
* 对字段 `ctime` 使用了 `DEFAULT` 约束来设置「默认值」，在创建新记录时把这个字段设置为当前时间的时间戳（`CURRENT_TIMESTAMP`）。

为什么 SQL 语句中的字段要加反斜杠（`）呢？

因为示例中比如 `desc` 这个字段名和 SQL 关键字 `desc` 冲突了，表示降序排列，所以加了反斜杠（`）用以表示字段名叫 desc。

### 向表中新增一条记录

使用 `INSERT INTO` 这个 SQL 语句来新增记录。

语法：

``` sql
INSERT INTO 表名
  (字段1, 字段2, ...)
  VALUES
  (值1, 值2, ...);
```

其中，`字段1`和`值1`对应，`字段2`与`值2`对应，以此类推，支持插入多个字段和对应值。

SQL 示例：

``` sql
INSERT INTO `user`
  (`name`, `age`, `sex`, `desc`)
  VALUES
  ("花木兰", 19, "女", "谁说女子不如男。");
```
新增成功后，可以看 SQL 运行结果：`Affected rows: 1, Time: 0.001000s`，看到结果显示影响了1行数据，说明新增记录成功。

接着，可以修改 SQL，多新增几条记录，如图：

### 修改记录

用 `UPDATE` 语句对表中的数据进行更新。

语法：

``` sql
UPDATE 表名 SET 字段1=值1, 字段2=值2 [可选的 WHERRE 语句]
```

其中：

* 可以同时更新一个或多个字段；
* 可以在 `WHERE` 子句中指定条件，如果不加 `WHERE` 则更新所有记录。

要更新数据表中指定行的数据时 `WHERE` 子句是非常有用的。

SQL 示例：

``` sql
UPDATE user SET `age`=34, `desc`="真相只有一个。" WHERE `id`=8;
```

### 删除记录

用 `DELETE` 删除表中的数据记录。

语法：

``` sql
DELETE FROM 表名 [可选的 WHERE 语句];
```

其中，如果没有指定 `WHERE` 子句，表中所有记录都会被删。

SQL 示例：

``` sql
DELETE FROM user WHERE `id`=7;
```

删除 `user` 表中 `id` 为7的那条记录。

### 查询记录

语法：

``` sql
SELECT 字段1, 字段2
  FROM 表名
  [可选的 WHERE 语句]
```

其中：

* `SELECT` 命令可以读取多条字段；
* 可以用 `*` 来代替所有字段，这样会返回所有字段数据；
* 可以用 `WHERE` 语句可以包含条件；

SQL 示例，查询 `user` 表中指定字段的记录：

``` sql
SELECT name, age FROM user;
```

SQL 示例，查询 `user` 表中所有字段的记录：

``` sql
SELECT * FROM user;
```

### WHERE 语句

使用 `WHERE` 从表中查询数据的通用语法：

``` sql
SELECT 字段1, 字段2
  FROM 表名
  [WHERE 条件1 [AND [OR]] 条件2...]
```

其中：

* 可以用 `AND` 或者 `OR` 指定一个或多个条件；
* `WHERE` 子句也可以用于 `DELETE` 或 `UPDATE` 语句；
* `WHERE` 子句类似程序语言中的 `if` 条件，它根据 MySQL 表中的字段值来读取指定的数据；
* 用主键来作为 `WHERE` 子句的条件查询是非常快的。

另外，可用于 `WHERE` 子句中的操作符：

* `=`：等于
* `<>` 或 `!=`：不等于
* `>`：大于
* `<`：小于
* `>=`：大于等于
* `<=`：小于等于

在 `WHERE` 子句中使用操作符的 SQL 示例：

``` sql
SELECT * FROM user WHERE `age` >= 20;
```

执行后会查询出 `user` 表中所有 `age` 大于等于 20 的记录。

### LIKE 语句

可以用 `LIKE` 子句按指定模式进行模糊匹配。

语法：

``` sql
SELECT 字段1, 字段2
  FROM 表名
  WHERE 字段名 LIKE 匹配模式
```

其中：

* 可以在 `WHERE` 子句中使用 `LIKE` 子句；
* `LIKE` 通常与 `%` 一同使用，`%` 表示匹配任意字符；
* 可以用 `AND` 或者 `OR` 指定一个或多个条件；
* 还可以在 `DELETE` 或 `UPDATE` 中使用 `WHERE...LIKE` 子句。

示例：

``` sql
SELECT * FROM user WHERE `desc` LIKE "%男%";
```

上面这条 SQL 会查询 `user` 表中所有 `desc` 字段含有“男”字的数据记录。

### AND、OR 和 IN 操作符

`WHERE` 语句也常常与 `AND`、`OR` 以及 `IN` 这 3 个 SQL 操作符配合使用：

* `AND`：且。示例：```SELECT * FROM user WHERE `desc` LIKE "%男%" AND `age` >= 30;```
* `OR`：或。示例：```SELECT * FROM user WHERE `desc` LIKE "%男%" OR `age` >= 30;```
* `IN`：可以规定查询的值是多个值其中之一。示例：```SELECT * FROM user WHERE age IN (19, 28, 32);```

### ORDER BY 排序

通过 `ORDER BY` 语句设定按哪个字段、按哪种方式来排序。

语法：

``` sql
SELECT 字段1, 字段2
  FROM 表名
  ORDER BY 字段名 [ASC [DESC][默认 ASC]]
```

其中，可以用 `ASC`（升序）或 `DESC`（降序）关键字来设置查询结果按升序或降序排列。默认是 `ASC` 升序。

示例：

``` sql
SELECT * FROM user ORDER BY `age` DESC;
```

示例中，查询 `user` 表中的记录并按 `age` 字段降序排列。

### 处理分页

语法：

``` sql
SELECT 字段1, 字段2
  FROM 表名
  LIMIT M, N
```

其中：

* M：查询跳过的条数
* N：要查询的条数

比如要进行一个分页请求，前端的传参：

``` js
const postData = {
  pageIndex: 2, // 请求第几页数据
  pageSize: 3, // 每一页有多少条数据
  sortField: 'age' // 用于排序的字段
}
```

然后后端进行数据库查询，返回数据：

``` js
{
  code: 0,
  msg: '请求分页数据成功',
  data: {
    list: [ // 当前页的列表数据
      { id: 6, name: '庄周', age: 26, sex: '男', desc: '蝴蝶是我，我就是蝴蝶。' },
      { id: 3, name: '猪八戒', age: 28, sex: '男', desc: '心中乾坤大，地上有西瓜。' },
      { id: 8, name: '狄仁杰', age: 34, sex: '男', desc: '真相只有一个。' }
    ],
    total: 7 // 总条数
  }
}
```

SQL 示例：

``` sql
SELECT * FROM user ORDER BY age LIMIT 3, 3;
```

## （五）SQL 语句的分类

上面是一些基础的 SQL 语句使用，如果更加系统地看，SQL 语句主要分为 5 大类，这里简单了解即可：

1. DDL（Data Definition Language，数据定义语言）：对「数据库」、「表」、「列」进行「增加（create）」、「删除（drop）」、「修改（alter）」等操作；
2. DML（Data Manipulation Language，数据操作语言）：对「表中数据」进行「增加（insert）」、「删除（delete）」、「修改（update）」等操作；
3. DQL（Data Query Language，数据查询语言）：对「表中数据」进行「各种维度的查询（select）」；
4. DCL（Data Control Language，数据控制语言）：用来定义数据库的访问权限和安全级别，进行用户的创建和权限的分配。
5. TCL（Transaction Control Language，事务控制语言）。

在区分它们分类时，要注意操作的对象以及可进行的操作。
