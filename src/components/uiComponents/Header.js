import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi"
import { useSelector, useDispatch } from 'react-redux';

import logo from "../../assets/svgs/logo.svg";
import near from "../../assets/svgs/connect-near.svg";
import profileIcon from "../../assets/svgs/profile-icon-big.svg";
import { Search } from './Search';
import configs from '../../configs';
import * as actionTypes from '../../redux/actions/actionTypes';
import './uiComponents.css';
import { Dropdown } from 'react-bootstrap';

function Header() {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const walletInfo = useSelector(state => state.nearReducer.walletInfo);
    const isWalletSignedIn = useSelector(state => state.nearReducer.isWalletSignedIn);
    const userData = useSelector(state => state.nearReducer.userData);

    const menuStyle = {
        padding:15,
        fontSize:15, 
        // background: "rgba(0, 5, 19, 0.7)", 
        backdropFilter: "blur(20px)",
        // transform: "translate(0px, 45px)",
        marginTop: 12,
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px"
    }

    function walletSignIn() {
        if(walletInfo) {
            walletInfo.requestSignIn({
                successUrl: configs.appUrl,
                failureUrl: `${configs.appUrl}/404`
            });
        }
    };

    function walletSignOut() {
        walletInfo.signOut();
        dispatch({type: actionTypes.IS_WALLET_SIGNED_IN, payload: false});
    }

    return (
        <div className="header">
            <div style={{display:'flex', alignItems:'center', width:'50%'}}>
                <NavLink style={{color:"#fff"}} to="/">
                    <img className="logo" src={logo} alt="logo"/>
                </NavLink>
                <Search/>
            </div>
            <div className='header-nav-container'>
                <div className="header-nav-items">
                    <Dropdown className="d-inline mx-2">
                        <NavLink style={{color:"#fff"}} to="/browse">
                            <Dropdown.Toggle style={{letterSpacing:1.5, fontSize:12, backgroundColor:"transparent", outline:"none", border:"none"}} id="dropdown-autoclose-true">
                                BROWSE
                            </Dropdown.Toggle>
                        </NavLink>
                    </Dropdown>
                    <Dropdown className="d-inline mx-2">
                        <Dropdown.Toggle style={{letterSpacing:1.5, fontSize:12, backgroundColor:"transparent", outline:"none", border:"none"}} id="dropdown-autoclose-true">
                            ABOUT<FiChevronDown size={15} color="#fff"/>
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={menuStyle} id="dropdown-basic-content">
                            <Dropdown.Item onClick={() => navigate("/aboutnaksh")}>About Naksh</Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate("/ourartists")} style={{marginTop:15}}>Our Artists</Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate("/nearprotocol")} style={{marginTop:15}}>NEAR Protocol</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className="d-inline mx-2">
                        <Dropdown.Toggle style={{letterSpacing:1.5, fontSize:12, backgroundColor:"transparent", outline:"none", border:"none"}} id="dropdown-autoclose-true">
                            RESOURCES<FiChevronDown size={15} color="#fff"/>
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={menuStyle} id="dropdown-basic-content">
                            <Dropdown.Item onClick={() => navigate("/blogs")}>Blogs</Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate("/helpcenter")} style={{marginTop:15}}>Help Center</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                {isWalletSignedIn ?
                <Dropdown className="d-inline mx-2">
                    <Dropdown.Toggle style={{backgroundColor:"transparent", outline:"none", border:"none"}} id="dropdown-autoclose-true">
                        <img style={{height:40, width:40, borderRadius:40, objectFit:"cover"}} src={userData?.image ?? profileIcon} alt="profileIcon"/>
                        {" "}<FiChevronDown size={15} color="#fff"/>
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{padding:15, fontSize:15}} id="dropdown-basic-content">
                        <Dropdown.Item onClick={() => navigate("/userprofile")}>View Profile</Dropdown.Item>
                        <Dropdown.Item onClick={walletSignOut} style={{marginTop:15}}>Log Out</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                :
                <div 
                    onClick={walletSignIn}
                    style={{    
                        border: '1px solid #fff',
                        borderRadius: '4px',
                        padding: '9px 12px',
                        cursor:'pointer'
                    }}
                >
                    <img src={near} alt="near"/>
                </div>}
            </div>          
        </div>
    )
}

export default Header
