import React, { Component } from "react";
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import config from "../../../data/SiteConfig";
import "./SideAbout.scss";

class SideAbout extends Component {
  render() {
    return (
      <div className="side-about-container md-grid mobile-fix">
        <Card>
          <h3 className="side-about-title">About</h3>
          <div className="side-about-img-wrapper">
            <img
              src={config.userAvatar}
              className="side-about-img"
              alt={config.userName}
            />
          </div>
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
        </Card>
      </div>
    );
  }
}

export default SideAbout;
