---
title: AWS RedHat7.6(HVM)にTomcat9を入れてみた時の備忘録
date: 2019-01-02T11:13:50.169Z
cover: /assets/tomcat.png
slug: AWS RedHat7.6(HVM)にTomcat9を入れてみた時の備忘録
category: プログラミング
tags:
  - Tomcat
  - AWS
  - RHEL
  - Linux
---
前回のOracle JDKのインストールに引き続き、  
AWS環境にアプリケーション・Webサーバーを作成する際に設定したことのメモです。

環境は以下の通りで Amazon Linux ではなく RedHat を使用しました。

・EC2 RedHat7.6  
・T2.medium

## gccのインストール
Tomcatをデーモン起動で使用する場合、gccが必要となるのでインストールします。

```
# gccパッケージのインストール
$ sudo yum install -y gcc
```

## Tomcatモジュールの取得 & 解凍

RHELのリポジトリの最新は Tomcat7 と古いため、wget でモジュールを取得します。

```
# 最新版をwgetで取得
$ wget http://ftp.yz.yamagata-u.ac.jp/pub/network/apache/tomcat/tomcat-9/v9.0.13/bin/apache-tomcat-9.0.13.tar.gz

#  解凍して/opt配下に移動
$ sudo tar zxvf apache-tomcat-9.0.13.tar.gz -C /opt/
```

## Tomcatをデーモンとして使用する際に必要となるjsvcのコンパイル

デーモンで自動起動を設定するため、jsvc を make でコンパイルします。

```
# ディレクトリに移動してコンパイル実行
$ cd /opt/apache-tomcat-9.0.13
$ sudo tar zxvf ./bin/commons-daemon-native.tar.gz

$ cd commons-daemon-1.1.0-native-src/unix/
$ ./configure --with-java=/usr/java/latest

$ make

$ sudo cp -piv jsvc /opt/apache-tomcat-9.0.13/bin/
$ cd /opt/apache-tomcat-9.0.13/

# 確認
$ sudo ls -l ./bin/jsvc
-rwxrwxr-x. 1 ec2-user ec2-user 174056 Dec 11 12:08 ./bin/jsvc
```

## Tomcatユーザーとグループの作成

Tomcat を実行するためのユーザーとグループを作成します。

```
$ sudo groupadd -g 10003 tomcat
$ sudo useradd -u 10003 -g 10003 tomcat
```

##  Tomcat関連のファイルの所有者変更

Tomcatユーザーを各ファイルの所有者にします。

```
$ cd /opt
$ sudo chown -R tomcat:tomcat apache-tomcat-9.0.13

# 所有者がTomcatになっていることを確認
$ ls -l /opt/apache-tomcat-9.0.13/
```

## サービスユニットファイルとSystemd用設定ファイルの作成
このファイルはデーモンの起動・停止に使用するファイル（何故か存在しないので自分で作成しました。）

```
$ sudo vi /etc/systemd/system/tomcat.service
```

```
#/etc/systemd/system/tomcat.serviceの中身

[Unit]
Description=Apache Tomcat Web Application Container
After=syslog.target network.target

[Service]
Type=forking
EnvironmentFile=/etc/sysconfig/tomcat
ExecStart=/opt/apache-tomcat-9.0.13/bin/daemon.sh start
ExecStop=/opt/apache-tomcat-9.0.13/bin/daemon.sh stop
SuccessExitStatus=143
User=tomcat
Group=tomcat

[Install]
WantedBy=multi-user.target
```

```
$ sudo vi /etc/sysconfig/tomcat
```

```
# /etc/sysconfig/tomcat

# Where your java installation lives
JAVA_HOME="/usr/java/latest"

# Where your tomcat installation lives
CATALINA_BASE="/opt/apache-tomcat-9.0.13"
CATALINA_HOME="/opt/apache-tomcat-9.0.13"
#JASPER_HOME="/usr/share/tomcat"
#CATALINA_TMPDIR="/var/cache/tomcat/temp"

# You can pass some parameters to java here if you wish to
#JAVA_OPTS="-Xminf0.1 -Xmaxf0.3"

# Use JAVA_OPTS to set java.library.path for libtcnative.so
#JAVA_OPTS="-Djava.library.path=/usr/lib"

# What user should run tomcat
TOMCAT_USER="tomcat"

# You can change your tomcat locale here
#LANG="en_US"

# Run tomcat under the Java Security Manager
#SECURITY_MANAGER="false"

# Time to wait in seconds, before killing process
#SHUTDOWN_WAIT="30"

# Whether to annoy the user with "attempting to shut down" messages or not
#SHUTDOWN_VERBOSE="false"

# Connector port is 8080 for this tomcat instance
#CONNECTOR_PORT="8080"

# If you wish to further customize your tomcat environment,
# put your own definitions here
# (i.e. LD_LIBRARY_PATH for some jdbc drivers)
```

## Tomcat 起動確認

```
$ sudo systemctl start tomcat

# ステータスの確認 running なら成功
$ sudo systemctl status tomcat

$ sudo systemctl stop tomcat 

# ステータスの確認 dead なら成功
$ sudo systemctl status tomcat

```

## 自動起動の設定

```
$ sudo systemctl enable tomcat

# Loaded: loaded (/etc/systemd/system/tomcat.service; enabled; と表示されることを確認
$ sudo systemctl status tomcat
```

以上で RedHat7.6 への Tomcat9 のセットアップが完了しました。  
JDK のセットアップと比べて手順が多く面倒でした。(-｡-;
