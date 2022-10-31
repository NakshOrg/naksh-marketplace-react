import React, { useState, useEffect } from 'react';
import { NavLink, useHistory, useLocation } from "react-router-dom";
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
import { _getAllArtists, _getNftArtists, _postArtist } from '../../services/axios/api';
import globalStyles from '../../globalStyles';
import { helpers } from '../../constants';
import ConnectWallet from './ConnectWallet';
import { useAppContext } from '../../context/wallet';
import { useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import UpdateProfileModal from './UpdateProfileModal';
import { ethers } from 'ethers';

function Header() {
    
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const walletInfo = useSelector(state => state.nearReducer.walletInfo);
    const isWalletSignedIn = useSelector(state => state.nearReducer.isWalletSignedIn);
    const userData = useSelector(state => state.nearReducer.userData);
    const searchResultsArtists = useSelector(state => state.dataReducer.searchResultsArtists);
    const searchResultsNfts = useSelector(state => state.dataReducer.searchResultsNfts);
    const loading = useSelector(state => state.dataReducer.headerSearchLoading);

    const [keyword, setkeyword] = useState("");
    const [showHeaderContents, setShowHeaderContents] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updateProfileModal, setUpdateProfileModal] = useState(false)

    const { evmWalletData, isEVMWalletSignedIn, setIsEVMWalletSignedIn, setEVMWalletData } = useAppContext()
    const { disconnect } = useDisconnect()
    const { openConnectModal } = useConnectModal()

    const isSearchPage = location.pathname === "/searchresults/nfts" || location.pathname === "/searchresults/artists";

    useEffect(() => {

        if (!isSearchPage) {
            resetSearch();
        }

    }, [location]);

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

    useEffect(() => {
        if(evmWalletData) {
            _getNftArtists({
              artist: ethers.utils.getAddress(evmWalletData.address),
              owner: ethers.utils.getAddress(evmWalletData.address),
            }).then(({ data: { artist, owner } }) => {
              console.log(artist, "dsa")
                if(!artist) {
                _postArtist({
                  name: evmWalletData.address,
                  wallet: evmWalletData.address,
                  coverStatus: 0,
                  coverGradient:
                    "linear-gradient(90.14deg, #49BEFF 0.11%, #6E3CFF 99.88%)",
                  image:
                    "https://bafkreib5pxtx3sxcksxpthu4u2kl7vpvaduirbnt6ax6v6hp5l3enod4hy.ipfs.nftstorage.link/",
                  createdBy: 1,
                });
              }
              if(!artist.name || (artist && artist.name.toLowerCase() === evmWalletData.address.toLowerCase())) {
                setUpdateProfileModal(true)
              }
            });

        }
    }, [evmWalletData])

    useEffect(() => {console.log(updateProfileModal);}, [updateProfileModal]);

    function resetSearch() {
        setkeyword("");
        dispatch({type: actionTypes.SEARCH_RESULTS, payload: {artists: [], searchKeyword: ""}});
    }
    

    const menuStyle = {
        padding:15,
        fontSize:15, 
        backdropFilter: "blur(20px)",
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
        if(isWalletSignedIn) {
            walletInfo.signOut();
            dispatch({type: actionTypes.IS_WALLET_SIGNED_IN, payload: false});
        }

        if(isEVMWalletSignedIn) {
            disconnect()
            setIsEVMWalletSignedIn(false)
            setEVMWalletData(undefined)
        }
        history.replace("/");
    }

    function navigateItem(path) {
        setShowHeaderContents(false);
        history.push(path);
    }

    return (
        <>
        <div className="header">
            <div style={{display:'flex', alignItems:'center', width:'50%'}}>
                <NavLink style={{color:"#fff", position:"relative"}} to="/">
                    <img className="logo" src={logo} alt="logo"/>
                    <div className='beta'>beta 2.1</div>
                </NavLink>
                <Search
                    keyword={keyword}
                    onChange={(e) => setkeyword(e.target.value)}
                    loading={loading}
                    resetSearch={resetSearch}
                    searchResultsArtists={searchResultsArtists}
                    searchResultsNfts={searchResultsNfts}
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
                        <Dropdown.Toggle className="header-item" style={{display: 'flex', letterSpacing:1.5, backgroundColor:"transparent", outline:"none", border:"none"}} id="dropdown-autoclose-true">
                            ABOUT<FiChevronDown size={15} color="#fff"/>
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={menuStyle} id="dropdown-basic-content">
                            <Dropdown.Item onClick={() => history.push("/aboutnaksh")}>About Naksh</Dropdown.Item>
                            {/* <Dropdown.Item onClick={() => history.push("/ourartists")} style={{marginTop:15}}>Our Artists</Dropdown.Item>
                            <Dropdown.Item onClick={() => history.push("/nearprotocol")} style={{marginTop:15}}>NEAR Protocol</Dropdown.Item> */}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle className="header-item" style={{ display: 'flex', letterSpacing:1.5, backgroundColor:"transparent", outline:"none", border:"none"}} id="dropdown-autoclose-true">
                            RESOURCES<FiChevronDown size={15} color="#fff"/>
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{...menuStyle, width:230}} id="dropdown-basic-content">
                            <Dropdown.Item onClick={() => history.push("/blogs")}>Blogs</Dropdown.Item>
                            <Dropdown.Item onClick={() => history.push("/helpcenter")} style={{marginTop:15}}>Help Center</Dropdown.Item>
                            <div style={{height:1, backgroundColor:"#fff", margin:"10px 0", opacity:0.27}}/>
                            <Dropdown.Item style={{marginTop:15}}>
                                <div className="icons-container" style={{...globalStyles.flexRow}}>
                                    <div onClick={() => helpers.openInNewTab(configs.discord)}><img style={{height:15}} src={discord} alt='discord'/></div>
                                    <div onClick={() => helpers.openInNewTab(configs.instagram)}><img style={{height:15}} src={instagram} alt='instagram'/></div>
                                    <div onClick={() => helpers.openInNewTab(configs.twitter)}><img style={{height:15}} src={twitter} alt='twitter'/></div>
                                    <div onClick={() => helpers.openInNewTab(configs.linkedin)}><img style={{height:15}} src={linkedIn} alt='linkedIn'/></div>
                                    <div onClick={() => helpers.openInNewTab(configs.telegram)}><img style={{height:15}} src={telegram} alt='telegram'/></div>
                                </div>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle className="header-item" style={{ display: 'flex', letterSpacing:1.5, backgroundColor:"transparent", outline:"none", border:"none"}} id="dropdown-autoclose-true">
                            CREATE<FiChevronDown size={15} color="#fff"/>
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{...menuStyle, width:230}} id="dropdown-basic-content">
                            <Dropdown.Item onClick={() => history.push("/create/nft")}>Create NFT</Dropdown.Item>
                            <Dropdown.Item onClick={() => history.push("/create/collection")} style={{marginTop:15}}>Create Collection</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                {(isWalletSignedIn || isEVMWalletSignedIn) ?
                <Dropdown style={{position:"absolute", right:"7%"}}>
                    <Dropdown.Toggle className='profile-icon' style={{display: 'flex', justifyContent: "center", alignItems: 'center', backgroundColor:"transparent", outline:"none", border:"none"}} id="dropdown-autoclose-true">
                        <img style={{height:40, width:40, borderRadius:40, objectFit:"cover"}} src={userData?.image ?? profileIcon} alt="profileIcon"/>
                        {" "}<FiChevronDown size={15} color="#fff"/>
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{padding:15, fontSize:15}} id="dropdown-basic-content">
                        <Dropdown.Item onClick={() => history.push("/userprofile", {ownerAccountId:walletInfo?.getAccountId()})}>View Profile</Dropdown.Item>
                        <Dropdown.Item onClick={walletSignOut} style={{marginTop:15}}>Log Out</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                :
                        <div
                            className="px-4 py-3 border border-white rounded-md text-inter font-semibold"
                            style={{ cursor: "pointer", position:"absolute", right:"7%", fontSize: '12px' }}
                            onClick={() => setIsModalOpen(true)}
                        >
                            CONNECT WALLET
                        </div>
                }
            </div>          
        </div>
        <div className="header-mobile">
            <div style={{...globalStyles.flexRowSpace, width:"100%"}}>
                <NavLink style={{color:"#fff", position:"relative"}} to="/">
                    <img className="logo" src={logo} alt="logo"/>
                    <div className='beta'>beta 2.1</div>
                </NavLink>
                {(!showHeaderContents && !isSearchPage) &&  <div onClick={() => setShowHeaderContents(true)}>
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
                    searchResultsArtists={searchResultsArtists}
                    searchResultsNfts={searchResultsNfts}
                    closeHeader={() => setShowHeaderContents(false)}
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
                {(isWalletSignedIn || isEVMWalletSignedIn) && <div onClick={() => history.push("/userprofile", {ownerAccountId:walletInfo?.getAccountId()})}>
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
                {/* <div onClick={() => navigateItem("/ourartists")}>
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
                </div>  */}
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
                    <div onClick={() => helpers.openInNewTab(configs.discord)}><img style={{height:15}} src={discord} alt='discord'/></div>
                    <div onClick={() => helpers.openInNewTab(configs.instagram)}><img style={{height:15}} src={instagram} alt='instagram'/></div>
                    <div onClick={() => helpers.openInNewTab(configs.twitter)}><img style={{height:15}} src={twitter} alt='twitter'/></div>
                    <div onClick={() => helpers.openInNewTab(configs.linkedin)}><img style={{height:15}} src={linkedIn} alt='linkedIn'/></div>
                    <div onClick={() => helpers.openInNewTab(configs.telegram)}><img style={{height:15}} src={telegram} alt='telegram'/></div>
                </div>
                {(!isEVMWalletSignedIn && !isWalletSignedIn) ? 
                    <div style={{textAlign:'center', marginTop:30}}>
                        <div 
                            onClick={walletSignIn}
                            className="connect-near"
                            style={{margin:0, padding:"10px 0"}}
                        >
                            {isWalletSignedIn ? "Logout" : <img src={near} alt="near"/>}
                        </div>
                        <div 
                            onClick={() => openConnectModal()}
                            className="connect-near"
                            style={{margin:0, marginTop: 10, padding:"10px 0"}}
                        >
                            {isEVMWalletSignedIn ? "Logout" : "Connect To Polygon"}
                        </div>
                        <img onClick={() => setShowHeaderContents(false)} style={{marginTop:25, height:40}} src={headerCross} alt={"headerCross"}/>
                    </div>
                :
                    <div style={{textAlign:'center', marginTop:30}}>
                        <div 
                            onClick={walletSignOut}
                            className="connect-near"
                            style={{margin:0, padding:"10px 0"}}
                        >
                            Logout
                        </div>
                        <img onClick={() => setShowHeaderContents(false)} style={{marginTop:25, height:40}} src={headerCross} alt={"headerCross"}/>
                    </div>
                }
            </motion.div>}
        </div>
        {isModalOpen && (
            <ConnectWallet
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
            />
        )}
        {updateProfileModal && (
            <UpdateProfileModal setIsOpen={setUpdateProfileModal} />
        )}
        </>
    )
}

export default Header
