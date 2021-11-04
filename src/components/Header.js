import React from 'react';
import Logo from '../images/Logo.png';
import {Link} from 'react-router-dom';
import '../CSS/Header.css';
import MenuIcon from '../images/menu-icon.png';

function header() {
    return (
        <div className="header">
            <Link className="logoImgContainer" to="/">
                <img className="logoImg" src={Logo} alt="Logo"/>
            </Link>
            <div className="navBar">
                <Link className="navLink" to="/about">About Us</Link>
                <Link className="navLink" to="/report">Report a Sighting</Link>
                <Link className="navLink" to="/contact">Contact Us</Link>
            </div>
            <div className="navDropdown">
                <img className="navMenu" src={MenuIcon} alt="Menu Icon"/>
                <div className="dropdownContent">
                    <Link className="navLink" to="/">Home</Link>
                    <Link className="navLink" to="/about">About Us</Link>
                    <Link className="navLink" to="/report">Report a Sighting</Link>
                    <Link className="navLink" to="/contact">Contact Us</Link>
                </div>
            </div>
        </div>
    )
}
export default header;