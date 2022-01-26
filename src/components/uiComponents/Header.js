import React from 'react';
import { NavLink } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi"

import logo from "../../assets/svgs/logo.svg";
import near from "../../assets/svgs/connect-near.svg";
import { Search } from './Search';
import './uiComponents.css';

function Header() {
    
    return (
        <div className="header">
            <div style={{display:'flex', alignItems:'center', width:'55%'}}>
                <NavLink style={{color:"#fff"}} to="/">
                    <img className="logo" src={logo} alt="logo"/>
                </NavLink>
                {/* <Search/> */}
            </div>
            <div className='header-nav-container'>
                <div className="header-nav-items">
                    <NavLink style={{color:"#fff"}} to="/browse">
                        <div style={{letterSpacing:1.5}}>BROWSE</div>
                    </NavLink>
                    <NavLink style={{color:"#fff"}} to="/about">
                        <div style={{letterSpacing:1.5}}>
                            ABOUT<FiChevronDown size={15} color="#fff"/>
                        </div>
                    </NavLink>
                    <NavLink style={{color:"#fff"}} to="/blogs">
                        <div style={{letterSpacing:1.5}}>
                            RESOURCES<FiChevronDown size={15} color="#fff"/>
                        </div>
                    </NavLink>
                </div>
                <div 
                    style={{    
                        border: '1px solid #fff',
                        borderRadius: '4px',
                        padding: '9px 12px',
                        cursor:'pointer'
                    }}
                >
                    <img src={near} alt="near"/>
                </div>
            </div>          
        </div>
    )
}

export default Header
