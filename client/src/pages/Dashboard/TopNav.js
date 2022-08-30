import React, { useEffect, useState} from 'react';
import { Link } from "react-router-dom";
import { Icon } from '@iconify/react';
import SearchBar from './SearchBar';

// CSS imports
import "./TopNav.css";
import logo from "../assets/LOGO-BLACK.png";
// <Link to="/add-artefact" className="add-artefact"></Link>
// <img width="30px" src={logo} alt="logo"/>

const TopNav = ({sideNavOpen, openSideNav}) => {
    return (
        <nav className="topnav">
            <div className="nav-icon" onClick={() => openSideNav()}>
                <Icon icon="charm:menu-hamburger"/>
            </div>
            <div className="topnav-left">
            </div>
            <div className="topnav-right">

                <div className="list-icon">
                    <Icon icon="charm:layout-list" />
                </div>

                <div className="search-bar">
                    <SearchBar />
                </div>

                <div className='add-button'>
                    <Link to={`/addartefact`}>
                        Add Artefact
                        <Icon icon="akar-icons:plus" />
                    </Link>
                </div>

            </div>
        </nav>
    );
};

export default TopNav;