---
title: 【Ansible備忘録④】プレイブックの基本
date: 2019-07-28T10:44:57.634Z
cover: /assets/ansible.png
slug: 【Ansible備忘録④】プレイブックの基本
category: プログラミング
tags:
  - AWS
  - Linux
  - Ansible
  - Infrastructure as Code
---

プレイブックは、複数の処理の塊（プレイ）定義されている。

プレイには、複数のタスクを定義し、そのタスクを実行したいホスト名やグループに関連付ることにより、一連の作業を実行できる。

つまり、プレイでは、ターゲットホストの情報とタスクの定義が必要となる。



<br>

<br>



・Targets セクション

　→ターゲットノードの特定（hosts）

・Tasks セクション

　→処理の定義（tasks）



<br>

<br>



プレイには、上記の2つのセクション以外に実行制御（handlers）と動的な値（vars）を定義できるセクションが用意されている。



<br>

<br>



・Handlers セクション

　→実行制御処理（handlers）

・Vars セクション

　→変数の設定（vars）



<br>

<br>



基本的に4つのセクションでプレイは構成される。



<br>

<br>



## Targets セクション

Targets セクションでは、プレイの中でターゲットノードの接続に関する必要な情報を定義する。

インベントリで定義したホスト名、グループ名は、hosts ディレクティブで指定できる。

また、「hosts: <パターン>」という形式で、ホスト名のパターンマッチングを定義できる。

例えば、「hosts: *.web」と指定すると、「stg.web」、「prod.web」などのパターンにマッチングするホストにのみ処理を実行できる。



<br>

<br>



例）

```
---

  # ホストは「*.web」のパターンマッチングを使用
- hosts: *.web
  # hostvars（プレイブックを適用する全マシンのfactsの集合）を有効化
  gather_facts: true
  # SSH接続に使用するユーザーを指定
  remote_user: root
  # 特権実行を有効化
  become: true
  # 対象ホストを操作するユーザーを指定
  become_user: ansible
  # 対象ホストを操作するために使用するコマンドを指定
  become_method: su

```



<br>

<br>



ホストパターンの種類

| パターン     | 内容                                                | 例                              |
| ------------ | --------------------------------------------------- | ------------------------------- |
| 全ノード指定 | すべてのホストを指定                                | all または *                    |
| レンジ指定   | 対象のレンジを指定                                  | target-node-[0:10]              |
| FQDN指定     | FQDNを指定                                          | target-node-01.ansible.com      |
| 論理和指定   | グループに所属する全ノードを指定                    | web:prod                        |
| 除外指定     | グループから「!」以降のノードやグループを除外       | web:!target-node-1              |
| 論理積指定   | 「&」で指定した双方のグループに所属するノードが対象 | web:&prod                       |
| 正規表現指定 | FQDNと正規表現を組み合わせて指定                    | ~(srv\|node).*\\.ansible\\\.com |

ホストの指定は、特に設定していない場合は「hosts: all」が暗黙で設定される。つまり、指定しなければインベントリに記載した全てのターゲットノードで実行されるので注意。



<br><br>



主な接続ディレクティブ

| ディレクティブ | 入力値                                                       | 詳細                                                         |
| -------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| gather_facts   | true / false                                                 | ターゲットノードの情報取得を行う。                           |
| connection     | ＜Connection プラグイン＞                                    | 接続方法の変更を行う。                                       |
| remote_user    | ＜ユーザー名＞                                               | SSH接続ユーザーの指定。                                      |
| port           | ＜ポート番号＞                                               | 接続ポートの指定。                                           |
| become         | true / false                                                 | 接続ユーザー以外で特権実行を行う。                           |
| become_user    | ＜ユーザー名＞                                               | ターゲットノードで処理を行うユーザーを指定。                 |
| become_method  | sudo / su / sesu / runas / pmrun / pfexec / pbrun / machinectl / ksu / enable / dzdo / doas | ターゲットノードで処理を行うコマンドを指定。<br />デフォルトでは、「sudo」が利用される。<br />「sudo」以外を利用することはあまりないと思う。 |



<br><br>



## Tasks セクション

Tasks セクションには、実行する処理の内容を定義する。

マッピング形式で定義する必要があり、Keyにモジュール名、値に書くモジュールのオプションを定義する。

Targets セクションで定義されたターゲットノードに対して、Tasks セクションで定義した処理が順番通りに実行される。



<br>

<br>



例）

```
## Targets セクションは省略

tasks:
  - name: NTPのインストール
    yum: name=ntp state=installed
  - name: NTPコンフィグファイルを配置
    template: src=ntp.conf.j2 dest=/etc/ntp.conf
```



<br><br>



## Handlers セクション

Handlers セクションでは、Tasks セクションと同様に、実行したい処理の内容を定義する。

ただし、このセクションでは、「notify」を指定したタスクが更新された場合（changed）のみ、notify と同じ名前のハンドラタスクを実行する。

if文のような使い方ができる。



<br><br>



例）

基本的な使い方は以下の通り。

```
## Targets セクションは省略

tasks:
  - name: Apache のインストール
    yum: name=httpd state=installed
  - name: コンフィグファイルを配置
    template: src=httpd.conf.j2 dest=/etc/httpd/conf/httpd.conf
    notify:
      - Restart HTTP

# 上の tasks セクションの template モジュールの結果が changed の場合実行する
handlers:
  - name: Apache をリスタート
    service: name=httpd state=restarted
```



<br>

<br>



また、「listen」という機能を使うことで、複数のハンドラを設定できる。

```
## Targets セクションは省略

tasks:
  - name: WordPress をセットアップ
    git: repo=https://github.com/WordPress/WordPress.git dest=/var/www
    notify: "Reload web contents"

# 上の tasks セクションの git モジュールの結果が changed の場合
#  notify に設定されている値と等しい値を listen に持つ ハンドラが全て実行される
handlers:
  - name: php-fpm をリスタート
    systemd: name=php-fpm state=restarted
    listen: "Reload web contents"
  - name: Apache をリスタート
    service: name=httpd state=restarted
    listen: "Reload web contents"
```



<br>

<br>



## Vars セクション

Vars セクションには、アーギュメントの動的変更や設定ファイルの再利用など、タスクを効率化するための変数を定義する。

このセクションで定義する変数は、プレイ変数と呼ばれる。

プレイ変数は以下の3つのディレクティブを利用する。



<br>

<br>



・vars

・vars_files

・vars_prompt



<br>

<br>



### vars

基本の変数は、vars ディレクティブのマッピングによって、Key に変数名、あたいに変数値を定義する。

変数名は、変数値を参照する際に利用する。



<br>

<br>



例）

```
## Targets セクション と　Tasks セクションは省略

vars:
  httpd_version: 2.4.39
  warning_test: "WARNING: Use in by Ansible User"
  contents: yes
```



### vars_files

vars_files ディレクティブでは、変数を定義した外部のYAML形式のファイルを読み込むことができる。



<br><br>



例）

外部のYAMLファイル「vars/prod_vars.yml」

```
httpd_version: 2.4.39
environments: "Production environment"
password: prod_web
contents: yes
```



<br>



外部のYAMLファイルを読み込むプレイブック

```
## Targets セクション と　Tasks セクションは省略

vars_files:
  - /vars/prod_vars.yml
```



<br><br>



### vars_prompt

vars_prompt ディレクティブでは、変数を対話形式にユーザーに問いかけることができる。

パスワードを変数としてべた書きしたくない、直接ユーザーに値を設定して欲しい場合に利用する。



<br>

<br>



例）

```
## Targets セクション と　Tasks セクションは省略

vars_prompt:
  -name: "Passphrase"
   prompt: "パスワードを入力してください。"
   private: true
   confirm: true
```



<br>

<br>



vars_prompt ディレクティブでは、以下のサブディレクトリが利用できる。

| ディレクティブ | 入力値                                                   | 詳細                                                         |
| -------------- | -------------------------------------------------------- | ------------------------------------------------------------ |
| name           | ＜文字列＞                                               | 変数名を入力する                                             |
| prompt         | ＜文字列＞                                               | 入力時のプロンプト表示文字列                                 |
| default        | ＜変数値＞                                               | デフォルトの変数値                                           |
| private        | true / false                                             | パスワードの表示・非表示を設定<br />trueの場合は非表示となる |
| encrypt        | des_crypt / md5_crypt / sha256_crypt / sh1512_crypt など | 入力値をハッシュ化しておくアルドリズムを指定する             |
| confirm        | true / false                                             | 入力値の再入力の有効化<br />trueの場合は再入力が有効となる   |
| salt_size      | ＜数値＞                                                 | 指定した数値分の文字数の salt をランダムに生成する           |



<br>

<br>



## 変数

変数は、データを一時的に記憶するための領域。

動的な値を埋め込むことで個別のファイルを作成したり、同じデータを再利用するためのコンポーネントである。



<br><br>



### 変数の定義

プレイブックでは、Vars セクション外でも変数を定義できる。

インベントリ内の変数や外部ファイルを利用した変数、またはコマンドラインで定義する等。



<br>

<br>



Ansible の変数は、プログラミング言語と同じようにグローバル変数とローカル変数に似たスコープを持つ。

参照範囲は、以下の3つのスコープに分かれている。



<br>

<br>



・グローバル領域の変数

　→全体に対して定義される変数。プレイブックのどこからでも参照できる。

　　環境変数、エクストラ変数など。

・プレイ単位の変数

　→ここのプレイ内で定義される変数。プレイ内でのみ参照できる。

　　プレイ変数、タスク変数、ロール変数など。

・ホスト単位の変数

　→各ターゲットノードに紐づく変数。紐づくホストを対象とする。

　　インベントリ変数、ファクト変数、レジスタ変数など。



<br><br>



### エクストラ変数

コマンドラインから指定する変数のことをエクストラ変数（extra variables）という。

「ansible-playbook」コマンド実行時に「-e」または「—extra-vars」オプションをつけることで定義できる。

ここで定義した変数は、プレイブック内で定義される変数よりも優先度が高く、プレイブックないで定義されていた場合は、値を上書きする。

用途としては、環境によって展開するアプリケーションの設定が異なる場合など。



<br><br>



例）

```
$ ansible-playbook -i inventory.ini web-a.yml -e "version=2.4.39 environments=prod"
```



<br><br>



### 環境変数

environment ディレクティブを利用して定義する変数を環境変数（environment variables）という。

Ansible を利用する際の環境変数のことであり、LANG、PATH、SHELLなどが「ansible_env」に構成されている。

プレイやロール内で定義でき、プレイブックすべてに適用される。

用途としては、プロキシ設定などの環境変数を追加する場合など。



<br><br>



例）

下の例のデバッグで定義している通り、「ansible_env」に値は格納される。

```
- hosts
  environment:
    http_proxy: http://proxy.demo.com:8080
    https_proxy: http://proxy.demo.com:8080
  tasks:
    - debug: var=ansible_env.http_proxy
```



<br>

<br>



### プレイ変数

プレイ変数とは、プレイ内で定義される変数。

Vars セクションで指定した「vars」、「vars_files」、「vars_prompt」などが対象。

ただし、「vars」ディレクティブだけは、タスクやロール、ブロック内でも利用できる。

これらはそれぞれ定義する場所によって名前が異なる。

タスク内で定義した変数を「タスク変数」、ロール内で定義した変数を「ロール変数」、最後にブロック内で有効な変数を「ブロック変数」と呼ぶ。



<br>

<br>



例）

```
## タスク変数の場合
- hosts: web
  tasks:
    - debug: var=target_env
      vars: target_env: stg
      
## プレイ変数の場合
- hosts: web
  vars:
    target_env: stg
  tasks:
    - debug: var=target_env
```



<br><br>



### インベントリ変数

インベントリ内で定義される変数。

インベントリ変数には、ターゲットノードごとに指定する「ホスト変数」とグループ全体に指定する「グループ変数」の２種類ある。

詳しくは、 [こちら]([https://overreact.tk/%E3%80%90-ansible%E5%82%99%E5%BF%98%E9%8C%B2%E2%91%A2%E3%80%91%E3%82%A4%E3%83%B3%E3%83%99%E3%83%B3%E3%83%88%E3%83%AA%E3%81%AE%E5%9F%BA%E6%9C%AC](https://overreact.tk/[-ansible備忘録③]インベントリの基本)) の記事を参照

<br>

<br>



### レジスタ変数

タスクの実行結果の戻り値を格納するための変数。

各タスク内に「register」ディレクティブを用意し、その後ろに変数名を定義することで戻り値をマッピング形式で格納できる。



<br><br>



例）

```
tasks:
  - name: ホスト名を取得
    shell: uname -n
    register: result

  - name: デバッグ：タスクの出力結果を表示
    debug:
      var: result
```



<br>

<br>



戻り値はマッピング形式で格納される。

```
TASK [ホスト名を取得] ****************************************************************************************************
changed: [localhost]

TASK [デバッグ：タスクの出力結果を表示] *******************************************************************************************
ok: [localhost] => {
    "result": {
        "changed": true,
        "cmd": "uname -n",
        "delta": "0:00:00.002774",
        "end": "2019-07-27 07:02:55.113354",
        "failed": false,
        "rc": 0,
        "start": "2019-07-27 07:02:55.110580",
        "stderr": "",
        "stderr_lines": [],
        "stdout": "ip-xxx-xxx-xxx-xxx.ap-northeast-1.compute.internal",
        "stdout_lines": [
            "ip-xxx-xxx-xxx-xxx.ap-northeast-1.compute.internal"
        ]
    }
}
```



<br>

<br>



戻り値の中には、共通で定義されているカテゴリが存在する。

以下はその一例である。

| 戻り値       | 型     | 詳細                                                         |
| ------------ | ------ | ------------------------------------------------------------ |
| changed      | 真偽値 | タスクの状態変更ステータスが格納される。                     |
| failed       | 真偽値 | タスクの失敗ステータスが格納される。                         |
| skipped      | 真偽値 | タスクのスッキプステータスが格納される。                     |
| msg          | 文字列 | タスクに対するメッセージが格納される。                       |
| rc           | 数値   | コマンドモジュール群を利用した場合、終了ステータスが格納される。 |
| stderr       | 文字列 | コマンドモジュール群を利用した場合、エラー出力が格納される。 |
| stderr_lines | リスト | stderr の値がリストで格納される。                            |
| stdout       | 文字列 | コマンドモジュールを利用した場合、標準出力が格納される。     |
| stdout_lines | リスト | stdout の値がリストで格納される。                            |



<br>

<br>



### ファクト変数

ターゲットノードのシステム情報が格納されている変数。

Ansible はタスクを実行する前に、ファクトと呼ばれるシステム情報を各ターゲットノードから取得し、「ansible_facts」という変数名に格納する。

ファクト変数には、ターゲットノードのネットワーク情報、ディスク、OSなどの情報が格納されている。



<br>

<br>



例）

setup モジュールでファクト変数の情報を表示

```
$ ansible localhost -i ./inventory/inventory.ini -m setup

localhost | SUCCESS => {
    "ansible_facts": {
        "ansible_all_ipv4_addresses": [
            "xxx.xxx.xxx.xxx
        ],
        "ansible_all_ipv6_addresses": [
            "abc0::123:abc:abc4:abcd"
        ],
        "ansible_apparmor": {
            "status": "disabled"
        },
        "ansible_architecture": "x86_64",
        "ansible_bios_date": "08/24/2006",
        "ansible_bios_version": "4.2.amazon",

## 長すぎるので省略
```



<br>

<br>



プレイブック内で変数を使用する

```
- hosts: localhost
  tasks:
    - name: カーネルバージョンをファイルに書き込む
      copy:
        dest: /home/ansible/tmp/test.txt
        owner: ansible
        mode: 777
        content: "{{ ansible_kernel }}"
```

ファイルを確認する。

```
$ vi /home/ansible/tmp/test.txt
```

内容は以下の通り。

プレイブックでファクト変数内の値を取得できる。

```
xxx.xxx.xxx-xxx.xxx.amzn2.x86_64
```



<br>

<br>



### 定義済み変数

Ansible の変数の中には、マジック変数という定義済みの変数が存在する。

主に、インベントリに記載れれた情報や、Ansible の環境情報を定義している。



<br>

<br>



主な定義済み変数

| 変数名                   | 詳細                                                     |
| ------------------------ | -------------------------------------------------------- |
| hostvars                 | 各ターゲットノードのファクト変数を集めた変数             |
| group_names              | 指定したターゲットノードが属するグループの一覧           |
| groups                   | 全グループとターゲットノードの一覧                       |
| inventory_hostname       | インベントリファイルに定義されたホスト名                 |
| inventory_hostname_short | ホスト名のはじめの(.)ドットまでの短縮名                  |
| inventory_dir            | インベントリファイルのディレクトリパス                   |
| inventory_file           | カレントディレクトリからのインベントリファイルの位置     |
| playbook_dir             | カレントディレクトリからのプレイブックディレクトリのパス |
| play_hosts               | インベントリに定義され、認識されたホストの一覧           |
| ansible_play_hosts       | プレイが実行されているホストの一覧                       |
| ansible_version          | Ansible のバージョン情報                                 |
| ansible_check_mode       | 実行時に「—check」をつけた場合に「true」となる           |
| role_path                | ロール実行時におけるロールのディレクトリパス             |



<br>

<br>



例えば、「hostvars」には各ターゲットノードのファクト変数や定義済み変数がマッピングされている。



<br>

<br>



### 変数の参照

Ansible では変数の参照に、Python用のテンプレートエンジンである Jinja2 を利用する。

Jinja2 テンプレートファイルの拡張子は、「.j2」を使用する。



<br>

<br>



Jinja2 では、以下の2つのフォーマットによって変数を操作する。



<br>



・{{ ・・・ }}

　→変数値の結果を表示するタグ

・{% ・・・ %}

　→変数に対する制御構文を記述するタグ



<br><br>



例）

```
## {% ・・・ %} はfor文やif文で使用される
{% for item in list %}

  ## 変数の表示には {{ ・・・ }} を使用する
	{{ item }}

{% endfor %}
```



<br><br>



### マッピングの参照

マッピングは、変数を利用して値にアクセスする。

ネスとした変数名に対しては「.」もしくは「[]」を並べて記述する。（Pythonのdict操作と同じ）



<br><br>



例）

```
vars:
  web:
		prod:
		  address: 192.168.1.10
		  ec2type: t2.large
    stg:
      address: 192.168.1.11
      ec2type: t2.medium


## 「.」を使う場合
{{ web.prod.address }}
## "web.prod.address": "192.168.1.10"


## 「[]」を使う場合
{{ web["stg"]["address"] }}
## "web.stg.address": "192.168.1.11"


## 下にマッピングがある場合
{{ web['prod'] }}
## "web['prod']": { "address": "192.168.1.10", "ec2type": "t2.large" }
```



<br>

<br>



### シーケンスの参照

シーケンスは、シーケンス番号を利用して値にアクセスする。（Pythonのlistを同じ）

シーケンスへのアクセスは、「.」または「[]」を使用する。



<br>

<br>



例）

```
vars:
  environments:
    -            ## Pythonでいう　インデックス番号0
      - prod
      - stg
    -            ## Pythonでいう インデックス番号1
      - dev


## 「.」を使う場合
{{ environments.0.1 }}
## "environments.0.1": "prod"


## 「[]」を使う場合
{{ environments[0][2] }}
## "environments[0][2]": "stg"


## 下にシーケンスがある場合
{{ environments[1] }}
## "environments[0]": ["dev"]
```



<br>

<br>



### スカラー参照

文字列や真偽値も変数としてアクセスできる。

文字列に関しては、スライスを使用できる。（Pythonのスライスと同じ）



<br>

<br>



例）

```
vars:
  title: "Kento75 に学ぶ Ansible の概念"
  title_option: True


## スライスを使用する
{{ title[0:7] }}
## "title[0:7]": "Kento75"


## 真偽値の取得
{{ title_option }}
## "title_option": true
```



<br>

<br>



### テンプレートの制御構文

テンプレートでは、変数の参照以外に、制御構文を利用して特定の条件で変数参照を選択できる。



<br>

<br>



・if 文

→if 文は、特定の条件次第で、処理の実行可否を制御できる。

　「{% if ＜条件＞ %}   処理   {% endif %} 」でブロックを囲む。



<br>

<br>



例）

```
{% if hostvars[host].ansible_host is defined %}

    client_ip = {{ hostvars[host].ansible_host }}
{% endif %}
```



<br>

<br>



・for 文

→for 文は、特定の条件下で、処理を繰り返す場合に利用する。

　「{% for item in list %}  処理   {% endfor %}」でブロックを囲む。



<br>

<br>



例）

```
{% for host in groups.all %}

    {{ host.address }}
{% endfor %}
```





<br>

<br>



### 変数フィルタ

Jinja2 の変数参照には、結果を加工して参照できるフィルタ機能がある。

変数フィルタを利用するためには、変数に「|」（パイプ）にフィルタオプションを付け、関数呼び出しのようにフィルタオプションを宣言する。



<br>

<br>



主なフィルタオプション



<br>

<br>



・default

　→変数値が未入力の場合、デフォルト値の設定を行う。

・join

　→配列の変数値同士をつなぎ合わせる。

・length

　→変数の文字数または数を返す。

・lower

　→変数値を小文字に変換する。

・upper

　→変数値を大文字に変換する。



<br>

<br>



例）

```
vars:
  developers:
    - kento
    - kento75
    - takano
    - TAKANO


## デフォルト値を設定
{{ developers[4] | default(Takano) }}
## Takano


## 変数同士をつなぎ合わせる
{{ developers | join(':') }}
## kento:kento75:takano:TAKANO


## 配列の長さを返す
{{ developers | length }}
## 4


## ユーザー名を小文字にする
{{ developers[3] | lower }}
## takano


## ユーザー名を大文字にする
{{ developers[0] | upper }}
## KENTO
```
