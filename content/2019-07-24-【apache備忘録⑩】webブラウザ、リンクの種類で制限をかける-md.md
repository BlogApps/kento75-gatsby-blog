---
title: 【Apache備忘録⑩】Webブラウザ、リンクの種類で制限をかける
date: 2019-07-24T00:58:26.539Z
cover: /assets/apache.png
slug: 【Apache備忘録⑩】Webブラウザ、リンクの種類で制限をかける
category: プログラミング
tags:
  - Apache
  - Linux
  - AWS
  - セキュリティ
---
## Webブラウザの種類で制限をかける

HTTPのリクエストヘッダーには、Webブラウザの種類（User-Agent）が含まれている。

Apacheでは、 User-Agent を使用してアクセス制限を実装できる。



<br>



### 設定ファイルを変更 

設定ファイルを変更する。

```
$ sudo vi /etc/httpd/conf/httpd.conf
```



下の設定は、User-Agent に「Chrome」が含まれる場合は許可する。

Apache2.2までは「BrowserMatch」で許可するブラウザを設定していたが、Apache2.4からは正規表現で設定するらしい。



```
# Further relax access to the default document root:
<Directory "/var/www/html">
    #
    # Possible values for the Options directive are "None", "All",
    # or any combination of:
    #   Indexes Includes FollowSymLinks SymLinksifOwnerMatch ExecCGI MultiViews
    #
    # Note that "MultiViews" must be named *explicitly* --- "Options All"
    # doesn't give it to you.
    #
    # The Options directive is both complicated and important.  Please see
    # http://httpd.apache.org/docs/2.4/mod/core.html#options
    # for more information.
    #
    Options Indexes FollowSymLinks

    #
    # AllowOverride controls what directives may be placed in .htaccess files.
    # It can be "All", "None", or any combination of the keywords:
    #   Options FileInfo AuthConfig Limit
    #
    AllowOverride None

    #
    # Controls who can get stuff from this server.
    #
    # ↓ コメントアウト
    #Require all granted

    # ↓ 追加
    <RequireAll>
      Require all denied
      Require expr %{HTTP_USER_AGENT} =~ /Chrome/
    </RequireAll>
</Directory>
```



<br>



## リンクを制限する

HTTPのリクエストヘッダーには、リンク元のURL情報（Referer）が入っている。

Apacheはリンク元によってアクセスの許可、禁止の制限を実装できる。



<br>



### 設定ファイルを変更する



設定ファイルを変更する。

```
$ sudo vi /etc/httpd/conf/httpd.conf
```



下の設定は、Referer に「kento.co.jp」が含まれる場合は許可する。

```
# Further relax access to the default document root:
<Directory "/var/www/html">
    #
    # Possible values for the Options directive are "None", "All",
    # or any combination of:
    #   Indexes Includes FollowSymLinks SymLinksifOwnerMatch ExecCGI MultiViews
    #
    # Note that "MultiViews" must be named *explicitly* --- "Options All"
    # doesn't give it to you.
    #
    # The Options directive is both complicated and important.  Please see
    # http://httpd.apache.org/docs/2.4/mod/core.html#options
    # for more information.
    #
    Options Indexes FollowSymLinks

    #
    # AllowOverride controls what directives may be placed in .htaccess files.
    # It can be "All", "None", or any combination of the keywords:
    #   Options FileInfo AuthConfig Limit
    #
    AllowOverride None

    #
    # Controls who can get stuff from this server.
    #
    # ↓ コメントアウト
    #Require all granted

		# ↓ 追加
		SetEnvIf Referer "kento¥.co¥.jp" kento
    <RequireAll>
		  Require all denied
		  Require env kento
    </RequireAll>
</Directory>
```

