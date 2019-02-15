import React from "react";
import PostPreview from "../PostPreview";
//import Sidebar from "../Sidebar";
import TagList from "../TagList";
import "./PostListing.scss";

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
  render() {
    const postList = this.getPostList();
    return (
      <div className="md-grid md-grid--no-spacing md-cell--middle">
        <div className="md-grid md-cell--8 mobile-fix">
          {postList.map(post => (
            <PostPreview key={post.title} postInfo={post} />
          ))}
                  <TagList postList={postList} />
        </div>
        {/* <div className="md-grid md-cell--4 mobile-fix">
          <div className="tagList-area">
            <Sidebar postList={postList}/>
            <br/>
          </div>
        </div> */}
      </div>
    );
  }
}

export default PostListing;
