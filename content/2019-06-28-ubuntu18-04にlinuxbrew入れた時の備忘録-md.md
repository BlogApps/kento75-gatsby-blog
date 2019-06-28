---
title: Ubuntu18.04にLinuxbrew入れた時の備忘録
date: 2019-06-28T07:02:58.465Z
cover: /assets/linux.png
slug: Ubuntu18.04にLinuxbrew入れた時の備忘録
category: プログラミング
tags:
  - Linux
---
## Linuxbrewとは

HomebrewのLinux版のこと。

LinuxでもMacと同じようにパッケージ管理をしたい場合に使用します。

Linuxでも以下のコマンドでパッケージをインストールできるようになります。（caskオプションは使えない）

```
$ brew install ＜パッケージ名＞
```



## インストール

事前に必要となるパッケージをインストールします。

```
$ sudo apt-get install -y build-essential curl file git
```



Linuxbrew本体をインストールします。

```
sh -c "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install.sh)"
```



`.bashrc`にLinuxbrewのパスを通します。

```
$ echo "export PATH='/home/linuxbrew/.linuxbrew/bin:/home/linuxbrew/.linuxbrew/sbin':$PATH" >> ~/.bashrc

# .bashrcの再読み込み
$ source ~/.bashrc

＃コマンドの確認
$ brew doctor
Your system is ready to brew.
```



## 使い方

Homebrewと全く同じ（caskオプションは使用できない）です。



①パッケージのインストール

```
$ brew install パッケージ名
```



②パッケージのアンインストール

```
$ brew uninstall パッケージ名
```



③パッケージの検索

```
$ brew search パッケージ名またはキーワード
```



④パッケージの更新

```
$ brew upgrade
```



⑤Linuxbrewの更新

```
$ brew update
```



## 終わりに

Linuxbrewを導入した目的は、Mac用のdotfilesをUbuntuでも使用できるようにしたいという重いからだったのですが、caskオプションが使用できないため、エディタ等のツールのインストールが一元化できなかったので残念です。まあ、Ubuntuのストアから必要なツールはインストールできるので、ツール系は分けるしかないかなと。
