---
title: 自己搞了一个 Yum 源
date: 2015-11-06 23:21:47
tags:
---

[无 root 权限从源码编译安装很痛苦][build-from-source]，就算有 root 权限安装个软件什么的也很麻烦。而且公司的机器又不能访问外网。所以我不如自己搭建一个源镜像，这样大家都可以用。正好实验室有配置比较低的闲置机器，配置一下代理就可以了。由于我们 Team 基本用的都是 Redhat Enterprise Linux 或者 Cent OS，而且基本上都是 7.0+，所以搭建的是 EL7 的 yum 源，应该也可以用于其他 Enterprise Linux 系列 distro。

<!-- more -->

首先检查机器上是否有`reposync`和`createrepo`。前者用于从远端 repo 中拉取 rpm 包到本地，后者用于创建 repo 生成 metadata 等。没有的话，可以通过 yum 安装。

```bash
yum install yum-utils createrepo
```

然后可以写一个，如下的脚本：

```bash
#!/bin/bash

repos="base extras updates"
for repo in $repos; do
  reposync -a x86_64 -r $repo -p /opt/mirror/el/7/
  createrepo "/opt/mirror/el/7/$repo/"
done
```

其中`repos`中是你希望拉取到本地的 repo 的 id。在`/etc/yum.repos.d/`下面的 repo 文件一般都是如下的形式：

```ini
[one]
name=Repo One
baseurl=http://example.com/el7/one/
enabled=1
gpgcheck=1
gpgkey=file:///etc/one/

[two]
name=Repo Two
baseurl=http://example.com/el7/two/
enabled=1
gpgcheck=0
```

其中`one`和`two`就是 repo id。虽然说是 id，但其实可以有多个文件存在相同的 repo id。

前面的脚本跑一次一般需要比较长的时间，当然这个要看网络情况。接下来，我们跑一个 web server，这里选择 nginx。使用 yum 默认安装的话，nginx 使用的默认配置文件应该是`/etc/nginx/nginx.conf`，添加以下行：


```nginx
...
http {
  ...
  server {
    ...
    location /el/7/ {
      root   /opt/mirror;
      autoindex  on; 
    }
    ...
  }
}
```

运行 nginx

```bash
systemctl start nginx
```

假设主机的 IP 是 1.2.3.4，此时我们访问`http://1.2.3.4/el/7/`就应该能看到东西了。

我们提供给别人的 repo 文件，应该是这样：

```ini
[base]
name=Test Repo base
baseurl=http://1.2.3.4/el/7/base/
enabled=1
gpgcheck=0

[extras]
name=Test Repo extras
baseurl=http://1.2.3.4/el/7/extras/
enabled=1
gpgcheck=0

[updates]
name=Test Repo updates
baseurl=http://1.2.3.4/el/7/updates/
enabled=1
gpgcheck=0
```

我只是公司内网使用，就不管什么 gpgkey 了。gpgcheck 全设为 0。

如果我们还有点*情怀*，我们还应该提供一个 mirror 使用的帮助页面，比如[网易 CentOS 镜像使用帮助][netease-mirror]。用 markdown 写个，转成 html，存到`/opt/mirror/el/7/help/index.html`就可以了。

[build-from-source]: /posts/2015-09-09-build-install-wo-root/
[netease-mirror]: http://mirrors.163.com/.help/centos.html
