import React from 'react';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';

import logo from "../../assets/svgs/logo.svg";
import near from "../../assets/svgs/connect-near.svg";
import Search from './Search';
import './uiComponents.css';

function Header() {
    return (
        <div class="header">
            <div style={{display:'flex', alignItems:'center', width:'55%'}}>
                <img className="logo" src={logo} alt="logo"/>
                <Search/>
            </div>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'45%'}}>
                <div className="header-nav-items">
                    <div>BROWSE</div>
                    <div>ABOUT</div>
                    <div>RESOURCES</div>
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
