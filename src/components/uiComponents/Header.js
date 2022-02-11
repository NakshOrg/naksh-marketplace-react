import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi"
import { useSelector, useDispatch } from 'react-redux';
import { motion } from "framer-motion"

import logo from "../../assets/svgs/logo.svg";  
import hamburgerMenu from "../../assets/svgs/hamburger-menu.svg";
import headerCross from "../../assets/svgs/header-cross.svg";
import near from "../../assets/svgs/connect-near.svg";
import profileIcon from "../../assets/svgs/profile-icon-big.svg";
import discord from "../../assets/svgs/discord.svg";
import instagram from "../../assets/svgs/instagram.svg";
import linkedIn from "../../assets/svgs/linkedIn.svg"; 
import telegram from "../../assets/svgs/telegram.svg";
import twitter from "../../assets/svgs/twitter.svg";
import { MobileSearchInput, Search } from './Search';
import configs from '../../configs';
import * as actionTypes from '../../redux/actions/actionTypes';
import './uiComponents.css';
import { Dropdown } from 'react-bootstrap';
import { _getAllArtists } from '../../services/axios/api';
import globalStyles from '../../globalStyles';

function Header() {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const walletInfo = useSelector(state => state.nearReducer.walletInfo);
    const isWalletSignedIn = useSelector(state => state.nearReducer.isWalletSignedIn);
    const userData = useSelector(state => state.nearReducer.userData);
    const searchResults = useSelector(state => state.dataReducer.searchResults);
    const loading = useSelector(state => state.dataReducer.headerSearchLoading);

    const [keyword, setkeyword] = useState("");
    const [showHeaderContents, setShowHeaderContents] = useState(false);

    const list = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
      }
      
      const item = {
        visible: { opacity: 1, x: 0 },
        hidden: { opacity: 0, x: -100 },
      }

    useEffect(() => {
      
        if(keyword) {
            dispatch({type: actionTypes.HEADER_SEARCH_LOADING, payload: true});
            _getAllArtists({search: keyword, sortBy: 'createdAt', sort: -1, createdBy: 0})
            .then(({ data }) => {
                dispatch({type: actionTypes.SEARCH_RESULTS, payload: {artists: data.artists, searchKeyword:keyword}});
                dispatch({type: actionTypes.HEADER_SEARCH_LOADING, payload: false});
            })
            .catch(err => {
                dispatch({type: actionTypes.HEADER_SEARCH_LOADING, payload: false});
            })
        }

    }, [keyword]);

    function resetSearch() {
        setkeyword("");
        dispatch({type: actionTypes.SEARCH_RESULTS, payload: {artists: [], searchKeyword: ""}});
    }
    

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

    function navigateItem(path) {
        setShowHeaderContents(false);
        navigate(path);
    }

    return (
        <>
        <div className="header">
            <div style={{display:'flex', alignItems:'center', width:'50%'}}>
                <NavLink style={{color:"#fff"}} to="/">
                    <img className="logo" src={logo} alt="logo"/>
                </NavLink>
                <Search
                    keyword={keyword}
                    onChange={(e) => setkeyword(e.target.value)}
                    loading={loading}
                    resetSearch={resetSearch}
                    searchResults={searchResults}
                />
            </div>
            <div className='header-nav-container'>
                <div style={{marginRight:70}} className="header-nav-items">
                    <Dropdown>
                        <NavLink style={{color:"#fff"}} to="/browse">
                            <Dropdown.Toggle className="header-item" style={{letterSpacing:1.5, backgroundColor:"transparent", outline:"none", border:"none"}} id="dropdown-autoclose-true">
                                BROWSE
                            </Dropdown.Toggle>
                        </NavLink>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle className="header-item" style={{letterSpacing:1.5, backgroundColor:"transparent", outline:"none", border:"none"}} id="dropdown-autoclose-true">
                            ABOUT<FiChevronDown size={15} color="#fff"/>
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={menuStyle} id="dropdown-basic-content">
                            <Dropdown.Item onClick={() => navigate("/aboutnaksh")}>About Naksh</Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate("/ourartists")} style={{marginTop:15}}>Our Artists</Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate("/nearprotocol")} style={{marginTop:15}}>NEAR Protocol</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle className="header-item" style={{letterSpacing:1.5, backgroundColor:"transparent", outline:"none", border:"none"}} id="dropdown-autoclose-true">
                            RESOURCES<FiChevronDown size={15} color="#fff"/>
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={menuStyle} id="dropdown-basic-content">
                            <Dropdown.Item onClick={() => navigate("/blogs")}>Blogs</Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate("/helpcenter")} style={{marginTop:15}}>Help Center</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                {isWalletSignedIn ?
                <Dropdown>
                    <Dropdown.Toggle className='profile-icon' style={{backgroundColor:"transparent", outline:"none", border:"none"}} id="dropdown-autoclose-true">
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
                    className="connect-near"
                >
                    <img src={near} alt="near"/>
                </div>}
            </div>          
        </div>
        <div className="header-mobile">
            <div style={{...globalStyles.flexRowSpace, width:"100%"}}>
                <NavLink style={{color:"#fff"}} to="/">
                    <img className="logo" src={logo} alt="logo"/>
                </NavLink>
                {!showHeaderContents && <div onClick={() => setShowHeaderContents(true)}>
                    <img src={hamburgerMenu} alt="hamburger-menu"/>
                </div>}
            </div>
            {showHeaderContents && <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={list}
                    className='header-contents-container'
                >
                <div className='header-gradient'/>
                <MobileSearchInput
                    keyword={keyword}
                    onChange={(e) => setkeyword(e.target.value)}
                    loading={loading}
                    resetSearch={resetSearch}
                    searchResults={searchResults}
                />
                <div onClick={() => navigateItem("/browse")}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={item}
                    >
                        browse
                    </motion.div>
                </div>
                {isWalletSignedIn && <div onClick={() => navigateItem("/userprofile")}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={item}
                    >
                        Profile
                    </motion.div>
                </div>}
                <div onClick={() => navigateItem("/aboutnaksh")}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={item}
                    >
                        About NAKSH
                    </motion.div>
                </div>
                <div onClick={() => navigateItem("/ourartists")}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={item}
                    >
                        OUR ARTISTS
                    </motion.div>
                </div>
                <div onClick={() => navigateItem("/nearprotocol")}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={item}
                    >
                        near protocol
                    </motion.div>
                </div> 
                <div onClick={() => navigateItem("/blogs")}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={item}
                    >
                        BLOGS
                    </motion.div>
                </div>
                <div onClick={() => navigateItem("/helpcenter")}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={item}
                    >
                        HELP CENTER
                    </motion.div>
                </div>
                <div className="icons-container" style={{...globalStyles.flexRow}}>
                    <div><img style={{height:15}} src={discord} alt='discord'/></div>
                    <div><img style={{height:15}} src={instagram} alt='instagram'/></div>
                    <div><img style={{height:15}} src={twitter} alt='twitter'/></div>
                    <div><img style={{height:15}} src={linkedIn} alt='linkedIn'/></div>
                    <div><img style={{height:15}} src={telegram} alt='telegram'/></div>
                </div>
                <div style={{textAlign:'center', marginTop:30}}>
                    <div 
                        onClick={isWalletSignedIn ? walletSignOut : walletSignIn}
                        className="connect-near"
                        style={{margin:0, padding:"10px 0"}}
                    >
                        {isWalletSignedIn ? "Logout" : <img src={near} alt="near"/>}
                    </div>
                    <img onClick={() => setShowHeaderContents(false)} style={{marginTop:25, height:40}} src={headerCross} alt={"headerCross"}/>
                </div>
            </motion.div>}
        </div>
        </>
    )
}

export default Header
