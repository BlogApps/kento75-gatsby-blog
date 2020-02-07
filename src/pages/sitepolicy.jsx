import React, {Component} from 'react';
import Helmet from 'react-helmet';
import Layout from '../layout';
import SitePolicy from '../components/SitePolicy';
import HeaderTitle from '../components/HeaderTitle';
import config from '../../data/SiteConfig';

class SitePolicyPage extends Component {
  render() {
    return (
      <Layout location={this.props.location} title={<HeaderTitle />}>
        <div className='sitepolicy-container'>
          <Helmet>
            <title>{`Site Policy | ${config.siteTitle}`}</title>
            <link rel='canonical' href={`${config.siteUrl}/sitepolicy/`} />
          </Helmet>
          <SitePolicy />
        </div>
      </Layout>
    );
  }
}

export default SitePolicyPage;
