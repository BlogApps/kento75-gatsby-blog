---
title: 【Ansible備忘録⑥】プレイブックを分割する
date: 2019-08-02T11:39:58.455Z
cover: /assets/ansible.png
slug: 【Ansible備忘録⑥】プレイブックを分割する
category: プログラミング
tags:
  - AWS
  - Linux
  - Ansible
  - Infrastructure as Code
---
実際の運用では、1つのプレイブックで管理することは少ない。

運用するには1つのプレイブックでは、プレイの数が多く保守性が悪くなるため、複数のプレイブックに分割することが多い。

Ansibleチョットデキル人やUdemyでの教材でよく取り上げられているベストプラクティスについて解説する。



<br><br>



## ロールの概要

1つのプレイブックで多くのタスクを定義すると、保守性が悪くなる。

そのため、Ansible では ロール（role）というコンポーネントが用意されている。

ロールは、プレイブックをセクションごとに分割する仕組みのこと。

例えば、Tasks セクションや Vars セクションは別のファイルに分けて管理される。

<br><br>

例）

以下のディレクトリ構成で分割、各ディレクトリにそれぞれのセクションに分けたファイルを配置する。

```
./roles
└── httpd
    ├── handlers
    ├── tasks
    └── vars
```

<br><br>



## ロールの構造

ロールを利用する時のディレクトリ構造は、以下の点に注意する必要がある。

<br>

・最上位のディレクトリは、「roles」というディレクトリ名にする。

・「roles」ディレクトリの下に、各ミドルウェアのインストール、デプロイ、OS設定等の疎結合なタスクに分割して、ディレクトリを作成する。（これをロールディレクトリとする）

　→「mysql」、「common」、「webapp」など

・各ロールディレクトリの中に、それぞれの機能ごとに分けたディレクトリを作成する。

　→「defaults」、「files」、「handlers」、「meta」、「tasks」、「templates」「vars」など

<br><br>

ロールのディレクトリは必ず必要という訳ではなく、必要なものだけを作成して実行することができる。

ただし、tasks ディレクトリだけは、 Tasks セクションの内容を定義は必ず必要となるため配置する必要がある。

<br><br>



例）

「common」と「mysql」というロールを作成する場合

※ ディレクトリ配下のYAMLは「main.yml」が固定で読み込まれる。

　それ以外のYAMLを読み込む場合は、 include する必要がある。

```
./roles
├── common                  ## ロール名
│   ├── defaults            ## ロールで使用するデフォルトの変数を定義
│   │   └── main.yml
│   ├── files               ## コピーしたり色々使うファイルを配置
│   │   ├── hoge.sh
│   │   └── hgoe.txt
│   ├── handlers            ## Handlers セクションのYAMLを配置
│   │   └── main.yml
│   ├── meta                ## ロール間の依存関係を定義したファイルを配置
│   │   └── main.yml
│   ├── tasks               ## Tasks セクションのYAMLを配置
│   │   └── main.yml
│   ├── templates           ## jinja2のテンプレートを配置
│   │   └── hoge.conf.j2
│   └── vars                ## Vars セクションのYAMLを配置
│       └── main.yml
└── mysql
    ├── defaults
    │   └── main.yml
    └── files
        ・
        ・
        ・
```

<br><br>



### defaults ディレクトリ

defaults ディレクトリは、変数の初期値を定義したYAMLファイルを配置するためのディレクトリ。

main.yml の中にテンプレートやタスクで利用する変数の初期値を設定する。（値は vars などで上書きできる）

<br><br>

例）

PostgreSQLのデフォルト変数の定義をまとめたYAML

```
postgresql_port: 3306
postgresql_bind_address: "0.0.0.0"
postgresql_root_db_pass: ansible
```

<br><br>

### files ディレクトリ

files ディレクトリは、copy モジュールなど、ファイルの操作を行う場合に使用する。

対象のターゲットノードに転送するファイルなどを配置するディレクトリ。

ここには、main.yml を配置する必要なない。

主に、webサーバーの設定ファイル(httpd.confなど)などを配布する際に使用する。

<br><br>

### handlers ディレクトリ

handlers ディレクトリは、Handlers セクションの内容を定義したYAMLファイルを配置するためのディレクトリ。

notify ディレクティブで定義されたタスク名に紐づいたタスクを呼び出せる。（プレイブックに定義した時と同じ）

<br><br>

例）

```
- name: PostgreSQL 再起動
  service:
    name: "{{ postgresql_service }}
    state: restarted
```

<br><br>

### meta ディレクティブ

meta ディレクティブは、ロールのメタ情報や依存関係を定義したYAMLファイルを配置するディレクトリ。

main.yml には、ロールの作成情報、dependencies ディレクティブを利用した依存のあるロール名の定義ができる。

<br><br>

例）

「common」、「nginx」のロール実行後に「mysql」ロールを実行したい場合

「roles/mysql/meta/main.yml」に以下のような設定をする。

後に実行したいロールのmeta ディレクティブに main.yml を配置する。

```
galaxy_info:
  author: "Ansible User"
  company: example.com
  license: GNU General Public License
  min_ansible_version: 2.0
  platforms:
    - name: Ubuntu
      versions:
        - precise
        - quantal
        - raring
        - saucy

dependencies:
  - { role: common, os_parameter: 3 }
  - { role: nginx, when: "server_groups == 'web_servers'" }
```

<br><br>

### tasks ディレクトリ

tasks ディレクトリは、Tasks セクションの内容を定義したYAMLファイルを配置するためのディレクトリ。

ロールごとに分割したタスクを定義する。tasks ディレクティブは定義せずにタスクリストを記述する。

<br><br>

例）

```
- name: PostgreSQLのインストール
  yum: name="{{ item }}" state=installed
  with_items: postgresql_pkgs

- name: 設定ファイルの配置
  template: src=postgresql.conf dest="{{ postgresql_dir }}/postgresql.conf"
  notify: restart postgresql
          ・
          ・
          ・
```

<br><br>

### templates ディレクトリ

templates ディレクトリは、template モジュールで使用するファイルを配置するためのディレクトリ。

main.yml の配置は必要ない。テンプレートファイルのみを配置する。

<br><br>

### vars ディレクティブ

vars ディレクティブは、変数を定義したYAMLファイルを配置するためのディレクトリ。

ここに定義した変数は、ロール内でのみ利用される変数となる。（ロール変数と呼ばれる）

<br><br>

例）

PostgreSQL11用の変数を定義する場合

```
postgresql_pkgs:
  - postgresql11
  - postgresql11-libs
  - postgresql11-server
  - postgresql11-docs
  - postgresql11-contrib
  - postgresql11-devel
  - postgresql11-llvmjit
  - postgresql11-plperl
  - postgresql11-plpython	
  - postgresql11-pltcl	
  - postgresql11-test

postgresql_service: postgresql
postgresql_conf_dir: "/usr/pgsql-11/bin/"
```

