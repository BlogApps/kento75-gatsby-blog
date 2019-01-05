import React, { Component } from "react";
import _ from "lodash";
import { Link } from "gatsby";
import Chip from "react-md/lib/Chips";
import { Badge } from "react-md";
import "./TagList.scss";

class TagList extends Component {
  render() {
    const { postList } = this.props;

    const tags = _.uniqWith(_.sortBy(_.map(postList, "tags")), _.isEqual);

    return (
      <div className="post-tagList-container">
        {tags &&
          tags.map(tag => (
            <Link
              key={tag}
              style={{ textDecoration: "none" }}
              to={`/tags/${_.kebabCase(tag)}`}
            >
              <Badge badgeContent={4}>
                <Chip label={tag} className="post-preview-tagList" />
              </Badge>
            </Link>
        ))}
      </div>
    );
  }
}

export default TagList;
