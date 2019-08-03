---
title: 【Ansible備忘録⑦】先読みタスクと後読みタスク
date: 2019-08-03T02:18:37.478Z
cover: /assets/ansible.png
slug: 【Ansible備忘録⑦】先読みタスクと後読みタスク
category: プログラミング
tags:
  - Linux
  - AWS
  - Ansible
  - Infrastructure as Code
---
## タスクの実行順序

基本的にプレイブックのタスクは、定義した順番通りに実行される。

以下のような実行順序となる。

<br><br>

・変数の読み込み

・ファクト収集

・事前タスク実行

・事前タスク実行の通知ハンドラ処理

・ロール実行

・タスク実行

・ロール、タスク実行の通知ハンドラ処理

・事後タスク実行

・事後タスク実行の通知ハンドラ処理

<br><br>

事前タスク、事後タスクはタスクの前後で実行するタスクのこと。

事前タスク、事後タスクをそれぞれ、pre_tasks ディレクティブ、post_tasks ディレクティブで定義できる。

<br><br>

例）

```
- host: localhost
  gather_facts: false
  
  ## タスク実行前の処理
  pre_tasks:
    - name: パッケージアップデート
      apt:
        update_cache: yes
      notify: Apt Update
    
    - name: パッケージアップグレード
      pip:
        requirements: /myapp/requirements.txt
        virtualenv: /myapp/venv

  role:
    - common
    - nginx
    - postgresql
    - myapp
  
  tasks:
    - name: データ同期
      shell: /myapp/venv/bin/python /myapp/code/webapp/manage.py syncdb --migrate --noinput
      notify: Check Synced Data
  
  handlers:
    - name: パッケージアップデート
      debug:
        msg: "パッケージアップロード確認"
      
    - name: データ同期確認
      shell: /mpapp/venv/bin/python /myapp/code/webapp/data_check.py
  
  post_tasks:
    - name: 再起動
      command: /sbin/shutdown -r now
```

<br><br>

## 外部ファイルを読み込む

外部のYAMLファイルを読み込む方法として、「import_xxx」や「include_xxx」などがある。（xxx には vars、tasks、roles が入る）

これらの読み込みと実行順序は以下の通り。

<br><br>

・import_xxx（静的外部ファイル読み込み）

　→コマンド実行時に読み込まれる。（先読み）

・include_xxx（動的外部ファイル読み込み）

　→プレイブックの実行中に読み込まれる。動的に外部ファイルを呼び出す。（後読み）

<br><br>

これら動的読み込みと静的読み込みは、以下のように使い分けるのが良い。

<br><br>

| 種別        | 用途                                                         |
| ----------- | ------------------------------------------------------------ |
| import_xxx  | ・特定のタスクの実行<br />    →特定のタスクの実行には tags の指定が必要となるため |
| include_xxx | ・ループ処理                                                 |

