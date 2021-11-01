import React from 'react';
import Logo from '../images/Logo.png';
import {Link} from 'react-router-dom';
import '../CSS/Header.css';

function header() {
    return (
        <div className="header">
            <Link to="/">
                <img className="logoImg" src={Logo} alt="Logo"/>
            </Link>
            <div className="navBar">
                <Link className="navLink" to="/about">About Us</Link>
                <Link className="navLink" to="/report">Report a Sighting</Link>
                <Link className="navLink" to="/login">Login</Link>
                <Link className="navLink" to="/contact">Contact Us</Link>
            </div>
        </div>
    )
}
export default header;