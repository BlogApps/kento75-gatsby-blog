import React from "react";
import ScrollUpButton from "react-scroll-up-button";

class ScrollToTop extends React.Component {

  render() {
    return (
      <div>
        <ScrollUpButton
          EasingType="easeInCubic"
          AnimationDuration={800}
        />
      </div>
    )
  };
};

export default ScrollToTop;
