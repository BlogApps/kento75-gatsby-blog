---
title: 【Apache備忘録⑫】アクセス制限とBasic認証を組み合わせる
date: 2019-07-24T01:15:10.716Z
cover: /assets/apache.png
slug: 【Apache備忘録⑫】アクセス制限とBasic認証を組み合わせる
category: プログラミング
tags:
  - Apache
  - Linux
  - AWS
---
IPアドレスによるアクセス制限と、パスワード認証を組み合わせて使うことができる。

IPアドレスとパスワード認証の両方を満たす場合のみアクセスできるようにしたり、IPアドレスかパスワード認証のどちらかを満たす場合アクセスできるようにする設定が可能。



<br>



## 両方の条件に合った時だけ許可する場合

IPアドレスとパスワード認証の両方を必須とする。



<br>



### 設定ファイルを修正する



パスワード認証用に作成したファイルを修正する。

```
$ sudo vi /etc/httpd/conf.d/basic-auth.conf
```



以下の「Satisfy all」を追加することで、IPアドレスとBasic認証の両方を満たす場合のみアクセスできるように設定できる。

```
<Directory "/">
  # Basic認証を実装
  AuthType Basic
  # パスワードダイアログに表示する文言
  AuthName "Password for www.hoge.jp"
  # 使用するパスワードファイル
  AuthUserFile /etc/httpd/conf/.htpasswd
  # 認証に成功した場合、ログインできるようにする設定
  Require valid-user

  # ↓ 追加
  # IPアクセスとパスワード認証の両方を満たす場合のみアクセスを許可する
  Satisfy all
</Directory>
```



<br>



## どちらかの条件に合えば許可する場合

IPアドレスまたはパスワード認証のどちらかが合っていれば許可する設定を実装する。



<br>



### 設定ファイルを修正する



パスワード認証用に作成したファイルを修正する。

```
$ sudo vi /etc/httpd/conf.d/basic-auth.conf
```



以下の「Satisfy any」を追加することで、IPアドレスとBasic認証のどちらかを満たす場合アクセスできるように設定できる。

```
<Directory "/">
  # Basic認証を実装
  AuthType Basic
  # パスワードダイアログに表示する文言
  AuthName "Password for www.hoge.jp"
  # 使用するパスワードファイル
  AuthUserFile /etc/httpd/conf/.htpasswd
  # 認証に成功した場合、ログインできるようにする設定
  Require valid-user

  # ↓ 追加
  # IPアクセスとパスワード認証のどちらかを満たす場合のみアクセスを許可する
  Satisfy any
</Directory>
```

