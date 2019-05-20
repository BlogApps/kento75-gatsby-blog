import React, {Component} from 'react';
import {Link} from 'gatsby';
import {Button} from 'react-md/lib/Buttons';

import './Paginator.scss';

class Paginator extends Component {
  render () {
    const {currentPage, numPages} = this.props.pageContext;
    const isFirst = currentPage === 1;
    const isLast = currentPage === numPages;
    const prevPage = currentPage - 1 === 1
      ? '/'
      : (currentPage - 1).toString ();
    const nextPage = (currentPage + 1).toString ();

    return (
      <div className="paginator-list">
        <div>
          {!isFirst &&
            <Link to={prevPage} rel="prev">
              <Button raised secondary>← Prev</Button>
            </Link>}
        </div>
        <div>
          {!isLast &&
            <Link to={nextPage} rel="next">
              <Button raised secondary>Next →</Button>
            </Link>}
        </div>
      </div>
    );
  }
}

export default Paginator;
