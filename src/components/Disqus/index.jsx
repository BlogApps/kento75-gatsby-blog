import React, {Component} from 'react';
import {Disqus as ShowDisqus, CommentCount} from 'gatsby-plugin-disqus';
import config from '../../../data/SiteConfig';

class Disqus extends Component {
  render () {
    const {slug, identifier, title} = this.props;
    let disqusConfig = {
      url: `${config.siteUrl + '/' + slug}`,
      identifier: identifier,
      title: title,
    };

    return (
      <React.Fragment>
        <CommentCount config={disqusConfig} placeholder={''} />
        <ShowDisqus config={disqusConfig} />
      </React.Fragment>
    );
  }
}

export default Disqus;
