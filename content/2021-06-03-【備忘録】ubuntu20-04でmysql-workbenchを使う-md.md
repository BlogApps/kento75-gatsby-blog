---
title: 【備忘録】Ubuntu20.04でMySQL Workbenchを使う
date: 2021-06-03T11:33:32.123Z
cover: /assets/linux.png
slug: 【備忘録】Ubuntu20.04でMySQL Workbenchを使う
category: 備忘録
tags:
  - Linux
  - MySQL
  - Ubuntu
---
## ワークベンチのインストール

本家サイトのdebをインストールに失敗したので以下のコマンドでインストールする。
インストール自体はこれで完了。

```
$ sudo apt update
$ sudo snap install mysql-workbench-community
```

## インストール完了後にすること

![mysql_error](/assets/mysql_err.png)

DB接続用パスワード入力時、上記エラーが発生する。

パスワード保存のためには以下のコマンドの実行が必要にある。
```
$ sudo snap connect mysql-workbench-community:password-manager-service :password-manager-service
```
