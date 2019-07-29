---
title: 【Ansible備忘録⑤】プレイブックの基本-特殊なディレクティブについて-
date: 2019-07-29T02:56:48.485Z
cover: /assets/ansible.png
slug: 【Ansible備忘録⑤】プレイブックの基本-特殊なディレクティブについて-
category: プログラミング
tags:
  - Linux
  - AWS
  - Ansible
  - Infrastructure as Code
---
プレイブックの処理は、再利用性を高めるために、反復処理や条件分岐などの処理を行うための

ディレクティブが用意されている。

<br><br>

## 条件分岐

Ansible では、特定の条件の時のみタスクを実行したい時に利用する「when」ディレクティブを用意している。

<br><br>

例）

WebサーバーとDBサーバーでインストールするパッケージが異なる場合

```
tasks:
  - name: Webサーバーへ Apache のインストール
    yum: name=httpd state=installed
    when: host_role=web
  
  - name: DBサーバーへ PostgreSQL のインストール
    yum: name=postgresql11-server state=installed
		when: host_role=db
```

<br><br>

### ファクト変数との連携

ファクト変数との連携によって、サーバーに適切なタスクを指定することもできる。

<br><br>

例）

RedHat系（RedHat、CentOS、Amazon Linux2 など）は Apache をインストールする。

Debian系（Debian、Mint、Ubuntu など）はNginx をインストールする。

```
tasks:
  - name: 【RedHat】Apache のインストール
    yum: name=httpd state=installed
    when: ansible_os_family == "RedHat"
    
  - name: 【Debian】Nginx のインストール
    apt: name=nginx state=installed update_cache=yes
    when: ansible_os_family == "Debian"
```

<br><br>

### 変数フィルタとの連携

変数フィルタとの連携によって、細かなエラーハンドリングが実装できる。

レジスタ変数に処理結果（succeeded、failed、changed、skipped）が挿入されることを利用して、

「when」ディレクティブ内で変数フィルタによる条件判定を実装できる。

<br><br>

例）

```
tasks:
  - shell: /usr/bin/alias ls="ls -ltar"
    register: result
    ignore_errors: True
    
  ## result == failed の場合
  - debug: msg="失敗しました"
    when: result|failed

  ## result == changed の場合
  - debug: msg="変更しました"
    when: result|changed

  ## result == succeeded の場合
  - debug: msg="成功しました"
    when: result|succeeded

  ## result == skipped の場合
  - debug: msg="スキップされました"
    when: result|skipped
```

<br><br>

### 実行結果の取り扱い

Ansible は、タスク実行に以上が発生した場合、処理が停止してコマンドのリターンコードが返ってくるが、

成功するまで処理を継続するなど実行結果を意図的にコントロールすることができる。

<br><br>

### 実行結果の操作

Ansible は、「shell」や「command」といったコマンドモジュール群を使用すると、状態が変化していなくても「changed」という結果が返ってくる。

このままでは、変更があったのかわからないので、 Ansible は「chenged_when」というディレクティブを用意している。

「changed_when」ディレクティブを利用することで、タスクに変更があったのかどうかを判定して、「changed」にするかを決定する。

また、「failed_when」ディレクティブという「failed」にする判定を実装できるディレクティブも用意されている。

<br><br>

例）

モジュールが存在するので、「ok」にしたい場合

```
tasks:
  - name: Apache の存在確認
		command: which httpd
    register: changed_result
    changed_when: changed_result.rc != 0
```

<br>

ディレクトリすでに存在するが、「failed」にしたくない場合

```
tasks:
  - name: ディレクトリ作成
    command: mkdir /home
    register: failed_result
    failed_when: failed_result.stderr == ""
```

<br><br>

### 失敗による停止を回避

Ansible では、1つのタスクが失敗すると、そのターゲットノードではエラー対象のタスク以降のタスクは実行されない。

タスクが失敗しても後続のタスクを実行したい場合、「ignore_errors」ディレクティブを失敗する可能性のあるタスクに設定することで、失敗しても後続のタスクを実行できる。

<br><br>

例）

エラーを無視して継続する場合、「ignore_erorrs: true」を設定する。

```
tasks:
  - name: エラーを無視して継続するタスク
    shell: /bin/false
    ignore_errors: true
  
  - name: このタスクも実行される
    shell: echo "test"
```

<br>
<br>

## ループの呼び出し

同じタスクを繰り返し何度も実行したい場合、ループを利用することでタスクを再利用できる。

<br>
<br>

### with_items ディレクティブ

プレイブックの内容が重複する場合、「with_items」ディレクティブを利用することで、繰り返し表現を定義できる。

「with_items」ディレクティブの後にシーケンスで繰り返し変数に導入したい項目を定義できる。変数は「{{ item }}」という変数の中に入り、指定の値が繰り返し代入される。

<br><br>

例）

同じタスクで複数のユーザーを追加する場合

```
tasks:
  - name: ユーザーの追加（グループは管理者）
    user:
      name: "{{ item }}"
      state: present
      groups: wheel
    with_items:
      - kento75
      - takano
      - gakky
```

<br><br>

マッピングも使用できる。

<br><br>

例）

ユーザーの追加処理をユーザーごとに違うグループで行いたい場合

```
tasks:
  - name: ユーザーの追加
    user:
      name: "{{ item.name }}"
      state: present
      groups: "{{ item.groups }}"
    with_items:
      - { name: "kento75", groups: "admin" }
      - { name: "gakky", groups: "wheel" }
```

<br><br>

### with_nested ディレクティブ

「with_nested」ディレクティブは、ネストされた多重のシーケンスを交互に繰り返し呼ぶことができる。

こちらは、「with_items」と異なり、プログラミング言語のリスト構造に似ている。

<br><br>

例）

下の例では、それぞれのDBにユーザー（kento75とgakky）を追加している。

```
tasks:
  - name: DBへのユーザー追加
    postgresql_user:
      db: "{{ item[0] }}"
      name: "{{ item[1] }}"
      password: "{{ demo }}"
      priv: ALL
      state: present
    with_nested:
      - [ "dev_db", "stg_db", "prod_db" ]
      - [ "kento75", "gakky" ]
```

<br><br>

## タスクのグループ化

「block」を利用することで、指定のタスクをグループ化できる。

グループ化した全てのタスクに対して同一の「when」や「tag」などのディレクティブを指定できる。

<br><br>

例）

```
tasks:
  ## RedHat系を対象としたインストール
  - block:
    - copy: src=epel.repo dest=/etc/yml.repos.d/epel_andible.repo
    - yum: name={{ item }} state=present
      with_items:
        - libselinux-python
        - nginx
    when: ansible_os_family == "RedHat"
    
  ## Debian系を対象としたインストール
  - block:
      - apt_repository: repo="ppa:nginx/stable"
      - apt: name={{ item }} state=installed
        with_items:
          - python-selinux
          - nginx
      when: ansibe_os_family == "Debian"
  
  ## ここは共通なのでグループ化しない
  - template: src=nginx.conf.j2 dest=/etc/nginx/nginx.conf
  - service: name=nginx state=restarted
```

<br><br>

「block」には、プログラミング言語の try-catch-finally のような機能が用意されている。

通常は、「block」内でのタスクでエラーが返ってきた時点でタスクが終了してしまうが、「rescure」ディレクティブ（プログラミング言語でいうところの catch）を利用することで、エラーが発生した時のみ実行する処理を定義できる。また、常に実行する処理を「always」ディレクティブ（プログラミング言語でいうところの finally）で定義できる。

<br><br>

例）

```
tasks:
  - block:
      - command: /bin/false
      - debug: msg="command ディレクティブでエラーが発生するのでこのタスクは実行されない"
    rescure:
      - debug: msg="上でエラーが発生したのでこのタスクは実行される"
      - command: /bin/false
      - debug: msg="command ディレクティブでエラーが発生するのでこのタスクは実行されない"
    always:
      - debug: msg="常に実行されるタスク"
```

<br><br>

### その他

ループの呼び出しには、「with_dict」とか「with_sequence」など色々用意されているが、使ったことないので記載しない。
