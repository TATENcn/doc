---
title: frp内网穿透
description: 使用 frp 实现内网穿透，轻松将本地服务暴露到公网。
---

taten_frp 用于提供团队内部公用的内网穿透服务。团队成员CN059在2026年2月14日购置一台三年期的 8C 8G 30Mbps 香港云服务器，将该服务器作为团队共用服务器。同日，CN059将sudo权限共享给小林和小xin，并部署了 frps 服务。小xin也部署了较为完整的 kubernetes 服务。

frp服务于2026年2月14日宣布可用

## 一、接入方法

### 1. 客户端安装frpc服务

客户端需要安装frpc才能使用服务器的frp服务，关于安装方法，可以参考[frp的官方文档](https://gofrp.org/zh-cn/docs/setup/)。
从[Github](https://github.com/fatedier/frp/releases)安装frpc的最新二进制文件，将下载后的文件解压到任意一个目录，然后编辑frpc.toml文件，进行一些配置

### 2. 配置frpc.toml文件

关于详细的frpc.toml配置，可以参考[frp的官方文档](https://gofrp.org/zh-cn/docs/features/common/configure/)。为了简化操作，TATEN提供一个使用模版

```toml
# serverAddr 填写 TATEN frpc 服务器地址
serverAddr = ""
serverPort = 7000

[auth]
# 具体密钥参考TATEN内部文档
token = "token"

#下方是一个完整的穿透代理配置，我们需要配置
# name 隧道名称
# type 隧道通信协议类型
# localIP 填写要穿透的本地IP地址(如果你的frpc运行在路由器上，需要填写局域网内设备IP的局域网地址)
# localPort 填写要穿透的端口
# remotePort 填写要穿透的远程端口
[[proxies]]
name = "Minecraft"
type = "tcp"
localIP = "127.0.0.1"
localPort = 25565
remotePort = 25565
```

以上就是一个最基本的配置模版，上面的配置文件实现的功能是将本地的25565端口的Minecraft服务器穿透到服务器的25565端口，这样，其他设备可以通过服务器的25565端口访问本机的Minecraft服务器。实现联机的效果

### 3. 启动frpc服务

启动frpc服务，执行以下命令:

```bash
frpc -c frpc.toml
```

如果你的配置文件没有语法格式问题的话，就会出现绿色的INFO日志，表示frpc启动成功

## 二、注册为系统服务

### 1. Linux使用systemd

#### (1) 创建service文件

在这个目录`/etc/systemd/system`下创建`frpc.service`文件，内容如下

```bash
[Unit]
Description = frp client
After = network.target syslog.target
Wants = network.target

[Service]
Type = simple
ExecStart = /usr/local/bin/frpc -c /etc/frp/frpc.toml

[Install]
WantedBy = multi-user.target
```

#### (2) 安装frpc二进制文件

执行命令`uname -m`获取设备架构信息。根据设备的架构，在Github上下载对应的frpc二进制文件，将下载的二进制文件解压到`/usr/local/bin/`目录下，并修改权限为755

#### (3) 放置frpc.toml配置文件

将frpc.toml配置文件放置在`/etc/frp/`目录下

#### (4) 启动frpc服务

执行命令`sudo systemctl daemon-reload`重载systemd服务

执行命令`sudo systemctl start frpc`启动frpc服务

执行命令`sudo systemctl status frpc`查看frpc服务状态

执行命令`sudo systemctl enable frpc`设置frpc服务开机自启动

### 2. Windows注册服务

持续更新中...
