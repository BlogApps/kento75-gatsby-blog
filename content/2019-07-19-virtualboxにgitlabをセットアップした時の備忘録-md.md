---
title: VirtualBoxにGitLabをセットアップした時の備忘録
date: 2019-07-18T22:37:48.565Z
cover: /assets/linux.png
slug: VirtualBoxにGitLabをセットアップした時の備忘録
category: プログラミング
tags:
  - Linux
  - VirtualBox
  - GitLab
  - CentOS
---
## 使うもの

・VirtualBox

・CentOS7のイメージ(VDI)

　https://www.osboxes.org/centos/#centos-7-1810-info のイメージ

<br>

### CentOSのテンプレートイメージ作成

![virtualbox1](/assets/virtualbox-centos-1.png)

Core2、メモリ2048MBで起動

ログインパスワードは、上の画像のパスワードを使用

色々と設定を聞かれるので、答える（キーボード設定とかアカウント設定）

Macの場合、キーボード設定は日本語(Machintosh)を選択

![virtualbox2](/assets/virtualbox-centos-2.png)

ログインとセットアップが完了したら、シャットダウンする。


```
$ sudo shutdown now
```

<br>

### GitLab用のイメージ作成

テンプレートからクローンを作成する。

![virtualbox3](/assets/virtualbox-centos-3.png)

![virtualbox4](/assets/virtualbox-centos-4.png)

リンクしたクローンを選択。

![virtualbox5](/assets/virtualbox-centos-5.png)

起動して、中で作業をする。ターミナルでネットワークの情報を確認

```
$ cat /etc/sysconfig/network-scripts/ifcfg-lo
```

![virtualbox6](/assets/virtualbox-centos-6.png)

ifcfg-loをコピー

```
$ sudo cp /etc/sysconfig/network-scripts/ifcfg-lo /etc/sysconfig/network-scripts/ifcfg-enp0s8
```

enp0s8の確認

```
$ ifconfig
```

![virtualbox7](/assets/virtualbox-centos-7.png)

enp0s8用の設定ファイルを作成

```
$ sudo vi /etc/sysconfig/network-scripts/ifcfg-enp0s8
```

![virtualbox8](/assets/virtualbox-centos-8.png)

設定を反映するため、一度リスタートする。

```
$ service network restart
```

![virtualbox9](/assets/virtualbox-centos-9.png)

<br>

### docker版Gitlabをインストール

こちらを参考にインストールする。

https://docs.docker.com/install/linux/docker-ce/centos/

```
$ curl -fsSL https://get.docker.com -o get-docker.sh
$ sudo sh get-docker.sh
```

インストール完了後、サービスを起動。

runningになっていることを確認。

```
$ sudo service docker start
$ service docker status
```

![virtualbox10](/assets/virtualbox-centos-10.png)

GitLab（無償版）のdockerイメージをインストールする

https://docs.gitlab.com/omnibus/docker/#run-the-image

※ sshポートは使用しているので、別のポート（ここでは9222）に設定、ホスト名は上で設定したIPアドレスを設定する。

```
$ sudo docker run --detach \
  --hostname 192.168.57.4 \
  --publish 443:443 --publish 80:80 --publish 9222:22 \
  --name gitlab \
  --restart always \
  --volume /srv/gitlab/config:/etc/gitlab \
  --volume /srv/gitlab/logs:/var/log/gitlab \
  --volume /srv/gitlab/data:/var/opt/gitlab \
  gitlab/gitlab-ce:latest
```

ホスト端末のブラウザからアクセスできることを確認する。
