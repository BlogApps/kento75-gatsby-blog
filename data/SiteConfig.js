module.exports = {
  siteTitle: "overreact", // Site title.
  siteTitleShort: "雑食系フロントエンドエンジニアのブログ", // Short site title for homescreen (PWA). Preferably should be under 12 characters to prevent truncation.
  siteTitleAlt: "overreact", // Alternative site title for SEO.
  siteLogo: "/logos/kento75.jpg", // Logo used for SEO and manifest.
  siteUrl: "https://overreact.tk", // Domain of your website without pathPrefix.
  pathPrefix: "/post", // Prefixes all links. For cases when deployed to example.github.io/post/.
  fixedFooter: false, // Whether the footer component is fixed, i.e. always visible
  siteDescription: "雑食系フロントエンドエンジニアのブログ", // Website description used for RSS feeds/meta description tag.
  siteRss: "/rss.xml", // Path to the RSS file.
  siteFBAppID: "", // FB Application ID for using app insights
  siteGATrackingID: "", // Tracking code ID for google analytics.
  headerTitle: "overreact",
  // ↓ コメント一覧の取得がなぜができない（原因不明）ためしばらく無効化
  // disqusShortname: "kento-gatsby-blog-disqus", // Disqus shortname. 後でDisqusに登録する
  postDefaultCategoryID: "プログラミング", // Default category for posts.
  dateFromFormat: "YYYY-MM-DD", // Date format used in the frontmatter.
  dateFormat: "YYYY/MM/DD", // Date format for display.
  addTime: 9,  // Netlifyではタイムゾーンが設定できないため一律 9時間プラスする
  userName: "Kento75", // Username to display in the author segment.
  userTwitter: "Kento751", // Optionally renders "Follow Me" in the UserInfo segment.
  userLocation: "日本, 埼玉県", // User location to display in the author segment.
  userAvatar: "/logos/kento75.jpg", // User avatar to display in the author segment.
  userDescription:
    "都内で働くエンジニア フロントエンドからインフラまで幅広くやってます。 好きな技術は React と Firebase です。\nQiita でも記事を書いていますので、いいねもらえると嬉しいです(^_^)\nあと、好きな女優は新垣結衣です。", // User description to display in the author segment.
  // Links to social profiles/projects you want to display in the author segment/navigation bar.
  userLinks: [
    {
      label: "GitHub",
      url: "https://github.com/Kento75",
      iconClassName: "fa fa-github"
    },
    {
      label: "Twitter",
      url: "https://twitter.com/Kento751",
      iconClassName: "fa fa-twitter"
    },
    {
      label: "Qiita",
      url: "https://qiita.com/Kento75",
      iconClassName: "fa fa-bold"
    },
    {
      label: "Email",
      url: "mailto:kento2github@gmail.com",
      iconClassName: "fa fa-envelope"
    },
    {
      label: "RSS",
      url: "https://kento75blog.netlify.com/rss.xml",
      iconClassName: "fa fa-rss"
    }
  ],
  copyright: "Copyright © 2018. Kento75" // Copyright string for the footer of the website and RSS feed.
};
