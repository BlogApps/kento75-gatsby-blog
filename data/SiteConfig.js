module.exports = {
  siteTitle: "Kento75 Blog", // Site title.
  siteTitleShort: "Kt Blog", // Short site title for homescreen (PWA). Preferably should be under 12 characters to prevent truncation.
  siteTitleAlt: "Kento74 Blog", // Alternative site title for SEO.
  siteLogo: "/logos/kento75.jpg", // Logo used for SEO and manifest.
  siteUrl: "https://kento75blog.netlify.com", // Domain of your website without pathPrefix.
  pathPrefix: "/gatsby-material-starter", // Prefixes all links. For cases when deployed to example.github.io/gatsby-material-starter/.
  fixedFooter: false, // Whether the footer component is fixed, i.e. always visible
  siteDescription: "Kento75 Tech Blog", // Website description used for RSS feeds/meta description tag.
  siteRss: "/rss.xml", // Path to the RSS file.
  siteFBAppID: "", // FB Application ID for using app insights
  siteGATrackingID: "", // Tracking code ID for google analytics.
  // ↓ コメント一覧の取得がなぜができない（原因不明）ためしばらく無効化
  // disqusShortname: "kento-gatsby-blog-disqus", // Disqus shortname. 後でDisqusに登録する
  postDefaultCategoryID: "Tech", // Default category for posts.
  dateFromFormat: "YYYY-MM-DD", // Date format used in the frontmatter.
  dateFormat: "DD/MM/YYYY", // Date format for display.
  userName: "Kento75", // Username to display in the author segment.
  userTwitter: "", // Optionally renders "Follow Me" in the UserInfo segment.
  userLocation: "日本, 埼玉県", // User location to display in the author segment.
  userAvatar: "/assets/kento75.jpg", // User avatar to display in the author segment.
  userDescription:
    "都内で働くエンジニア フロントエンドからインフラまで幅広くやってます。 好きな技術はReactとFirebase です。 あと、好きな女優は新垣結衣です。", // User description to display in the author segment.
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
      iconClassName: "fa fa-rss"
    },
    {
      label: "Email",
      url: "mailto:kento2github@gmail.com",
      iconClassName: "fa fa-envelope"
    }
  ],
  copyright: "Copyright © 2018. Kento75" // Copyright string for the footer of the website and RSS feed.
};
