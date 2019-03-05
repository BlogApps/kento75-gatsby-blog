import React from "react";
import Helmet from "react-helmet";
import PageTransition from 'gatsby-plugin-page-transitions';
import "font-awesome/scss/font-awesome.scss";
import Navigation from "../components/Navigation";
import config from "../../data/SiteConfig";
import "./index.scss";
import "./global.scss";

export default class MainLayout extends React.Component {
  isIndexPage = pathname => pathname == "/" || /\/\?/i.test(pathname)
  isAboutPage = pathname => /\/about/i.test(pathname)
  isTagsPage = pathname => /\/tags/i.test(pathname)
  isPostPage = pathname => ( !(this.isIndexPage(pathname) || this.isAboutPage(pathname) || this.isTagsPage(pathname)) )

  render() {
    const { children } = this.props;
    return (
      <PageTransition>
        <Navigation config={config} LocalTitle={this.props.title}>
          <div>
            <Helmet>
              <meta name="description" content={config.siteDescription} />
            </Helmet>
            {children}
          </div>
        </Navigation>
      </PageTransition>
    );
  }
}
