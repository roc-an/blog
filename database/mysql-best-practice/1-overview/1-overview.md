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
