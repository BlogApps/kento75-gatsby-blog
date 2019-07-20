import React from 'react';
import PostPreview from '../PostPreview';
import './PostListing.scss';

class PostListing extends React.Component {
  getPostList() {
    const postList = [];
    this.props.postEdges.forEach(postEdge => {
      postList.push({
        path: postEdge.node.fields.slug,
        tags: postEdge.node.frontmatter.tags,
        cover: postEdge.node.frontmatter.cover,
        title: postEdge.node.frontmatter.title,
        date: postEdge.node.fields.date,
        excerpt: postEdge.node.excerpt,
        timeToRead: postEdge.node.timeToRead
      });
    });
    return postList;
  }

  getPostPreview(postList) {
    const previewList = [];
    // 日付順にソート（降順）
    postList.sort((a, b) => (a.date < b.date ? 1 : -1));

    postList.forEach(post => {
      previewList.push(<PostPreview key={post.title} postInfo={post} />);
    });
    return previewList;
  }

  render() {
    const postList = this.getPostList();
    const previewList = this.getPostPreview(postList);
    return (
      <div className="md-grid md-grid--no-spacing md-cell--middle">
        <div className="md-grid md-cell--8 mobile-fix">{previewList}</div>
      </div>
    );
  }
}

export default PostListing;
