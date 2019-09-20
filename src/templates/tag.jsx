import React from 'react';
import Helmet from 'react-helmet';
import {graphql} from 'gatsby';
import Layout from '../layout';
import PostListing from '../components/PostListing';
import HeaderTitle from '../components/HeaderTitle';
import ScrollToTopIcon from '../components/ScrollToTopIcon';
import TagList from '../components/TagList';
import config from '../../data/SiteConfig';

export default class TagTemplate extends React.Component {
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
    const {tag} = this.props.pageContext;
    const postEdges = this.props.data.allMarkdownRemark.edges;
    const tagList = this.getTagList(this.props.data.tagList.edges);

    return (
      <Layout location={this.props.location} title={<HeaderTitle />}>
        <div className="tag-container">
          <Helmet>
            <title>{`Posts tagged as "${tag}" | ${config.siteTitle}`}</title>
            <link rel="canonical" href={`${config.siteUrl}/tags/${tag}`} />
          </Helmet>
          <PostListing postEdges={postEdges} />
          <span className="tagList-area">
            <TagList tagList={tagList} />
          </span>
          <ScrollToTopIcon />
        </div>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query TagPage($tag: String) {
    allMarkdownRemark(
      limit: 1000
      sort: {fields: [fields___date], order: DESC}
      filter: {frontmatter: {tags: {in: [$tag]}}}
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
            date
          }
          excerpt
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
