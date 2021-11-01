import React from 'react';
import '../CSS/Footer.css';
import Twitter from '../images/twitter-icon.png';
import Facebook from '../images/facebook-icon.png';
import Instagram from '../images/instagram-icon.png';
import Youtube from '../images/youtube-icon.png';

function header() {
    return (
        <div className="footer">
            <div className="socials">
                <div className="socialText">
                    <span>Follow us on social media</span>
                </div>
                <div className="twitter">
                    <a href="/">
                        <img className="icon" src={Twitter}/>
                    </a>
                </div>
                <div className="facebook">
                    <a href="/">
                        <img className="icon" src={Facebook}/>
                    </a>
                </div>
                <div className="instagram">
                    <a href="/">
                        <img className="icon" src={Instagram}/>
                    </a>
                </div>
                <div className="youtube">
                    <a href="/">
                        <img className="icon" src={Youtube}/>
                    </a>
                </div>
            </div>
        </div>
    )
}
export default header;