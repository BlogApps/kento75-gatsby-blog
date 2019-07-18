---
title: AWS RedHat7.6(HVM)にOracle JDK8 入れてみた時の備忘録
date: 2018-12-31T21:18:58.791Z
cover: /assets/java.jpg
slug: AWS RedHat7.6(HVM)にOracle JDK8 入れてみた時の備忘録
category: プログラミング
tags:
  - Java
  - RHEL
  - AWS
---
AWS環境にアプリケーション・Webサーバーを作成する際に設定したことのメモ。

環境は以下の通りで Amazon Linux ではなく RedHat を使用しました。

* EC2 RedHat7.6  
* T2.medium

以下の手順で Oracle JDK のインストールから環境構築まで、RedHat以外の Linux でもインストールとパスの設定ができると思います。（実行環境では、一時的にセキュリティグループの設定による制限はなく、サーバーはインターネットに接続できる状態です。）

```
# とりあえずアップデートする
$ sudo yum repolist all
$ sudo yum update
```
  
tar.gzまたはrpmファイルからの２通りの方法があるとは思いますが、今回はrpmファイルで実施します。

```
# wget すら入っていないのでwgetを入れる
$ sudo yum install -y wget

# URLはChromeでJDKのライセンス条約に同意ボタン押下後、右クリックで取得できます
$ sudo wget --no-check-certificate --no-cookies --header "Cookie:oraclelicense=accept-securebackup-cookie" https://download.oracle.com/otn-pub/java/jdk/8u192-b12/750e1c8617c5452694857ad95c3ee230/jdk-8u192-linux-x64.rpm

# rpmをインストールする
$ sudo rpm -ivh jdk-8u192-linux-x64.rpm  
```
  
インストールが正常に完了しているか確認します。

```
# インストール後の確認
$ java -version
java version "1.8.0_192"Java(TM) SE Runtime Environment (build 1.8.0_192-b12)
Java HotSpot(TM) 64-Bit Server VM (build 25.192-b12, mixed mode)

# コンパイラーの確認
$ javac -versionjavac 1.8.0_192
```
  
インストールに問題がなければ、Javaの実態がどこにあるのかも確認しておきます。

```
# 実態がどこにあるのかを確認
$ which java/usr/bin/java

# リンク先の確認
$ ls -la /usr/bin/java
lrwxrwxrwx. 1 root root 22 Dec 10 11:39 /usr/bin/java -> /etc/alternatives/java

# リンク先をさらに確認
$ ls -la /etc/alternatives/java
lrwxrwxrwx. 1 root root 41 Dec 10 11:39 /etc/alternatives/java -> /usr/java/jdk1.8.0_192-amd64/jre/bin/java
```

実態は /usr/java/jdk1.8.0_192-amd64/jre/bin/java に作成されるようです。
実態のパスは JAVA_HOME の設定に使用します。  

全ユーザーに設定したいので、 /etc/profile に JAVA_HOME の設定を記述します。

```
# /etc/profile の一番下に追記
export JAVA_HOME=/usr/java/jdk1.8.0_192-amd64
export PATH=$PATH:$JAVA_HOME/jre/bin
```

/etc/profile に記述ができたら、再読み込みで即時反映できるので確認できます。

```
source /etc/profile
```

エンタープライズ系のオンプレ案件ではまだまだ需要のある Java ですが、クラウドで使用するケースは初めてでした。(^_^;)

Java のセットアップ以外にも Apache と Tomcat のセットアップも行ったので、余裕があれば別記事で掲載します。
