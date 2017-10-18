---
title: 在公司内网使用 GitHub
date: 2015-06-25 22:12:12
tags:
---

在公司内网使用 GitHub 前提是你要有能访问 GitHub 的 HTTP/HTTPS 代理。假设 HTTP 代理是`http://1.2.3.4:8000`，HTTPS 代理是`https://1.2.3.4:8000`。那么可以在你的`.bashrc`或者`.zshrc`中添加下面两行。

```bash
export HTTP_PROXY=http://1.2.3.4:8000
export HTTPS_PROXY=https://1.2.3.4:8000
```

这个时候你已经可以`clone` GitHub 上的 repo 了（当然要选择 https 的 repo）。但可能还是不能`push`。

<!--more-->

如果你需要 `push`的话，需要借助另外一个工具 [Corkscrew][Corkscrew]。

> Corkscrew is a tool for tunneling SSH through HTTP proxies.

下载 Corkscrew 的源码，编译安装。通常在公司你应该没有 root 权限的吧，所以在编译前的 configure 的时候 prefix 选择自己可以读写的目录。我在我们公司使用的 Scientific Linux 上 configure 的时候，configure 不能 guess 到正确的 host type，需要用 `--host` 来指定一下。

```bash
cd <corkscrew_src>
./confgure --prefix=/home/haishanh --host=i686-pc-linux-gnu
make 
make install
```

然后在`~/.ssh/config`中填入以下行

```
ProxyCommand /home/haishanh/bin/corkscrew 1.2.3.4 8000 %h %p
```

这个时候你`clone` `push` `pull`应该都没问题，因为 Corkscrew 是 tunnel SSH 流量的，所以我们要用 repo 的 SSH URL 来做这些操作。   

因为上面这个配置存在，你 SSH 到别的 HOST 都会从 proxy 走一遍，所以速度会特别慢，我的做法用个脚本去 wrapper 一下 git，如下

```bash
#!/bin/bash

gen_ssh_config() {
  cat<<EOF
ProxyCommand /home/haishanh/bin/corkscrew 1.2.3.4 8000 %h %p
EOF
}

cleanup() {
  if [ -f ~/.ssh/config ]; then
    # echo "cleanup"
    rm -rf ~/.ssh/config
  fi  
}

trap "cleanup" INT EXIT

if [ -n "$1" -a "$1" == "push" -o "$1" == "clone" -o "$1" == "pull" ]; then
  echo "using corkscrew..."
  gen_ssh_config > ~/.ssh/config
  # rw for user only
  chmod 600 ~/.ssh/config
fi

git "${@}"
```

假设这个脚本叫`~/bin/mygit.sh`，你可以在你的 rc 文件里面添加一个 alias。

```
alias git="~/bin/mygit.sh"
```

Now you can use github freely.

[Corkscrew]: http://agroman.net/corkscrew/

---

**EDIT**: 2017/10/18

你其实完全不需要用这样的 wrapper script，在 `~/.ssh/confg` 中你可以区分 Host 来进行不同配置

```
Host github.com
    ProxyCommand /home/haishanh/bin/corkscrew 1.2.3.4 8000 %h %p
```
