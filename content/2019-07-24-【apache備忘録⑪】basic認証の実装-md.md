---
title: 【Apache備忘録⑪】Basic認証の実装
date: 2019-07-24T01:08:54.517Z
cover: /assets/apache.png
slug: 【Apache備忘録⑪】Basic認証の実装
category: プログラミング
tags:
  - AWS
  - Linux
  - Apache
---
HTTPには認証の仕組みがあり、パスワードでWebページにアクセス制限をかけることができる。

入力されたユーザー名とパスワードが、あらかじめ登録されているユーザー名とパスワードと合っていた場合のみ表示する設定を実装できる。

Apacheでは、htpasswdコマンドでユーザー名とパスワードを登録し、設定ファイルで認証の設定を行うことで、パスワードを使用したアクセス制限を実装できる。

<br>

## ユーザーを登録する

「htpasswd」コマンドで、パスワードファイルにユーザーとパスワードを追加する。

```
$ sudo htpasswd -c .htpasswd user1
New password: 
Re-type new password: 
Adding password for user user1
```

<br>

### 設定ファイルを修正する

パスワードファイル「/etc/httpd/conf/.htpasswd」を使用するように追加で設定ファイルを作成する。

```
$ sudo vi /etc/httpd/conf.d/basic-auth.conf
```

以下の設定を追加する。

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
</Directory>
```

<br>

### 確認

ブラウザから「ルートとなるホスト名」にアクセスしてBasic認証ダイアログが表示される。

![apache-learn-11-1](/assets/apache-learn-11-1.png)

<br>

## 認証をグループ単位にする

ユーザー名とパスワードによる認証では、グループ単位での認証を実装できる。

<br>

### グループを登録する

グループファイルを作成する。

```
$ sudo vi .groupauth
```

以下の内容で作成する。

「：」の左がグループ名、「：」の右がグループに入るユーザー名。

```
kento: kento user11 user12
takano: kento user4 user5
```

<br>

### 設定ファイルを修正する

グループでのBasic認証ができるように設定ファイルに設定を追加する。

```
$ sudo vi /etc/httpd/conf.d/basic-auth.conf
```

以下のように、「AuthGroupFile」 で使用するファイルを指定、「Require」をグループ指定に変更する。

```
<Directory "/">
  # Basic認証を実装
  AuthType Basic
  # パスワードダイアログに表示する文言
  AuthName "Password for www.hoge.jp"
  # 使用するパスワードファイル
  AuthUserFile /etc/httpd/conf/.htpasswd
  # 使用するグループファイル
  AuthGroupFile /etc/httpd/conf/.groupauth
  # 認証に成功した場合、ログインできるようにする設定
  #Require valid-user
  # グループファイルを使用するように変更
  Require group kento
</Directory>
```

これで、ブラウザからパスワードファイルに設定されている「user1」では認証できなくなる。

認証を行いたい場合、グループファイルを修正して、グループに「user1」を追加する必要がある。

<br>

## ハマったところ

最初は以下の設定で実装したが、ブラウザから検証した時にBasic認証のダイアログが表示されることなく、画面が表示されてしまった。

```
<Directory "/var/www/html">
  # Basic認証を実装
  AuthType Basic
  # パスワードダイアログに表示する文言
  AuthName "Password for www.hoge.jp"
  # 使用するパスワードファイル
  AuthUserFile /etc/httpd/conf/.htpasswd
  # 認証に成功した場合、ログインできるようにする設定
  Require valid-user
</Directory>
```

原因は、設定したディレクティブより上の階層で「Require all granted」が指定してあったため。

「/」に設定してあったため、Basic認証の設定が無効化されていた。
