---
title: Network namespace 挺有趣
date: 2015-11-03 21:57:14
tags:
---
今天才发现`ip netns`是这么强大。`ip netns`操作的就是 Linux network namespace。

namespaces, cgroups 这些技术是 Linux LXC 的基础，所以也是现在流行的 Docker 的基础。对于 namespeces，有 process 的 namespace，也有 network 的 namespace。如果一个进程跑在一个 process namespace 中，那么它只能看到同在这个 namespace 中的进程，也只能和这些进程通信。你在这个 namespace 中`ps -elf`一下，你也只能看到跑在这个 namespace 的进程。

<!-- more -->

Linux 的 network namespace 也是一样的道理，只是它是用于隔离网络。每个 network namespace 中有独立的网络设备，有自己独立的`lo`。每个 network namespace 中也有自己独立的路由表，iptables 规则等。结合 *veth*，利用 network namespace 可以很方便的在主机上配置虚拟网络。具体什么是 network namespace 可以 [man 8 ip-netns][ip-netns-man] 看看。

## A simple example

为了方便，我们不使用 Linux bridge 或者 OVS，只在主机中配置一个点到点的简单网络。

首先创建 2 个 namespace

```bash
ip netns add ns1
ip netns add ns2
```

此时`ls /var/run/netns`会看到 2 个文件`ns1`和`ns2`。这 2 个文件打开后产生的 fd 指向对应的 namespace。

创建 veth **pair**

```bash
ip link add name tap1 type veth peer name tap2
```

这时，在主机上就会多出 2 个 interface tap1 和 tap2。然后把这 2 个 interface 分别加到 ns1 和 ns2 中

```bash
ip link set tap1 netns ns1
ip link set tap2 netns ns2
```

这时，主机上原来多出的 2 个 interface 又会消失。此后，如果我们要操作这些 interface 的话，必须要加上`ip netns exec <ns-id>`前缀，比如现在把这 2 个 interface 配上地址并起起来。

```bash
ip netns exec ns1 ip addr add 2.2.2.1/24 dev tap1
ip netns exec ns1 ip link set tap1 up

ip netns exec ns2 ip addr add 2.2.2.2/24 dev tap2
ip netns exec ns2 ip link set tap2 up
```

这个时候，你就可以尝试 

```bash
ip netns exec ns1 ping 2.2.2.2
```

没有意外的，应该是可以 ping 通的。你也可以在 ns2 的对应 interface 上抓包

```bash
ip netns exec ns2 tcpdump -i tap2
```

如果你觉得输入前面的`ip netns exec <ns-id>`很麻烦，你也可以在这个 namespace 中运行 xterm。当然这需要你通过 GUI 登录机器，或者进行 x-window 转发。

```bash
ip netns exec ns1 xterm &
```

上面的命令会打开一个新的 terminal。`ip link list`一下，你应该就能看到`lo`和`tap1`了。

## How pipework works with Docker containter

如果你尝试过让 Docker container 和外部通信，你可能用过 [jpetazzo/pipework][pipework]。pipework 是一个简单的用来给 LXC container 配置网络的 Bash 脚本。

pipework 使用起来通常是这样(当然还有很多其他用法)：

```
pipework br0 904bcf846a3e 10.10.10.9/24
```

其中`br0`是 bridge 名，`904bcf846a3e`是 container id，`10.10.10.9/24`会配到这个 container 中新创建的 interface eth0 上。然后你把主机上的物理 interface 加到这个`br0`中，这个 container 就可以和外部网络通信了。pipework 用的其实就是上面例子中的那些工具。

pipework 首先会根据第一参数，在此是`br0`，去检查主机上有没有这个 bridge，如果有的话，会判断是 Linux bridge 还是 OVS bridge。如果主机上不存在，pipework 会创建这个 bridge，pipework 也会根据这个参数去猜测用户是想创建 Linux bridge 还是 OVS bridge。

然后 pipework 会根据这个 container id 获得这个 container 的 pid。假设这个 pid 是`14806`，则`/proc/14806/ns/net`就是这个 container 真正的 network namespace 文件对象。pipework 会在/var/run/netns/下创建一个指向这个文件的软链接。

```
ln -s /proc/14806/ns/net /var/run/netns/14806
```

此时我们运行`ip netns list`时，就可以看到`14806`这个 namespace。之后 pipework 会创建一个 veth pair。大概是这样：

```
ip link add name veth1pl14806 mtu 1500 type veth peer name veth1pg14806 mtu 1500
```

其中 mtu 的具体值，实际中是直接使用`br0`的 mtu 值。`veth1pl14806`就是'v'加上 container 中要创建的 interface 名字，加上'p'，加上'l'(应该是 local 的意思)，在再加上 container 的 pid。`veth1pg14806`同理，'l'换成'g'(guest)。当然，这个命名不重要，只要唯一就可以了。

之后，pipework 会把`veth1pl14806`加到`br0`中。

```bash
## if br0 is linux bridge
ip link set veth1pl14806 master br0 || brctl addif br0 veth1pl14806
## if br0 is OVS bridge
ovs-vsctl add-port br0 veth1pl14806
## bring it up
ip link set veth1pl14806 up
```

把`veth1pg14806`加到`14806`这个 namespace 中。然后改名成 eth1，再配置`10.10.10.9/24`这个地址和相应路由。


```bash
ip link set veth1pg14806 netns 14806
ip netns exec 14806 ip link set veth1pg14806 name eth1
ip netns exec 14806 ip add add 10.10.10.9/24 dev eth1
...
```

最后会删除之前创建的软链接`/var/run/netns/14806`，来防止用户通过`ip netns`来做更改。

[ip-netns-man]: http://man7.org/linux/man-pages/man8/ip-netns.8.html
[pipework]: https://github.com/jpetazzo/pipework
