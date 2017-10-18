---
title: Vagrant 是个好东西
date: 2015-10-24 23:26:39
tags:
---

对 Macbook Pro 蠢蠢欲动很久了，除了因为 Mac 好看，界面友好外。还有一部分是因为，Mac OS 是 Unix-like 的系统，开发友好。然而我还买不起。所以在 Windows 上我一般都是在虚拟机中跑 Linux 来当开发环境使用。免费的 VirtualBox 也很不错。

但要用 VirtualBox 搭建个开发环境，我们通常需要下载系统 iso 镜像，然后安装系统。比如安装 Ubuntu Desktop，虽然安装过程都是 GUI，点点鼠标就行，但毕竟过程需要一点时间，而且中途需要你人工操作。更不要说像 Arch Linux 这样的 distro 了。操作系统安装完了，我们通常需要一些简单的网络配置，比如让主机可以直接访问虚拟机，或者配置端口转发。有时，我们还可能需要更方便的文件交换，又需要配置共享文件夹。这些使用 Virtualbox 和 VMWare 的虚拟机软件都可以实现，这些东西配置一两次还行，如果你需要经常配置一个新的虚拟机的话，就会觉得很麻烦。

<!-- more -->

还好有 [Vagrant][vagrant] 这么个东西，以上这些操作都变的很简单。Vagrant 并不是像 VirtualBox 这样的提供虚拟化功能的平台性软件。它就像是对 VirtualBox 和 VMware 这些软件的操作和配置的一个统一包装。对于 Vagrant 来说，VirtualBox， VMWare 这样的软件称为 [provider]。要使用 Vagrant，除了要安装 Vagrant 本身以外，还需要 provider。Vagrant 中有个叫 [Box][box] 的概念，一个 box 就是一个已经拥有系统的镜像，它会作为虚拟机模板。在创建一个单独的虚拟机实例之前，需要先添加 box。比如以下命令会从官方的 [Catalog][catalog] 下载并添加名字叫"hashicorp/precise32"的 box：

```bash
vagrant box add hashicorp/precise32
```

在这个 Catalog 中有很多可以选择的 box。但在国内，像这样在线添加 box 速度会很慢。我们可以从别的地方通过其他方式下载我们需要 box，再指定目录添加到 vagrant 中。比我现在用的是 terrywang 做的 [Arch Linux x86_64 Base Box][arch-box]

```
vagrant box add <box-name> </path/to/box>
```

其中<box-name>是我们想给这个 box 起的一个名字，比如`arch-box-64`，后面在创建虚拟机时会用到。接下来，我们只需要创建一个目录，并在该目录中初始化我们的环境就可以了。

```bash
mkdir arch0
cd arch0
vagrant init arch-box-64
```

在 init 后，在这个目录下就会生成一个`Vagrantfile`。这个`Vagrantfile`是 Vagrant 中的关键。在上面步骤中生成的`Vagrantfile`，去掉其中很多解释性的注释后，内容大概如下：

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "arch-box-64"
end
```

然后，我们起虚拟机：

```bash
vagrant up
```

第一次起，时间会比较长一点。以后每次 up 的时候，都会比较快。然后可以通过以下命令登录到 guest[^1]:

```bash
vagrant ssh
```

由于每一个**标准**的 vagrant box 在制作的时候，都已经把 vagrant 官方提供的一个 ssh public key 添加到 box 中 ssh 的 authorized_keys 中。所以这个登录的时候，不需要输入密码，登录的用户名是 vagrant。实际上，虚拟机是把其 22(sshd)端口转发到主机的 2222 端口。所以我们可以通过 Putty 或者 XShell 这样的软件登录到 127.0.0.1:2222，如果在这些软件中觉得用 ssh key 比较麻烦的话，输入密码也可以登录，默认的密码也为 vagrant。这个 guest 中 root 的默认密码也为 vagrant，默认也设置好了 passwordless sudo。同时，我们在 host 上创建的这个`arch0`这个目录，会自动挂载到 guest 的`/vagrant`目录上，文件共享。虚拟机使用完了，如果这个虚拟机以后也不需要了，可以 destroy 掉。如果以后还需要使用，可以在虚拟机中直接`sudo shutdown -h now`，也可以在外面运行`vagrant halt`来关闭虚拟机。以后需要使用的话，再进入这个`arch0`目录，来 up 这个虚拟机。

知道了以上这些就已经足够我们愉快的玩耍了。这些 password less sudo，key based ssh login，port forward, directory sharing 等都可以直接在虚拟机以及 VirtualBox 中做相应的配置来完成，但有了 Vagrant，我们不需自己来做这些配置，而且 box 已经是拥有系统的模板，我们不需要自己安装。不仅是自己玩耍，甚至在商业上可以把自己的产品集成到 Vagrant box 中，把这个 box 作为最终的产品进行交付。

前面提到[`Vagrantfile`][vagrantfile] 中，我们可以做更多自定义的配置，比如有了如下配置，我们可以通过访问 host 的 8080 端口访问 guest 的 80 端口。

```ruby
Vagrant.configure("2") do |config|
  ...
  config.vm.network "forwarded_port", guest: 80, host: 8080
  ...
end
```

Vagrantfile 中也可以定义内存大小，主机名，ssh 登录信息等。除了这些，Vagrantfile 中也可以设置一些 shell script，让虚拟机在创建时运行它们，比如一些软件的安装命令。更多的参见 vagrant 的文档。

另，如果要使用 64 位的虚拟机，主机的 BIOS 要打开相应处理器厂商的虚拟化技术。

[^1]: 本文中称运行虚拟机软件的机器叫主机或 host，称其中运行的虚拟机实例为虚拟机或 guest。不做严谨的区分。

[vagrant]: https://www.vagrantup.com/
[box]: https://docs.vagrantup.com/v2/getting-started/boxes.html
[catalog]: https://atlas.hashicorp.com/boxes/search
[arch-box]: https://github.com/terrywang/vagrantboxes/blob/master/archlinux-x86_64.md
[provider]: https://docs.vagrantup.com/v2/providers/
[vagrantfile]: https://docs.vagrantup.com/v2/vagrantfile/index.html
