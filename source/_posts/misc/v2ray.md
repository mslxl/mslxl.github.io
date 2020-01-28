---
layout: post
title: V2Ray Setup
date: '2020-01-19 20:00:00 +0800'
author: Mslxl
tags:
  - Misc
  - V2Ray
abbrlink: 8bcd23bc
password: konkonkitsune
---

## 下载

### Window

* [V2RayN (Recommand)](https://github.com/2dust/v2rayN/releases)
* [V2RayW 不支持配置 Shadowsocks](https://github.com/Cenmrev/V2RayW/releases)
* [V2RayS 不支持高级传输层设置](https://github.com/Shinlor/V2RayS/releases)
* [Clash 基于 Yaml 语法且纯英文界面](https://github.com/Fndroid/clash_for_windows_pkg/releases)

### Android

* [V2RayNG](https://github.com/2dust/v2rayNG/releases)
* [BifrostV](https://apkpure.com/bifrostv/com.github.dawndiy.bifrostv)

### Mac

* [V2RayU (Recommand)](https://github.com/yanue/V2rayU/releases)
* [V2RayX 不支持配置 Shadowsocks](https://github.com/Cenmrev/V2RayX/releases)
* [ClashX 基于 Yaml](https://github.com/yichengchen/clashX/releases)

### iOS

iOS 目前没有发现免费的客户端，付费的客户端有：Shadowrocket、pepi、i2Ray、Kitsunebi 和 Quantumult



## 安装 V2Ray
<details>
<summary>可能用到的命令</summary>

* 连接 SSH
    ```bash
    ssh username@servername
    ```
* 上传文件（夹）到服务器
    ```bash
    scp [-r] /localfile/ username@servername:/path/ 
    ```
* 下载文件（夹）
    ```bash
    scp [-r] username@servername:/path/ /localfile/
    ```

</details>

### 服务端

在 CentOS、Ubuntu 等常用 Linux 系统上，直接执行如下命令安装V2Ray（如果已安装则更新程序）：

```bash
bash <(curl -L -s https://install.direct/go.sh)
```

安装完成后，配置文件为/etc/v2ray/config.json，cat 命令可查看内容：cat /etc/v2ray/config.json。一个安装时自动生成的配置文件示例：

```json
{
  "inbounds": [{
    "port": 19007,
    "protocol": "vmess",
    "settings": {
      "clients": [
        {
          "id": "66fake66-7777-8888-9999-0user0000id",
          "level": 1,
          "alterId": 64
        }
      ]
    }
  }],
  "outbounds": [{
    "protocol": "freedom",
    "settings": {}
  },{
    "protocol": "blackhole",
    "settings": {},
    "tag": "blocked"
  }],
  "routing": {
    "rules": [
      {
        "type": "field",
        "ip": ["geoip:private"],
        "outboundTag": "blocked"
      }
    ]
  }
}
```

配置文件中”inbounds” 下的这几项信息需要留意：port（端口）、clients 中的 id（用户id）和 alterId（额外id），它们将在配置客户端时用到。

配置文件无需任何改动即可正常使用，但注意防火墙要放行监听的端口。接下来启动V2Ray并设置开机启动：

```bash
systemctl enable v2ray
systemctl start v2ray
```
### 客户端

添加服务器后依次输入 port、id、alterId、level 即可

## 安装 BBR

使用 root 用户登录，运行以下命令，命令支持 CentOS 6+，Debian 7+。

```bash
wget --no-check-certificate https://github.com/teddysun/across/raw/master/bbr.sh && chmod +x bbr.sh && ./bbr.sh
```

安装完成后，脚本会提示需要重启 VPS，输入 y 并回车后重启。

重启完成后，进入 VPS，验证一下是否成功安装最新内核并开启 TCP BBR，输入以下命令：

```bash
uname -r
```

查看内核版本，显示为最新版就表示 OK 了

输入指令

```bash
sysctl net.ipv4.tcp_available_congestion_control
```

返回值一般为：

```
net.ipv4.tcp_available_congestion_control = bbr cubic reno
```

或者为：

```
net.ipv4.tcp_available_congestion_control = reno cubic bbr
```

则成功安装了 BBR

## 应用 HTTP 流量伪装

进行此步需要:
* 一个域名（无备案要求）
* 对应域名的证书，可以用免费的 Let’s Encrypt 证书

理论上来说，证书不是必须的。但没有 tls 加持或不做加密，墙直接能看出真实意图从而进行干扰，这也是为什么不建议伪装 http 流量的原因。本文给出的方法采用合法机构签发的证书对流量进行加密，不是做特征混淆得到的 tls 流量，从而更难被检测和干扰。

关于伪装技术的选择，Websocket+Tls+Web 和 http2+tls+web 常用来做对比。理论上 http2 省去了 upgrade 的请求，性能更好。但实际使用中两者没有明显区别，加之某些 web 服务器（例如 nginx）不支持后端服务器为 http2，所以 websocket 的方式更流行。如果你要上 http2，记得 web 服务器不能用 nginx，要用后端支持 http2 的 caddy 等软件。

下文介绍流量伪装的配置步骤，演示域名为example.mslxl.com，服务器为 CentOS，服务器软件用 Nginx，Websocket+Tls+Web 组合，最终效果为：http/https 方式打开域名，显示正常的网页；V2Ray客户端请求特定的路径，例如https://example.mslxl.com/ray，能科学上网；浏览器直接请求https://example.mslxl.com/ray，返回”400 bad request”。即外部看起来完全是一个人畜无害的正规网站，特定手段请求特定网址才是科学上网的通道。


有关 Nginx + V2Ray 近期我会写一个程序出来

### 服务端

#### DNS

先要设置 dns 解析，将域名解析到 vps 的 ip，例如 example.mslxl.com 解析到 xxx.xxx.xx.xx。

如果你上了 cdn，则 dns 要解析到 cdn 给的 ip 或者别名网址（cname）。使用 cdn 能隐藏真实 vps 的 ip，避免 vps 被墙或能拯救被封锁 ip 的 vps，大多数情况下还能加速访问。用 cdn 的好处很多，但配置起来更麻烦，建议新手先摸透 https 流量伪装后再考虑上 cdn。

#### Nginx

Nginx 是市面上占有率最高的网站服务器软件

CentOS 7 系统安装 Nginx 命令：
```bash
yum install -y epel-release && yum install -y nginx
```
Linux 系统上 Nginx 默认站点配置文件是/etc/nginx/conf.d/目录下的default.conf，我们对伪装网站进行全站 https 配置，示例内容如下：
```json
server {
    listen      80;
    server_name example.mslxl.com;  #改成你的域名
    rewrite     ^(.*) https://$server_name$1 permanent;
}

server {
    listen      443 ssl http2;
    server_name example.mslxl.com;  #改成你的域名
    charset     utf-8;

    # SSL 配置
    ssl_protocols               TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_ecdh_curve secp384r1;
    ssl_prefer_server_ciphers   on;
    ssl_session_cache           shared:SSL:10m;
    ssl_session_timeout         10m;
    ssl_session_tickets         off;
    ssl_certificate             /path/; # 改成你的证书地址 (*.crt|*.pem)
    ssl_certificate_key         /path/; # 改成证书密钥文件地址 (*.key)

    access_log                  /var/log/nginx/xxxx.access.log;
    error_log                   /var/log/nginx/xxx.error.log;

    root                        /usr/share/nginx/html;
    location / {
        index  index.html;
    }

    location /ray {     #与 V2Ray 配置中的 path 保持一致
        proxy_redirect        off;
        proxy_pass            http://127.0.0.1:port; #与 V2Ray 中的端口保持一致
        proxy_http_version    1.1;
        proxy_set_header      Upgrade $http_upgrade;
        proxy_set_header      Connection "upgrade";
        proxy_set_header      Host $host;
        # Show real IP in v2ray access.log
        proxy_set_header      X-Real-IP $remote_addr;
        proxy_set_header      X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

改完后用nginx -t命令查看有无配置错误，没问题的话 `systemctl restart nginx` 启动 Nginx。打开浏览器在地址栏输入域名，应该能看到 https 访问的 Nginx 欢迎页。

新域名如何快速做一个像模像样的网站？最简单的办法是从网上下载网站模板，上传 Web 服务器的根目录（默认是/usr/share/nginx/html）。对于伪装站来说，静态站足够。如果你的境外流量比较大，建议用爬虫或者其他手段做一个看起来受欢迎、流量大的站点，例如美食博客，图片站等。

#### V2Ray

配置 v2ray 接受 nginx 传来的数据。在 “inbounds” 中新增 “streamSetting” 配置，传输协议使用 “websocket”。配置好后config.json文件看起来是：

```json
{
  "inbounds": [{
    "port": 19007,
    "protocol": "vmess",
    "settings": {
      "clients": [
        {
          "id": "66fake66-7777-8888-9999-0user0000id",
          "level": 1,
          "alterId": 64
        }
      ]
    },
  },
  {
    "streamSettings":{
        "network":"ws",
        "wsSettings": {
            "path":"/ray/"
        }
    },
    "listen":"127.0.0.1"
  }],
  "outbounds": [{
    "protocol": "freedom",
    "settings": {}
  },{
    "protocol": "blackhole",
    "settings": {},
    "tag": "blocked"
  }],
  "routing": {
    "rules": [
      {
        "type": "field",
        "ip": ["geoip:private"],
        "outboundTag": "blocked"
      }
    ]
  }
}
```

* 配置中的 `inbounds[1].listen` 段仅仅出于安全考虑，建议只接受本地链接；
* 配置中的 `inbounds[1].streamSettings.wsSettings.path` 许与 Nginx 保持一致
* **注意：Json 文件不支持注释**

配置无误后，重启 v2ray 服务：`systemctl restart v2ray`。

### 客户端

最后是配置客户端，以 Windows 平台的V2RayW软件为例说明使用方法。

打开V2RayW，右键托盘图标，点击 “配置”。在弹框中新建或修改已有的服务器，输入服务器 ip，端口写 443，把用户 id、额外 id 信息填上，网络类型选择”ws”。
![Config.webp](/assets/v2ray/Config.webp)


接着点 “传输设置”，找到 “websocket”，路径一栏输入 Nginx 和 N2Ray 中的路径，例如 “/ray”；http 头部输入：
```bash
{
"Host":"你的域名，例如example.mslxl.com"
}
```

![TS_WS.webp](/assets/v2ray/TS_WS.webp)

接着点击 “tls”，勾选 “启用传输层加密 tls”，在 “服务器域名” 的输入框中输入域名:

![TS_TLS.webp](/assets/v2ray/TS_TLS.webp)

信息填写正确后，点击 “保存”。打开浏览器访问 google.com，youtube.com 等网站，配置无误的话应该都能正常打开。