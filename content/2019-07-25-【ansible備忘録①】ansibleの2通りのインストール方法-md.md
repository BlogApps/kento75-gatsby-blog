---
title: 【Ansible備忘録①】Ansibleの2通りのインストール方法
date: 2019-07-25T05:18:49.651Z
cover: /assets/ansible.png
slug: 【Ansible備忘録①】Ansibleの2通りのインストール方法
category: プログラミング
tags:
  - AWS
  - Linux
  - Ansible
  - Infrastructure as Code
---
## 前提

実行環境は、AWSのEC2を使用する。



<br>



## yum でインストール

こちらのインストール方法では、バージョンがだいぶ古くなる。



<br>



Amazon Linux 2 では Ansible を以下のコマンドでインストールできない。

```
$ sudo yum -y install ansible
読み込んだプラグイン:extras_suggestions, langpacks, priorities, update-motd
パッケージ ansible は利用できません。
エラー: 何もしません


ansible is available in Amazon Linux Extra topic "ansible2"

To use, run
# sudo amazon-linux-extras install ansible2

Learn more at
https://aws.amazon.com/amazon-linux-2/faqs/#Amazon_Linux_Extras
```



上記、ヒントを元にインストールする。

```
# インストール
$ sudo amazon-linux-extras install ansible2

# バージョン確認
$ ansible --version
ansible 2.4.6.0
  config file = /etc/ansible/ansible.cfg
  configured module search path = [u'/home/ec2-user/.ansible/plugins/modules', u'/usr/share/ansible/plugins/modules']
  ansible python module location = /usr/lib/python2.7/site-packages/ansible
  executable location = /usr/bin/ansible
  python version = 2.7.16 (default, Jun 19 2019, 17:20:54) [GCC 7.3.1 20180303 (Red Hat 7.3.1-5)]
```



<br>



## pip でインストール

こちらのインストール方法では、最新のバージョンをインストールできる。



<br>



### 必要なパッケージのインストール

Python3 が依存しているパッケージを先にインストールする。

```
$ sudo yum -y install gcc gcc-c++ make git openssl-devel bzip2-devel zlib-devel readline-devel sqlite-devel
```



<br>



### pyenv のインストール

pyenv をインストールする。

この時、ユーザーが十分な権限を持たない場合、 pyenv のインストールコマンドでエラーとなるので、ここでは ec2-user を指定しておく。

```
$ sudo git clone https://github.com/yyuu/pyenv.git /usr/bin/.pyenv
Cloning into '/usr/bin/.pyenv'...
remote: Enumerating objects: 17352, done.
remote: Total 17352 (delta 0), reused 0 (delta 0), pack-reused 17352
Receiving objects: 100% (17352/17352), 3.37 MiB | 3.30 MiB/s, done.
Resolving deltas: 100% (11818/11818), done.

$ sudo mkdir /usr/bin/.pyenv/shims
$ sudo mkdir /usr/bin/.pyenv/versions
$ sudo chown -R ec2-user:ec2-user /usr/bin/.pyenv
```



<br>



### 環境変数の追加



pyenv のパスを追加する。

```
$ sudo vi ~/.bashrc
```

内容は以下の通り。

```
省略

# Python3 設定
export PYENV_ROOT="/usr/bin/.pyenv"
export PATH=${PYENV_ROOT}/bin:$PATH
eval "$(pyenv init -)"
```

追加後、.bashrc を読み込む。

```
$ source ~/.bashrc
```



<br>



### Python3 のインストール





pyenv でインストールできるバージョンの一覧を表示する。

```
$ pyenv install --list

省略

  3.6.0
  3.6-dev
  3.6.1
  3.6.2
  3.6.3
  3.6.4
  3.6.5
  3.6.6
  3.6.7
  3.6.8
  3.6.9
  3.7.0
  3.7-dev
  3.7.1
  3.7.2
  3.7.3
  3.7.4
  3.8-dev
  3.9-dev

省略
```

Pythonのバージョンを指定してインストールする。

```
$ pyenv install 3.6.9
Downloading Python-3.6.9.tar.xz...
-> https://www.python.org/ftp/python/3.6.9/Python-3.6.9.tar.xz
Installing Python-3.6.9...
Installed Python-3.6.9 to /usr/bin/.pyenv/versions/3.6.9
```



<br>



### デフォルトで使用するPythonを変更する

変更前は、デフォルトの Python2 が設定されている。

```
$ python -V
Python 2.7.16
```



<br>

pyenv でデフォルトで使用する Python を3に固定する。

```
$ pyenv global 3.6.9

$ python -V
Python 3.6.9
```



### Ansible をインストール

Python3 に固定後、 ansibleをインストールする。

```
$ pip install --user ansible
```



<br>



これで最新バージョンが使える。

```
$ ansible --version
ansible 2.8.2
  config file = None
  configured module search path = ['/home/ec2-user/.ansible/plugins/modules', '/usr/share/ansible/plugins/modules']
  ansible python module location = /home/ec2-user/.local/lib/python3.6/site-packages/ansible
  executable location = /home/ec2-user/.local/bin/ansible
  python version = 3.6.9 (default, Jul 24 2019, 23:26:00) [GCC 7.3.1 20180303 (Red Hat 7.3.1-5)]
```



<br>



### おまけ：pyenv-virtualenv の追加



pyenv-virtualenv をダウンロードする。

```
$ git clone https://github.com/yyuu/pyenv-virtualenv.git /usr/bin/.pyenv/plugins/pyenv-virtualenv
```



<br>



pyenv-virtualenv 用の設定を追加する。

```
$ sudo vi ~/.bashrc
```

内容は以下の通り。

```
省略

eval "$(pyenv virtualenv-init -)"
```

.bashrc を読み込む。

```
$ source ~/.bashrc
```



<br>



動作確認を確認する。

```
$ pyenv virtualenv 3.6.9 python3.6
Requirement already satisfied: setuptools in /usr/bin/.pyenv/versions/3.6.9/envs/python3.6/lib/python3.6/site-packages (40.6.2)
Requirement already satisfied: pip in /usr/bin/.pyenv/versions/3.6.9/envs/python3.6/lib/python3.6/site-packages (18.1)
```

これで仮想環境も Python3 で作成できる。

```
$ pyenv versions
  system
* 3.6.9 (set by /usr/bin/.pyenv/version)
  3.6.9/envs/python3.6
  python3.6
```



<br>



## 妥協したところ



Python3.7 だとインストールができなかった。

```
$ pyenv install 3.7.4
Downloading Python-3.7.4.tar.xz...
-> https://www.python.org/ftp/python/3.7.4/Python-3.7.4.tar.xz
Installing Python-3.7.4...

BUILD FAILED (Amazon Linux 2 using python-build 1.2.13)

Inspect or clean up the working tree at /tmp/python-build.20190724230619.3770
Results logged to /tmp/python-build.20190724230619.3770.log

Last 10 log lines:
  File "/tmp/tmpa9ofomci/pip-19.0.3-py2.py3-none-any.whl/pip/_internal/cli/main_parser.py", line 12, in <module>
  File "/tmp/tmpa9ofomci/pip-19.0.3-py2.py3-none-any.whl/pip/_internal/commands/__init__.py", line 6, in <module>
  File "/tmp/tmpa9ofomci/pip-19.0.3-py2.py3-none-any.whl/pip/_internal/commands/completion.py", line 6, in <module>
  File "/tmp/tmpa9ofomci/pip-19.0.3-py2.py3-none-any.whl/pip/_internal/cli/base_command.py", line 20, in <module>
  File "/tmp/tmpa9ofomci/pip-19.0.3-py2.py3-none-any.whl/pip/_internal/download.py", line 37, in <module>
  File "/tmp/tmpa9ofomci/pip-19.0.3-py2.py3-none-any.whl/pip/_internal/utils/glibc.py", line 3, in <module>
  File "/tmp/python-build.20190724230619.3770/Python-3.7.4/Lib/ctypes/__init__.py", line 7, in <module>
    from _ctypes import Union, Structure, Array
ModuleNotFoundError: No module named '_ctypes'
make: *** [install] エラー 1
```

