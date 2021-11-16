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
                    <a aria-label="Twitter" href="/">
                        <img width="30px" height="30px" className="icon" src={Twitter} alt="Twitter Icon"/>
                    </a>
                </div>
                <div className="facebook">
                    <a aria-label="Facebook" href="/">
                        <img width="30px" height="30px" className="icon" src={Facebook} alt="Facebook Icon"/>
                    </a>
                </div>
                <div className="instagram">
                    <a aria-label="Instagram" href="/">
                        <img width="30px" height="30px" className="icon" src={Instagram} alt="Instagram Icon"/>
                    </a>
                </div>
                <div className="youtube">
                    <a aria-label="Youtube" href="/">
                        <img width="30px" height="30px" className="icon" src={Youtube} alt="Youtube Icon"/>
                    </a>
                </div>
            </div>
        </div>
    )
}
export default header;