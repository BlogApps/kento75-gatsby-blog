---
title: mochaとnycを使ったユニットテストTips
date: 2019-08-07T03:41:03.379Z
cover: /assets/mocha.jpg
slug: Mochaとnycを使ったユニットテストTips
category: プログラミング
tags:
  - テストコード
  - Node.js
  - Mocha
  - nyc
  - カバレッジ
---
MochaはNode.jsで動く、JS用のテストフレームワークのこと。
最近は、フルスタックテストフレームワークであるJestを使うことが多いと思いますが、こちらもテストランナーのみとなっているため簡単な処理やバッチ処理に使用するには十分なフレームワークです。

<br><br>

## パッケージインストール

パッケージはいずれも最新版を使用します。

| パッケージ名 | バージョン  | 詳細       |
| ------ | ------ | -------- |
| mocha  | 6.2.0  | テストランナー  |
| nyc    | 14.1.1 | テストカバレッジ |

<br><br>

テストツールをインストールします。

```bash
# package.json作成
$ npm init -y

# テストツールをインストール
$ npm install --save-dev mocha nyc
```

<br><br>

テストコード格納用に「test」ディレクトリを作成します。
（mocha はデフォルトだと「test」ディレクトリを参照するようです。）

```bash
.
├── node_modules
├── package-lock.json
├── package.json
└── test
```

<br><br>

## テストコードを書く

ここでは、簡単なサンプルを３種類用意します。

<br><br>

### サンプル1：足し算

足し算して返すだけのコードを用意します。

この足し算を行うだけのテストコードをまずは書きます。

```javascript
// <プロジェクトルート>/add.js

function add(a, b) {

  return a + b;
}

module.exports = add;
```

<br>

「test」ディレクトリに「add.spec.js」という名前でテストコードを作成します。

テストを書くときは、関数を単位で「describe」、テストパターンでは、「it」となっています。

ここでは、期待値が等しいかはNodejs標準の「assert」を使用します。

```javascript
// テスト対象
const add = require("../add.js");
// Nodejs標準のAssertion
const assert = require("assert");

// 関数単位で囲む
describe("The add function", () => {
  // テストパターンで囲む
  it("adds two numbers", () => {

    // 計算結果
    const actual = add(1, 3);
    // 想定値
    const expected = 4;

    // 計算結果と想定値が等しいかチェック
    assert.equal(actual, expected);
  });
});
```

<br>

テスト実行用のscriptsをpackage.jsonに設定して、npm scriptで実行できるようにします。

```json
  "scripts": {
    "test": "nyc mocha"
  }
```

<br><br>

実行して挙動を確認すると、以下のようにテスト結果が表示されます。

```bash
$ npm run test

> nyc mocha

  The add function
    ✓ adds two numbers

  1 passing (7ms)

----------|----------|----------|----------|----------|-------------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------|----------|----------|----------|----------|-------------------|
All files |      100 |      100 |      100 |      100 |                   |
 add.js   |      100 |      100 |      100 |      100 |                   |
----------|----------|----------|----------|----------|-------------------|
```

<br>

カバレッジの項目はそれぞれ以下を表します。

| 項目             | 詳細                        |
| -------------- | ------------------------- |
| Stmts          | 命令網羅率を%で表示                |
| Branch         | ifやcaseなどの全ての分岐の処理が実行されたか |
| Funcs          | 実行された関数の網羅率を%で表示          |
| Line           | 実行したコードの網羅率を%で表示          |
| Uncovered Line | 実行されていないLineの対象を示す行番号     |

<br>

また、失敗するようにテストパターンを変更して実行してみます。（あくまで、コンソールの出力結果確認のため）

```javascript
// テスト対象
const add = require("../add.js");
// Nodejs標準のAssertion
const assert = require("assert");

// 関数単位で囲む
describe("The add function", () => {
  // テストパターンで囲む
  it("adds two numbers", () => {

    // 計算結果
    const actual = add(1, 3);
    // 想定値
    const expected = 3;  // ここを ３に変更

    // 計算結果と想定値が等しいかチェック
    assert.equal(actual, expected);
  });
});
```

<br>

失敗したテストは、どこが失敗したのかが表示されます。
期待値と計算結果の値も表示されます。

```bash
$ npm run test

> nyc mocha
  The add function
    1) adds two numbers

  0 passing (6ms)
  1 failing

  1) The add function
       adds two numbers:

      AssertionError [ERR_ASSERTION]: 4 == 3
      + expected - actual

      -4
      +3
      
      at Context.it (test/add.spec.js:14:12)

----------|----------|----------|----------|----------|-------------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------|----------|----------|----------|----------|-------------------|
All files |      100 |      100 |      100 |      100 |                   |
 add.js   |      100 |      100 |      100 |      100 |                   |
----------|----------|----------|----------|----------|-------------------|
```

<br><br>

### サンプル２：オブジェクトの再帰的な比較

\[]と {}は同値比較(== のこと)ではfalseとなってしまいます。
つまり、{}をサンプル1で使用した assert.equal()ではエラーとなってしまいます。
そこでオブジェクトを再帰的に比較する方法としてassert.deepEqual()が用意されています。

<br><br>

サンプルコードは以下の通り。

```javascript
// <プロジェクトルート>/parse.js

// ?key=value ==> { key: value }
const parse = (queryString) => {
  if (queryString[0] == "?") {
    queryString = queryString.substring(1);
  }

  let queries = queryString.split("&");

  const params = {};

  queries.forEach(query => {
    const queryObject = query.split("=");

    params[queryObject[0]] = queryObject[1];
  })

  return params;
}

module.exports = parse;
```

<br>

「test」ディレクトリに「parse.spec.js」という名前でテストコードを作成します。

```javascript
const assert = require("assert");
const parse = require("../parse.js");

describe("The parse function", () => {

  it("should parse a query string into an object", () => {

    const actual = parse("?by=kento75");

    const expected = {
      by: "kento75"
    };

    // deepEqualで要素が同じかを比較
    assert.deepEqual(actual, expected);
  });
});
```

<br><br>

テストを実行して挙動を確認します。

```bash
$ npm run test

> nyc mocha

  The add function
    ✓ adds two numbers

  The parse function
    ✓ should parse a query string into an object

  2 passing (8ms)

----------|----------|----------|----------|----------|-------------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------|----------|----------|----------|----------|-------------------|
All files |      100 |       50 |      100 |      100 |                   |
 add.js   |      100 |      100 |      100 |      100 |                   |
 parse.js |      100 |       50 |      100 |      100 |                 2 |
----------|----------|----------|----------|----------|-------------------|
```

<br>

ちなみに、「parse.spec.js」の比較を以下のように修正するとfailとなります。

```
    assert.equal(actual, expected);
```

<br>

比較演算子が == のためfailとなっていることがわかります。

```
$ npm run test

> nyc mocha

  The add function
    ✓ adds two numbers

  The parse function
    1) should parse a query string into an object

  1 passing (10ms)
  1 failing

  1) The parse function
       should parse a query string into an object:

      AssertionError [ERR_ASSERTION]: { by: 'kento75' } == { by: 'kento75' }
      + expected - actual

      at Context.it (test/parse.spec.js:14:12)

----------|----------|----------|----------|----------|-------------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------|----------|----------|----------|----------|-------------------|
All files |      100 |       50 |      100 |      100 |                   |
 add.js   |      100 |      100 |      100 |      100 |                   |
 parse.js |      100 |       50 |      100 |      100 |                 2 |
----------|----------|----------|----------|----------|-------------------|
```

<br><br>

### サンプル３：非同期処理のテスト

テスト対象のコードは以下の通り。
非同期で対象のIDを持つユーザーを検索する処理を関数内で定義しています。

```javascript
// <プロジェクトルート>/find.js

const users = require("./db/users");

const findById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(user => user.id === id);

      if (!user) {
        return reject(new Error(`User with id: ${id} was not found.`));
      }

      return resolve({
        message: "User found successfully",
        user
      });
    }, 10);
  });
};
```

```javascript
// <プロジェクトルート>/db/users.js

module.exports = [{
    id: 1,
    name: "Kento75"
  },
  {
    id: 2,
    name: "Test User"
  },
  {
    id: 3,
    name: "Kento Takano"
  },
];
```

<br><br>

「test」ディレクトリに「find.spec.js」という名前でテストコードを作成します。

非同期処理のテストコードを書く場合、ライブラリにもよりますが、done、return Promise、async/awaitの3通りの方法があります。
ここでは、3通りすべての方法でテストパターンを記述しています。

```javascript
const assert = require("assert");
const findById = require("../find.js");

describe("The findById function", () => {

  //////////// 正常パターン //////////// 

  // done を使用する場合
  it("should find a user by id", done => {
    // doneを使った場合
    findById(1).then((response) => {
      assert.equal(response.message, "User found successfully");

      done();
    });
  });

  // return Promiseを使用する場合
  it("should find a user by id  (Using the return promise method)", () => {
    return findById(1).then((response) => {
      assert.equal(response.message, "User found successfully");
    });
  });

  // async/await を使用する場合
  it("should find a user by id (Using async/await)", async () => {
    const response = await findById(1);

    assert.equal(response.message, "User found successfully");
  });

  
  ////////////　異常パターン //////////// 
  
  it("should reject if user is not found by id", () => {
    return findById(99).then(() => {
      assert.fail("Expected findById function to throw.");
    }, error => {
      assert.equal(error.message, "User with id: 99 was not found.");
    });
  });
});
```

<br><br>
挙動を確認すると、どれも同じくpassしていることがわかります。

```bash
$ npm run test

> nyc mocha

  The add function
    ✓ adds two numbers

  The findById function
    ✓ should find a user by id
    ✓ should find a user by id  (Using the return promise method)
    ✓ should find a user by id (Using async/await)
    ✓ should reject if user is not found by id

  The parse function
    ✓ should parse a query string into an object

  6 passing (64ms)

-----------|----------|----------|----------|----------|-------------------|
File       |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
-----------|----------|----------|----------|----------|-------------------|
All files  |      100 |       75 |      100 |      100 |                   |
 sec1      |      100 |       75 |      100 |      100 |                   |
  add.js   |      100 |      100 |      100 |      100 |                   |
  find.js  |      100 |      100 |      100 |      100 |                   |
  parse.js |      100 |       50 |      100 |      100 |                 2 |
 sec1/db   |      100 |      100 |      100 |      100 |                   |
  users.js |      100 |      100 |      100 |      100 |                   |
-----------|----------|----------|----------|----------|-------------------|
```

<br><br>

## カバレッジを確認する

nycを使用してカバレッジをコンソール上に表示できるようになり、どこがどれだけテストできているかがわか流ようになりましたが、コンソール上での確認しかできないのは不便です。
nycのオプションを使用することでカバレッジをhtmlファイルなどに出力することができます。

<br><br>

package.jsonのテストスクリプトを以下のように変更します。
「--reporter=html」をオプションに追加するだけです。

```json
"scripts": {
    "test": "nyc --reporter=html mocha"
}
```

<br><br>
オプションをつけると、コンソールに表示されていたカバレッジがcoverageディレクトリに作成されます。
コンソールには表示されなくなります。

```bash
$ npm run test

> nyc --reporter=html mocha

  The add function
    ✓ adds two numbers

  The findById function
    ✓ should find a user by id
    ✓ should find a user by id  (Using the return promise method)
    ✓ should find a user by id (Using async/await)
    ✓ should reject if user is not found by id

  The parse function
    ✓ should parse a query string into an object

  6 passing (58ms)
```

<br><br>

以下のディレクトリ構造でテストカバレッジが作成されます。

```bash
.
├── base.css
├── block-navigation.js
├── index.html
├── prettify.css
├── prettify.js
├── <プロジェクト名>
│   ├── add.js.html
│   ├── db
│   │   ├── index.html
│   │   └── users.js.html
│   ├── find.js.html
│   ├── index.html
│   └── parse.js.html
├── sort-arrow-sprite.png
└── sorter.js
```

<br><br>

「＜プロジェクトルート＞/coverage/index.html」を開くと、カバレッジ結果が表示されます。

![js-mocha-nyc-1](/assets/js-mocha-nyc-1.png)

<br>

今回のテストコードの結果は、「sec1」にあるのでクリックします。
すると、それぞれのテストコードのカバレッジが表示されます。

![js-mocha-nyc-2](/assets/js-mocha-nyc-2.png)

<br>

テストコードをクリックすると、そのモジュールのどの行を通ったのかなどが表示されます。

![js-mocha-nyc-3](/assets/js-mocha-nyc-3.png)


<br>
テストランナーとカバレッジ出力用のライブラリを組み合わせることで、どの行が通っていないかなどを可視化できるので、積極的に利用するとソフトウェアの品質向上に有効なのではないかと思います。
