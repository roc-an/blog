# 一段话说透一个前端知识点 - 正则表达式

## 概述

* Regular Expression 使用单个字符串来描述、匹配一系列**符合某个语法规则**的字符串
* 简单说就是按照某种规则去匹配符合条件的字符串

图形化正则表达式的工具：https://regexper.com/

## RegExp 对象与修饰符

JS 通过内置对象 RegExp 支持正则表达式

有两种方法实例化 RegExp 对象：

* 字面量
* 构造函数

字面量示例：`const reg = /\bis\b/g`

构造函数示例：`const reg = new RegExp('\\bis\\b', 'g')`

其中用到了 `g` 修饰符，正则中的修饰符：

* `g`：global，全文搜索。如果不使用，仅搜索到第一个匹配就停止
* `i`：ignore case，忽略大小写。默认大小写敏感
* `m`：multiple lines，多行搜索
