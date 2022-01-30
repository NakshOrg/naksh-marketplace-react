import React from 'react';
import { NavLink } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi"
import { useSelector, useDispatch } from 'react-redux';

import logo from "../../assets/svgs/logo.svg";
import near from "../../assets/svgs/connect-near.svg";
import { Search } from './Search';
import configs from '../../configs';
import * as actionTypes from '../../redux/actions/actionTypes';
import './uiComponents.css';

function Header() {
    
    const dispatch = useDispatch();
    const walletInfo = useSelector(state => state.nearReducer.walletInfo);
    const isWalletSignedIn = useSelector(state => state.nearReducer.isWalletSignedIn);

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
            <div style={{display:'flex', alignItems:'center', width:'55%'}}>
                <NavLink style={{color:"#fff"}} to="/">
                    <img className="logo" src={logo} alt="logo"/>
                </NavLink>
                <Search/>
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
                {isWalletSignedIn ?
                <div onClick={walletSignOut}>Disconnect</div> :
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
