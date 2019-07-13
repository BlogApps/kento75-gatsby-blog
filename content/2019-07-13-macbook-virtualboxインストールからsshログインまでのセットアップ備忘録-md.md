---
title: MacBook VirtualBoxインストールからSSHログインまでのセットアップ備忘録
date: 2019-07-13T05:08:37.011Z
cover: /assets/linux.png
slug: MacBook VirtualBoxインストールからSSHログインまでのセットアップ備忘録
category: プログラミング
tags:
  - Linux
  - Mac
  - VirtualBox
---
homebrewでVirtualBoxをインストール（caskオプションを使用するとGUIもセットでインストールされる）

```
$ brew cask install virtualbox
```

## Ubuntuイメージを取得する

イメージは、`https://www.osboxes.org/virtualbox-images/`のものを使用(今回はUbuntu16.04)

パスワードもメモしておく。

![virtual-box1](/assets/virtual-box1.png)

## イメージの読み込み

Ubuntuのイメージを解凍するして、virtualboxで読み込む。

すでにあるimageを選択して、Ubuntuイメージを選択、メモリは余裕をもって2048MBとする。

また、ネットワークへのアクセスにホスト端末であるMacBookのネットワークアダプタを使用する必要があるので、セッティング→ブリッジアダプタ設定で下の画像のように設定を行う。

![virtual-box2](/assets/virtualbox-2.png)

## イメージの起動とホストからのSSH接続用の設定

イメージを起動して、先ほどメモしたパスワードでログインする。

初期の状態だとOpenSSHすら入っていないので、インストールする。

Terminalを開いて、以下のコマンドを実行する。

```
# 管理者権限のパスワードはログインユーザーと同じ
$ sudo su

# パッケージ更新とインストール
$ apt-get update
$ apt-get install -y openssh-server
```

勝手に自動起動設定されるので、コマンド実行すると「running」とでるはず。

```
$ service ssh status
```

仮想環境のIPアドレスを確認する。

```
$ ifconfig
```

仮想環境にホスト端末からログインできるか確認する。

```
$ ssh -h osboxes@<仮想環境のIPアドレス>
ssh: illegal option -- h
usage: ssh [-46AaCfGgKkMNnqsTtVvXxYy] [-B bind_interface]
           [-b bind_address] [-c cipher_spec] [-D [bind_address:]port]
           [-E log_file] [-e escape_char] [-F configfile] [-I pkcs11]
           [-i identity_file] [-J [user@]host[:port]] [-L address]
           [-l login_name] [-m mac_spec] [-O ctl_cmd] [-o option] [-p port]
           [-Q query_option] [-R address] [-S ctl_path] [-W host:port]
           [-w local_tun[:remote_tun]] destination [command]
KentonoMacBook-Pro:~ kento$ ssh osboxes@192.168.1.8
ssh: connect to host 192.168.1.8 port 22: Connection refused
KentonoMacBook-Pro:~ kento$ ssh osboxes@192.168.1.8
The authenticity of host '192.168.1.8 (192.168.1.8)' can't be established.
ECDSA key fingerprint is SHA256:IbbCVKPxaDoJY+Ve4iB3zQ5CVABCWFnfZvHe9mIx/rg.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '192.168.1.8' (ECDSA) to the list of known hosts.
osboxes@192.168.1.8's password: 
Welcome to Ubuntu 16.04.6 LTS (GNU/Linux 4.15.0-45-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

230 packages can be updated.
154 updates are security updates.


The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

osboxes@osboxes:~$ 
```

以上でログイン設定まで完了。

## ハマったところ

仮想環境のデスクトップ画面から、ホスト端末のMacBookにマウスが移動しなくて詰んだ。

調べたところ、初期設定だと左のコマンドキーを押すとできるようになるらしい。

![virtual-box3](/assets/virtual-box3.png)
