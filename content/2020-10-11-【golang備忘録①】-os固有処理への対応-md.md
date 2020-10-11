---
title: 【Golang備忘録①】 - OS固有処理への対応 -
date: 2020-10-11T10:03:43.025Z
cover: /assets/go.png
slug: Golangメモ - OS固有処理への対応 -
category: プログラミング
tags:
  - golang
---
Goでは標準パッケージだけで、ほぼほぼOSの区分なしに実装できる。
しかしそれでもWindows/Linux固有の実装というのは付きまとう。  

Goでは2つの対処方法がある。1つ目はrntime.GOOSによるOS判定による方法。  
2つ目はBuild Constraintsを利用したビルド時にOS振り分けを行う方法。  



## runtime.GOOSを使う

runtime.GOOSには実行されるOS名が格納されている。  

OSに依存した処理を分けて書きたい場合、パッケージの依存やOS特有のAPIなどが現れない場合に限りruntime.GOOSを判定して処理を分けることができる。

```go
// 例えば、bat or shellを実行するコードの場合

var cmd exec.Cmd

if runtime.GOOS == "windows" {
	cmd = exec.Command("cmd", "/c", "myapp.bat")
} else {
	cmd = exec.Command("/bin/sh", "-c", "myapp.sh")
}

err := cmd.Run()
if err != nil {
	log.Fatal(err)
}
```



GOOSで取得できる主な値の一覧

| OS      | 値      |
| ------- | ------- |
| Windows | windows |
| Linux   | linux   |
| Android | android |
  
solarisとかfreebsdとかあるけど割愛。(WindowsとLinuxあれば大体なんとかなるでしょ。)  



## Build Contraints を使う

Build Contraints とはGoのソースコードをビルドする際に指定できる条件識別、またはそれを使用したビルドの手順を指す。



Goでは次の2つの規則を使用して各環境においてビルドに含まれるソースコードを明示できる。  

- ファイル名による指定
- +buildコメントによる指定



### ファイル名による指定

次のファイルが置かれているディレクトリで `go build` を実行すると、Windowsではcommand.goとcommand_windows.goが、Linuxではcommand.goとcommand_linux.goがコンパイルされる。



- command.go
- command_windows.go
- command_linux.go

runtime.GOOSで取得できる値で指定している。

OS識別以外にCPUアーキテクチャによる指定もできるがまず使わないと思う。



### +buildコメントによる指定

ファイル単位で`+build`コメントを使用して条件を書く方法。

各OSやアーキテクチャに従ってコンパイル対象となるソースファイルを定義または、コンパイル対象から除外するといったことができる。

```go
// +build[タグ]

package main
```

`+build` コメントの下は必ず1行空ける。



```go
// 使い方1 Windowsであること
// +build windows

// 使い方2 Linux(とAndroid)ではないこと !はNOTの意味
// +build !linux

// 使い方3 LinuxまたはWindowsであること , 区切りで複数条件
// +build linux,windows
```

※ linuxを指定するとAndroidも含まれてしまう。

   Androidは含みたくない場合は以下のように明示的にする。

```go
// +build linux,!android
```



コンパイル対象から外す場合は `ignore` を付与する。

この場合、`go run` 以外できなくなる。

```go
// +build ignore
```
