import React from 'react';
import Helmet from 'react-helmet';
import {graphql} from 'gatsby';
import Layout from '../layout';
import PostListing from '../components/PostListing';
import HeaderTitle from '../components/HeaderTitle';
import SEO from '../components/SEO';
import ScrollToTopIcon from '../components/ScrollToTopIcon';
import config from '../../data/SiteConfig';
import Paginator from '../components/Paginator';
import TagList from '../components/TagList';

class Index extends React.Component {
  getTagList(postEdges) {
    const tagList = [];
    postEdges.forEach(postEdge => {
      for (const tag of postEdge.node.frontmatter.tags) {
        tagList.push({
          tags: tag
        });
      }
    });
    return tagList;
  }

  render() {
    const postEdges = this.props.data.allMarkdownRemark.edges;
    const tagList = this.getTagList(this.props.data.tagList.edges);

    return (
      <Layout location={this.props.location} title={<HeaderTitle />}>
        <div className="index-container">
          <Helmet>
            <title>{config.siteTitle}</title>
            <link rel="canonical" href={`${config.siteUrl}`} />
          </Helmet>
          <SEO postEdges={postEdges} />
          <PostListing postEdges={postEdges} />
          <Paginator pageContext={this.props.pageContext} />
          <span className="tagList-area">
            <TagList tagList={tagList} />
          </span>
          <ScrollToTopIcon />
        </div>
      </Layout>
    );
  }
}

export default Index;

export const pageQuery = graphql`
  query IndexQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: {fields: [fields___date], order: DESC}
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          fields {
            slug
            date
          }
          excerpt(truncate: true)
          timeToRead
          frontmatter {
            title
            tags
            cover
            date
          }
        }
      }
    }

    tagList: allMarkdownRemark(
      sort: {fields: [fields___date], order: DESC}
    ) {
      edges {
        node {
          frontmatter {
            tags
          }
        }
      }
    }
  }
`;
