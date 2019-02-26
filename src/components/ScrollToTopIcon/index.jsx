import React from "react";
import rsScroller from 'react-smooth-scroller';

class ScrollToTop extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        currentPosition: 0,
        isVisible: false,
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', event => this.watchCurrentPosition(), true)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll')
  }

  watchCurrentPosition() {
    console.log(this.scrollTop())
    if(this.scrollTop() > 0) {
      this.setState({isVisible: true});
    } else {
      this.setState({isVisible: false});    
    }
  }

  scrollTop() {
    return Math.max(
      window.pageYOffset,
      document.documentElement.scrollTop,
      document.body.scrollTop);
  }

  onScrollTop() {
    rsScroller.scrollToTop();
  }

  render() {
    return (
      <div className={['scroll-top', this.state.isVisible ? 'scroll-top-visible' : ''].join(' ')}>
        <a onClick={ () => this.onScrollTop() } className="btn hoge">button-A</a>
      </div>
    );
  };
};

export default ScrollToTop;
