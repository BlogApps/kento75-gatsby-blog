import React, {Component} from 'react';
import Card from 'react-md/lib/Cards/Card';
import CardText from 'react-md/lib/Cards/CardText';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import './SitePolicy.scss';

class SitePolicy extends Component {
  render () {
    return (
      <div className="sitepolicy-container md-grid mobile-fix">
        <Card className="md-grid md-cell--8">
          <div className="sitepolicy-wrapper">

            <CardText>
              <h2 className="sitepolicy-title">当サイトのプライバシーポリシー</h2>

              <div className="sitepolicy-desc">
                <h3>個人情報の利用目的</h3>
                当ブログでは、メールでのお問い合わせ、メールマガジンへの登録などの際に、名前（ハンドルネーム）、メールアドレス等の個人情報をご登録いただく場合がございます。
                <br />
                これらの個人情報は質問に対する回答や必要な情報を電子メールなどをでご連絡する場合に利用させていただくものであり、個人情報をご提供いただく際の目的以外では利用いたしません。
              </div>
              <div className="sitepolicy-desc">
                <h3>個人情報の第三者への開示</h3>
                当サイトでは、個人情報は適切に管理し、以下に該当する場合を除いて第三者に開示することはありません。
                <ul>
                  <li>本人のご了解がある場合</li>
                  <li>法令等への協力のため、開示が必要となる場合</li>
                </ul>
                <br />
                個人情報の開示、訂正、追加、削除、利用停止
                <br /><br />

                ご本人からの個人データの開示、訂正、追加、削除、利用停止のご希望の場合には、ご本人であることを確認させていただいた上、速やかに対応させていただきます。
                <br /><br /><br />
                アクセス解析ツールについて
                <br /><br />
                当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。<br />
                このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
                <br />
                この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。<br />
                この規約に関して、詳しくは
                <a
                  href="https://marketingplatform.google.com/about/analytics/terms/jp/"
                  target="_blank"
                  rel="noopener"
                >
                  ここ
                </a>をクリックしてください。
              </div>
              <div className="sitepolicy-desc">
                <h3>免責事項</h3>
                当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。
                <br />
                当サイトのコンテンツ・情報につきまして、可能な限り正確な情報を掲載するよう努めておりますが、誤情報が入り込んだり、情報が古くなっていることもございます。
                <br />
                当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
                <br />
              </div>
              <div className="sitepolicy-desc">
                <h3>プライバシーポリシーの変更について</h3>
                当サイトは、個人情報に関して適用される日本の法令を遵守するとともに、本ポリシーの内容を適宜見直しその改善に努めます。
                <br />
                修正された最新のプライバシーポリシーは常に本ページにて開示されます。
              </div>
            </CardText>
          </div>
        </Card>
      </div>
    );
  }
}

export default SitePolicy;
