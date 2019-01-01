import React, { Component } from "react";
import _ from "lodash";
import { Link } from "gatsby";
import Chip from "react-md/lib/Chips";

class TagList extends Component {
  render() {
    const { postList } = this.props;

    const tags = _.uniqWith(_.sortBy(_.map(postList, "tags")), _.isEqual);

    return (
      <div className="post-tag-container">
        {tags &&
          tags.map(tag => (
            <Link
              key={tag}
              style={{ textDecoration: "none" }}
              to={`/tags/${_.kebabCase(tag)}`}
            >
              <Chip label={tag} className="post-preview-tags" />
            </Link>
          ))}
      </div>
    );
  }
}

export default TagList;
