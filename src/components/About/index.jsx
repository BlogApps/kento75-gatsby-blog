import React, {Component} from 'react';
import Card from 'react-md/lib/Cards/Card';
import CardText from 'react-md/lib/Cards/CardText';
import UserLinks from '../UserLinks';
import config from '../../../data/SiteConfig';
import './About.scss';

class About extends Component {
  render () {
    const myLinkedinUrl = config.aboutPageLinks.find (
      ele => ele.label === 'Linkedin'
    ).url;
    const myTeratailUrl = config.aboutPageLinks.find (
      ele => ele.label === 'Teratail'
    ).url;
    const mySpeakerDeckUrl = config.aboutPageLinks.find (
      ele => ele.label === 'SpeakerDeck'
    ).url;
    const myFindySkillUrl = config.aboutPageLinks.find (
      ele => ele.label === 'FindySkill'
    ).url;

    return (
      <div className="about-container md-grid mobile-fix">
        <Card className="md-grid md-cell--8">
          <div className="about-wrapper">
            <CardText>
              <h2 className="about-title">Kento75 プロフィール</h2>
              <img
                src={config.userAvatar}
                className="about-img"
                alt={config.userName}
              />
              <a href="https://www.certmetrics.com/amazon/public/badge.aspx?i=1&t=c&d=2019-02-22&ci=AWS00789666" />
              <p className="about-text md-body-1">
                {config.userDescription.split ('\n').map ((message, rowNo) => (
                  <span key={rowNo}>
                    {message}
                    <br />
                  </span>
                ))}
              </p>
              <h3>経歴</h3>
              <p>
                詳細はLinkedInに記述していますので、こちらを参照願います。
                <br />
                <a href={myLinkedinUrl}>» LinkedIn(Kento75)</a>
              </p>
              <h3>その他</h3>
              <p className="about-text md-body-2">
                気が向いた時にLTしたりしてます。
                <br />
                <a href={mySpeakerDeckUrl}>» SpeakerDeck(Kento75)</a>
                <br /><br />
                あまり活動していませんが、Teratailでの質問に回答したりしてます。
                <br />
                <a href={myTeratailUrl}>» Teratail(Kento75)</a>
              </p>
            </CardText>
          </div>
        </Card>
      </div>
    );
  }
}

export default About;
