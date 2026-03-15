import React from 'react';
import '../styles/navbar.css';
import LogoNav from '../assets/LogoNav.png'

const Navbar = () => {
  return (
    <nav className="navbar">
      <img src={LogoNav} alt="LogoNav" className="navbar-logo" style={{}}/>
      <ul className="navbar-links">
        <li><a href="#home">Chicken Breed Scanner</a></li>
        {/* <li><a href="#developer">Developer</a></li> */}
      </ul>
    </nav>
  );
};

export default Navbar;
