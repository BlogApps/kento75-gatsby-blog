---
title: 【Ansible備忘録②】Ansible利用環境の構築
date: 2019-07-25T05:32:55.865Z
cover: /assets/ansible.png
slug: 【Ansible備忘録②】Ansible利用環境の構築
category: プログラミング
tags:
  - AWS
  - Linux
  - Ansible
  - Infrastructure as Code
---
### Ansible利用環境の事前準備

以下の４項目は抑えておきたい。



<br>
<br>


・Ansible運用ユーザーの作成

・SSH公開鍵認証の設定

・作業ディレクトリの作成

・ansible.cfgの設定



<br>
<br>


### Ansible運用ユーザーの作成

プレイブックで指定するタスクは、パッケージのインストールやOSの設定など、ユーザー権限が必要な動作が多い。

rootでやるのは危ないので、Ansible実行専用のユーザーを作成する。（ユーザー名はAnsibleとかでいいかな）

```
$ sudo useradd -s /bin/bash -m ansible

$ sudo passwd ansible
```



<br>
<br>


Ansible実行用ユーザーでも pyenv でインストールした Python を使用できるようにする。

```
# Ansible実行用ユーザーでログイン
$ su - ansible
```



.bashrcファイルに pyenv のパスを設定する。

```
$ vi $HOME/.bashrc
```

内容は以下の通り。

```
省略

# Python3 設定
export PYENV_ROOT="/usr/bin/.pyenv"
export PATH=${PYENV_ROOT}/bin:$PATH
eval "$(pyenv init -)"

# 仮想環境の設定もおまけで入れておく
eval "$(pyenv virtualenv-init -)"
```

.bashrc を読み込む。

```
$ source $HOME/.bashrc
```

Ansible をインストールする。

```
$ pip install --user ansible
```


<br>
<br>



### SSH公開鍵認証の設定

Ansibleはターゲット（ホスト、ネットワーク機器etc）に対してSSH（ポート22）を利用して接続する。

SSHにユーザー名とパスワードを利用せず、鍵認証でやる方がセキュアなのでなるべく鍵認証にする。


<br>
<br>



Amazon Linux 2のデフォルトの設定ではユーザーとパスワードによる認証はできない。

（Ansible実行サーバーとターゲットノードの両方で設定する。）

```
$ sudo vi /etc/ssh/sshd_config
```



パスワード認証を有効化する。63行目

```
# コメントアウト
#PasswordAuthentication no
# 追加
PasswordAuthentication yes
```



サービスを再起動する。（Ansible実行サーバーとターゲットノードの両方で設定する。）

```
$ sudo service sshd restart
```


<br>
<br>



Ansible 実行用ユーザーで認証用の鍵を作成して、コントロールノードとターゲットノードに鍵を配置する。

```
$ su - ansible

$ ssh-keygen

# ローカルに配置
$ ssh-copy-id -o StrictHostKeyChecking=no -i $HOME/.ssh/id_rsa.pub localhost
ssh-copy-id -o StrictHostKeyChecking=no -i $HOME/.ssh/id_rsa.pub localhost
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/home/ansible/.ssh/id_rsa.pub"
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
ansible@localhost's password: 

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh -o 'StrictHostKeyChecking=no' 'localhost'"
and check to make sure that only the key(s) you wanted were added.


# ターゲットノードにも配置
$ ssh-copy-id -o StrictHostKeyChecking=no -i $HOME/.ssh/id_rsa.pub ec2-user@ec2-xxx.xxx.xxx.xxx.ap-northeast-1.compute.amazonaws.com
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/home/ansible/.ssh/id_rsa.pub"
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
ec2-user@ec2-xxx.xxx.xxx.xxx.ap-northeast-1.compute.amazonaws.com's password: 

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh -o 'StrictHostKeyChecking=no' 'ec2-user@ec2-xxx.xxx.xxx.xxx.ap-northeast-1.compute.amazonaws.com'"
and check to make sure that only the key(s) you wanted were added.
```


<br>
<br>



### 作業ディレクトリの作成

```
$ su - ansible
$  mkdir -vp ansible_work/sec2/inventory/
```


<br>
<br>



### ansible.cfgの設定

Ansibleの設定ファイルであるansible.cfgは、置く場所によって読み込まれる優先順位が異なる。

以下の順番で検索される。


<br>
<br>



1)環境変数にファイルパスを設定（ANSIBLE_CONFIG=/usr/local_ansible/conf/ansible.cfg）

2)カレントディレクトリに存在する設定（./ansible.cfg）

3)ホームディレクトリに存在する設定（$HOME/.ansible.cfg）

4)/etc/ansible/ansible.cfg


<br>
<br>



yum でインストールした場合は、「 /etc/ansible/」配下にデフォルトの設定ファイルが生成されるが、

pip だと設定ファイルは存在しない。

どちらにしてもAnsible実行用ユーザーのホームディレクトリに設定ファイルを作成した方が運用しやすいのでホームディレクトリへの配置がオススメ。


<br>
<br>



Ansible実行用ユーザーのホームディレクトリに設定ファイルを作成する。

```
$ vi $HOME/ansible.cfg
```

内容は、以下の通り。

```
[defaults]

forks = 15
log_path = $HOME/.ansible/ansible.log
host_key_checking = False
gathering = smart
```


<br>
<br>



主な設定は以下の通り。

その他の設定値は [こちら](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) の公式サイト参照。

| 設定パラメータ    | デフォルト値 | 詳細                                                         |
| ----------------- | ------------ | ------------------------------------------------------------ |
| forks             | 5            | ターゲットノードの並列処理を行うプロセス数を設定。           |
| log_path          | -            | Ansibleの実行ログ出力場所を設定。                            |
| host_key_checking | True         | ターゲットノードにSSH接続する際の公開鍵のフィンガープリントチェックの有効化。 |
| gathering         | implicit     | ターゲットノードの詳細情報取得に関する設定。<br />・implicit<br />    →キャッシュを無視、常に情報を収集する<br />・explicit<br />    →キャッシュを利用、情報の収集は行わない<br />・smart<br />    →新規接続時のみ、情報を収集、キャッシュがある場合は収集しない |
| gather_subset     | all          | ターゲットノードの詳細情報取得を制限。<br />・all<br />    →全ての情報を収集<br />・network<br />    →最小限の情報とネットワーク情報を収集<br />・hardware<br />    →ハードウェア情報を収集<br />・virtual<br />    →最小限の情報と仮想マシンに関する情報を収集 |
| transport         | smart        | ターゲットノードへの接続方法の設定。<br />・smart<br />    →OpenSSHがControlPersist機能対応時は、「OpenSSH」で接続する。未対応であれば、Pythonモジュールの「paramiko」を利用して接続する。<br />・paramiko<br />    →Pythonのssh機能で、アクションのたびに書くホストに再接続を行う。<br />・local<br />    →SSHを利用せずに、直接ローカルホストに接続を行う。 |



<br>
<br>


ログ出力先のディレクトリを作成しておく。

```
$ mkdir $HOME/.ansible
```


<br>
<br>



## 動作確認

「ansible」コマンドと「ansible-playbook」コマンドの動作確認を行う。



<br>
<br>



### ansible コマンドの実行

「ansible」コマンドはプレイブックを用意せずに、直接モジュールを指定するコマンド。

接続対象のターゲットノードの情報を記載したインベントリを作成する。

```
$ cd $HOME/ansible_work/sec2/inventory/
$ vi test01_inventory.ini
```

下の例は、コントロールノード自身をターゲットとしている。

```
[test_servers]
localhost
```


<br>
<br>



実際に実行してみると以下のような結果となる。

ansibleコマンド実行時に警告がたくさん出た。

Pythonインタプリタを発見しようとして出たみたいだけど、動いたから良し。

```
$ ansible -i $HOME/ansible_work/sec2/inventory/test01_inventory.ini test_servers -m ping
 [WARNING]: Unhandled error in Python interpreter discovery for host localhost: unexpected output from Python
interpreter discovery

 [WARNING]: sftp transfer mechanism failed on [localhost]. Use ANSIBLE_DEBUG=1 to see detailed information

 [WARNING]: scp transfer mechanism failed on [localhost]. Use ANSIBLE_DEBUG=1 to see detailed information

 [WARNING]: Platform unknown on host localhost is using the discovered Python interpreter at /usr/bin/python, but
future installation of another Python interpreter could change this. See
https://docs.ansible.com/ansible/2.8/reference_appendices/interpreter_discovery.html for more information.

localhost | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "changed": false,
    "ping": "pong"
}
```

<br>
<br>


補足
インベントリの設定に、Pythonインタプリタのパスを明示的に設定したらインタプリタの警告は出なくなった。

```
[test_servers]
localhost ansible_python_interpreter=/usr/bin/.pyenv/shims/python
```


<br>
<br>



### ansible-playbook コマンドの実行

「ansible-playbook」コマンドは、プレイブックを利用したコマンド。

試しに、プレイブックで、ターゲットノードを操作してみる。


<br>
<br>



インベントリファイルにターゲットノードのIPアドレスを追加する。

```
$ vi $HOME/ansible_work/sec2/inventory/test02_inventory.ini
```

パブリックDNSを設定。

~~「ansible_ssh_user」~~「ansible_user」を使用してログインユーザー名を指定しておく。
※ 「ansible_ssh_user」は、バージョン2.8以降は非推奨になりそうなので、全く同じ機能をもつ「ansible_user」を使用する。

```
[test_servers]
ec2-xxx-xxx-xxx-xxx.ap-northeast-1.compute.amazonaws.com ansible_user=ec2-user
```


<br>
<br>



プレイブックを作成する。ymlで作成する。（yaml派もいるね）

```
$ vi $HOME/ansible_work/sec2/test_playbook.yml
```

内容は、ターゲットノードにディレクトリを作成して、ファイルを送信する処理を定義している。

```
---
- hosts: test_servers
  tasks:
  - name: ディレクトリ作成
    file:
      path: /home/ec2-user/tmp
      state: directory
      owner: ec2-user
      mode: 0755

  - name: hostsファイルをターゲットへコピー
    copy:
      src: /etc/hosts
      dest: /home/ec2-user/tmp/hosts
      owner: ec2-user
      mode: 0644
```


<br>
<br>



実際に実行してみると、以下のような結果となる。

```
$ ansible-playbook -i $HOME/ansible_work/sec2/inventory/test02_inventory.ini $HOME/ansible_work/sec2/test_playbook.yml

PLAY [test_servers] ****************************************************************************************************

TASK [Gathering Facts] *************************************************************************************************
ok: [ec2-3-112-221-13.ap-northeast-1.compute.amazonaws.com]

TASK [ディレクトリ作成] ********************************************************************************************************
changed: [ec2-3-112-221-13.ap-northeast-1.compute.amazonaws.com]

TASK [hostsファイルをターゲットへコピー] *********************************************************************************************
changed: [ec2-3-112-221-13.ap-northeast-1.compute.amazonaws.com]

PLAY RECAP *************************************************************************************************************
ec2-3-112-221-13.ap-northeast-1.compute.amazonaws.com : ok=3    changed=2    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
```


<br>
<br>



Ansible の実行結果ステータスの一覧は以下の通り。

| 実行結果    | ステータス | 詳細                                                         |
| ----------- | ---------- | ------------------------------------------------------------ |
| ok          | 成功       | すでに定義されているため、処理を行わなかった。               |
| changed     | 成功       | タスクで指定したステータスと異なっていたため、変更を行った。 |
| skip        | 成功       | タスク実行条件に当てはまらなかったため、処理を行わなかった。 |
| unreachable | 失敗       | ターゲットノードとの接続に失敗した。                         |
| failed      | 失敗       | タスク実行時にエラーが発生して失敗した。                     |

