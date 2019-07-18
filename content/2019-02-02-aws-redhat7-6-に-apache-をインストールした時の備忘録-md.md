---
title: AWS RedHat7.6 に Apache をインストールした時の備忘録
date: 2019-02-02T02:01:14.787Z
cover: /assets/apache.png
slug: AWS RedHat7.6 に Apache をインストールした時の備忘録
category: プログラミング
tags:
  - Apache
  - RHEL
  - AWS
---
AWS環境にアプリケーション・Webサーバーを作成する際に設定したことのメモ。

環境は以下の通りで Amazon Linux ではなく RedHat を使用しました。

EC2 RedHat7.6\
T2.micro  

ひとまずパッケージのアップデートを行います。
（実行環境では、一時的にセキュリティグループの設定による制限はなく、サーバーはインターネットに接続できる状態です。）
※ 業務でパッケージアップデートしたインスタンスがカーネルパニックを起こして再起不能になったことがあるので、必要な時以外はやらない方がいいのかなとも思ったりします。^^;

```
# とりあえずアップデート
$ sudo yum repolist all
$ sudo yum update
```

RHEL標準のApacheをインストールします。

```
# 標準のApache(httpd)をインストール
$ sudo yum install httpd -y
```

インストールが正常に完了しているか確認します。

```
# 起動
$ sudo systemctl start httpd

# 状態の確認
$ sudo systemctl status httpd
● httpd.service - The Apache HTTP Server
   Loaded: loaded (/usr/lib/systemd/system/httpd.service; disabled; vendor preset: disabled)
   Active: active (running) since Sat 2019-02-02 01:06:28 UTC; 1min 21s ago
     Docs: man:httpd(8)
           man:apachectl(8)
 Main PID: 29765 (httpd)
   Status: "Total requests: 0; Current requests/sec: 0; Current traffic:   0 B/sec"
   CGroup: /system.slice/httpd.service
           ├─29765 /usr/sbin/httpd -DFOREGROUND
           ├─29766 /usr/sbin/httpd -DFOREGROUND
           ├─29767 /usr/sbin/httpd -DFOREGROUND
           ├─29768 /usr/sbin/httpd -DFOREGROUND
           ├─29769 /usr/sbin/httpd -DFOREGROUND
           └─29770 /usr/sbin/httpd -DFOREGROUND

Feb 02 01:06:28 ip-10-0-45-109.ap-northeast-1.compute.internal systemd[1]: Starting The Apache HTTP Server...
Feb 02 01:06:28 ip-10-0-45-109.ap-northeast-1.compute.internal systemd[1]: Started The Apache HTTP Server.
```

※ 環境によるが起動時にWarningが発生するの場合があるので、原因となるファイルを修する必要があります。(おそらくホストの指定がされていない場合に出るエラーです)

```
# 「ServerName localhost:80」を追記
$ sudo vi /etc/httpd/conf/httpd.conf
```

最後に自動起動設定をして終了です。

```
$ sudo systemctl enable httpd
```

ひとまず、JDK、Tomcat、Apacheで構成した時のセットアップ手順は以上です。
