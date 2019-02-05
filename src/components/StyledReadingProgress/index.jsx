import React, { Component } from "react";
import ReadingProgress from 'react-reading-progress'
import "./StyledReadingProgress.scss";

class StyledReadingProgress extends Component {
  render() {
    return (
      <div className="wrapper-reading-progress">
        <ReadingProgress className="reading-progress" />
      </div>
    );
  }
}

export default StyledReadingProgress;