# 一段话说透一个前端知识点 - Nginx

* Nginx 是高性能的 Web 服务器，开源免费
* 一般用于做静态服务（如 CDN）、负载均衡（比如使用一个服务器集群，流量都往主机器上跑，其余机器去平摊流量）
* 反向代理

## 正向代理 VS 反向代理

* 反向代理：对客户端不可见
* 正向代理：自己主动安装代理工具，客户端能控制的代理

通过配置 Nginx 也可以实现跨域

## Nginx 常用指令

Mac：

* 测试配置文件格式是否正确：`sudo nginx -t`
* 启动 Nginx：`sudo brew services start nginx`
* 重启 Nginx 服务：`sudo brew services restart nginx`
* 关闭 Nginx 服务：`sudo brew services stop nginx`

## Nginx 配置

Mac 下 Nginx 配置文件位置：`/usr/local/etc/nginx/nginx.conf`

### 多核 CPU 下开启多个实例

多核 CPU 开启多个进程实例（Nginx 默认开启 1 个进程）：

```conf
worker_processes 8; # 多核 CPU 开启多个进程实例
```

### 反向代理接口

```conf
# 代理接口，所有以 /api/ 开头的请求，都代理到 http://localhost:3001
location /api/ {
    proxy_pass http://localhost:3001;
    proxy_set_header Host $host;
}
```
