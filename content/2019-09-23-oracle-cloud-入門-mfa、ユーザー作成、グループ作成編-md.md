---
title: Oracle Cloud 入門 - MFA、ユーザー作成、グループ作成編 -
date: 2019-09-23T09:56:36.965Z
cover: /assets/beginer-tumble.png
slug: Oracle Cloud 入門 - MFA、ユーザー作成、グループ作成編 -
category: プログラミング
tags:
  - Oracle Cloud
  - MFA
---
## MFAを設定してセキュリティを高める

<br>

### MFA（Multi-Factor Authentication）とは

<br>

MFA（Multi-Factor Authentication）とは、直訳すると多要素認証のことです。

多要素認証とは、ユーザー名とパスワードによる認証に、追加のセキュリティレイヤーを加えるものです。

追加のセキィリティレイヤーとは、スマホのアプリやMFA用の特別な機器に表示されるワンタイムパスワードによる認証のことです。

Oracle Cloudに限ったことではなく、AWSやGCP、Azureでもこの設定を行うことが推奨されています。

この設定を行うことで、ユーザー名、パスワードによる不正ログインによる被害が少なくなります。

不正ログインされると、たくさんインスタンス、VMを起動されたりするので絶対に設定しましょう!!

<br><br>

### 設定してみる

<br>

ユーザー設定をクリックすると、ユーザー詳細画面に遷移します。

![oracle-cloud-mfa-1](/assets/s_oracle-cloud-mfa-1.jpg)

<br>

初期状態は、マルチファクタ認証（MFA）が無効となっているので、マルチファクタ認証を有効化します。

![oracle-cloud-mfa-2](/assets/s_oracle-cloud-mfa-2.jpg)

<br>

「マルチファクタ認証を有効化」をクリックすると、認証用のQRコードが表示されるので、スマートフォンの認証用アプリでスキャンします。

アプリ側で表示されるワンタイムパスコードを認証コードに入力して有効化ボタンをクリックします。

![oracle-cloud-mfa-3](/assets/s_oracle-cloud-mfa-3.jpg)

<br>

認証設定が完了すると先ほど無効になっていた箇所が有効に変わります。

![oracle-cloud-mfa-4](/assets/s_oracle-cloud-mfa-4.jpg)

<br><br>



### ログイン確認

<br>

ログインの確認のため、一旦ログアウトします。

![oracle-cloud-mfa-5](/assets/s_oracle-cloud-mfa-5.jpg)

<br>

ユーザー名とパスワードで認証します。

![oracle-cloud-mfa-6](/assets/s_oracle-cloud-mfa-6.jpg)

<br>

ユーザー名、パスワードによる認証が正しいと、次はワンタイムパスワードを入力する画面が表示されます。

こちらに、6桁のワンタイムパスワードを入力してログインできれば設定成功です。

![oracle-cloud-mfa-7](/assets/s_oracle-cloud-mfa-7.jpg)

<br><br>

## ユーザーを作成する

<br>

他のクラウドと同じようにユーザーを作成できます。

Oracle Cloud のユーザーの定義も他のクラウドをあまり変わらなそうなので、ざっくりと手順を解説します。

<br><br>

### 作成してみる

<br>

アイデンティティからユーザーをクリックします。

![oracle-cloud-create-user-1](/assets/s_oracle-cloud-create-user-1.jpg)

<br>

ユーザーの一覧が表示されます。

新規で作成するので、ユーザーの作成ボタンをクリックします。

![oracle-cloud-create-user-2](/assets/s_oracle-cloud-create-user-2.jpg)

<br>

ウィンドウが開くので、名前、電子メールを入力後、作成ボタンをクリックします。（ここでは、説明も入力しています。）

![oracle-cloud-create-user-3](/assets/s_oracle-cloud-create-user-3.jpg)

<br>

ユーザーの作成が完了すると、作成時に設定したメールアドレスあてにメールが送信されます。

作成したユーザーは、パスワードの設定が完了していないので、ログインはできません。

パスワードの作成/リセットボタンをクリックします。

![oracle-cloud-create-user-4](/assets/s_oracle-cloud-create-user-4.jpg)

<br>

パスワードの作成/リセットボタンをクリックします。

![oracle-cloud-create-user-5](/assets/s_oracle-cloud-create-user-5.jpg)

<br>

ボタンクリック後、パスワードが表示されます。

こちらを使用してユーザー名、パスワードでログインできます。

また、こちらのパスワードは、初回ログイン時に変更できます。

![oracle-cloud-create-user-6](/assets/s_oracle-cloud-create-user-6.jpg)

<br><br>

## グループを作成する

<br>

他のクラウドと同じようにグループを作成できます。ざっくりと手順を解説します。

<br><br>

### 作成してみる

<br>

アイデンティティからグループをクリックします。

![oracle-cloud-create-group-1](/assets/s_oracle-cloud-create-group-1.jpg)

<br>

グループ一覧が表示されます。グループを新規作成するので、グループの作成ボタンをクリックします。

![oracle-cloud-create-group-2](/assets/s_oracle-cloud-create-group-2.jpg)

<br>

ウィンドウが表示されるので、必要事項を入力後、作成ボタンをクリックします。

![oracle-cloud-create-group-3](/assets/s_oracle-cloud-create-group-3.jpg)

<br>

グループ一覧画面に先ほど作成したグループが表示されます。

![oracle-cloud-create-group-4](/assets/s_oracle-cloud-create-group-4.jpg)

<br><br>

### グループにユーザーを追加する

<br>

グループの詳細画面で、ユーザーをグループに追加ボタンをクリックします。

![oracle-cloud-create-group-5](/assets/s_oracle-cloud-create-group-5.jpg)

<br>

追加するユーザーを選択後、追加ボタンをクリックします。

![oracle-cloud-create-group-6](/assets/s_oracle-cloud-create-group-6.jpg)

<br>

グループ詳細画面に追加したユーザーがメンバーとして表示されます。

![oracle-cloud-create-group-7](/assets/s_oracle-cloud-create-group-7.jpg)
