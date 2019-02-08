import React, { Component } from "react";
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import config from "../../../data/SiteConfig";
import "./SideAbout.scss";

class SideAbout extends Component {
  render() {
    return (
      <div className="side-about-container md-grid mobile-fix">
          <div className="side-about-wrapper">
            <img
              src={config.userAvatar}
              className="side-about-img"
              alt={config.userName}
            />
            <CardText>
              <p className="side-about-text md-body-1">
                {/* 改行コードごとにbrタグを生成 */}
                {config.userDescription.split("\n").map((message, rowNo) => (
                  <span key={rowNo}>
                    {message}
                    <br />
                  </span>
                ))
              }
              </p>
            </CardText>
          </div>
      </div>
    );
  }
}

export default SideAbout;
