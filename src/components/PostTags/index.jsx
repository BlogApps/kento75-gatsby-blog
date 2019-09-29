import React, {Component} from 'react';
import kebabCase from 'lodash.kebabCase';
import {Link} from 'gatsby';
import Chip from 'react-md/lib/Chips';
import './PostTags.scss';

class PostTags extends Component {
  getTagList (tags) {
    const tagList = [];
    tags.sort ((a, b) => (a < b ? -1 : 1));

    tags.forEach (tag => {
      tagList.push (
        <Link
          key={tag}
          style={{textDecoration: 'none'}}
          to={`/tags/${kebabCase (tag)}`}
        >
          <Chip label={tag} className="post-preview-tags" />
        </Link>
      );
    });
    return tagList;
  }
  render () {
    const {tags} = this.props;
    const tagList = this.getTagList (tags);
    return (
      <div className="post-tag-container">
        {tagList && tagList}
      </div>
    );
  }
}

export default PostTags;
