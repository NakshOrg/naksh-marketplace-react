import { motion } from 'framer-motion';
import React, { Component, Fragment, useEffect, useState } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { FiFacebook, FiGlobe } from 'react-icons/fi';
import { BsInstagram } from 'react-icons/bs';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import profileSvg from '../../assets/svgs/profile-icon-big.svg';
import NftCard from '../../components/explore/NftCard';
import globalStyles from '../../globalStyles';
import classes from './profile.module.css';
import { connect, useSelector } from 'react-redux';
import { _getAllArtists, _getOneArtist } from '../../services/axios/api';
import NearHelperFunctions from '../../services/nearHelperFunctions';
import Spinner from '../../components/uiComponents/Spinner';
import uuid from 'react-uuid';
import { staticValues } from '../../constants';


export default function UserProfile(props) {
    
    const walletInfo = useSelector(state => state.nearReducer.walletInfo); 
    const isWalletSignedIn = useSelector(state => state.nearReducer.isWalletSignedIn);
    const userData = useSelector(state => state.nearReducer.userData);
    const params = useParams(); 
    const history = useHistory();
    const location = useLocation();
    const accountId = location?.state?.ownerAccountId ? location?.state?.ownerAccountId : walletInfo.getAccountId();
    
    const [loading, setLoading] = useState(true);
    const [artist, setArtist] = useState("");
    const [ownedNfts, setOwnedNfts] = useState([]);
    const [noUserFound, setNoUserFound] = useState(false);
    const [activeTab, setActiveTab] = useState("owned");
    
    useEffect(() => {
        if(walletInfo) {
            getArtist();
        }
    }, [walletInfo]);


    const getOwnedNfts = () => {
        const functions = new NearHelperFunctions(walletInfo); 
        functions.getOwnedNfts(accountId)
        .then(res => {
            setOwnedNfts(res);
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            alert("something went wrong!");
            setLoading(false);
        });

    }
 
    const getArtist = () => {
        _getAllArtists({wallet: accountId, sortBy: 'createdAt', sort: -1})
        .then(({ data }) => {
            setArtist(data.artists[0]);
            getOwnedNfts();        
        })
        .catch(err => {
            if (err.response.data.error == "wallet with value accountId fails to match the NEAR testnet pattern") {
                setNoUserFound(true);
            }
            setLoading(false);
        });
    }

    const profileInfo = () => {

        return <div className={classes.profileContainer}>
            <img 
                style={{height:100, width:100, borderRadius:100, objectFit:"cover", marginTop:30}}
                src={artist?.image ?? profileSvg}
                alt='profile'
            />
            <div style={{fontFamily:"Athelas-bold", fontSize:24, marginTop:10}}>{artist?.name}</div>
            <div style={{opacity:0.7, fontSize:13, color:"#fff", letterSpacing:1, marginTop:4, wordBreak: "break-word", padding: "0 30px"}}>
                {artist?.wallet}
            </div>
            <div style={{opacity:0.9, fontSize:15, color:"#fff", letterSpacing:1, marginTop:17}}>
                {artist?.description}
            </div>
            {/* <div style={{...globalStyles.flexRow, justifyContent:"center", marginTop:25}}>
                <div className={classes.iconContainer}>
                    <BsInstagram color='#000' size={16}/>
                </div>
                <div style={{marginLeft:15}} className={classes.iconContainer}>
                    <FiFacebook color='#000' size={16}/>
                </div>
                <div style={{marginLeft:15}} className={classes.iconContainer}>
                    <FiGlobe color='#000' size={16}/>
                </div>
            </div> */}
            {/* location?.state?.ownerAccountId */}
            {walletInfo?.getAccountId() === location?.state?.ownerAccountId &&
            <div onClick={() => history.push('/editprofile')} className={classes.editBtn}>
                EDIT PROFILE
            </div>}
        </div>
    }

    const renderNfts = () => {

        return ownedNfts.map(nft => {
            return <Col key={uuid()} style={{marginBottom:25}} lg={4} md={6} sm={6} xs={12}>
                <NftCard
                    onClick={() => history.push(`/nftdetails/${nft.token_id}`)}
                    image={nft.metadata.media}
                    title={nft.metadata.title}
                    nearFee={nft.price}
                    price={"$121,000,000"}
                    artistName={nft?.artist?.name} 
                    artistImage={nft?.artist?.image}
                />
            </Col>
        });

    }

    const emptyState = () => {
        return <div style={{...globalStyles.flexRow, flexDirection:"column", marginTop:50, marginBottom:30}}>
            <div style={{fontSize:16, opacity:0.7}}>Buy NFTs to create a collection here!</div>
            <div onClick={() => history.push("/browse")} className="glow-on-hover" type="button" style={{zIndex:100}}>
                <div className={classes.glowBtnText} style={{marginLeft:1}}>EXPLORE MARKETPLACE</div>
            </div>
        </div>
    }

    if(loading) return <Spinner/>;

    if (noUserFound) return <div style={{textAlign:"center", fontSize:24, marginTop:160}}>
        No user found!
    </div>

    return (
        <div>
            {artist.coverStatus === 0 ? 
            <div 
                style={{background:artist.coverGradient}} 
                className={classes.profileCover} 
            /> :
            <img 
                className={classes.profileCover}
                src={artist.coverImage} 
                alt='cover'
            />}
            <Container fluid className={classes.container}>
                <Row>
                    <Col style={{display:'flex', justifyContent:'center'}} lg={4} md={4} sm={12}>
                        {profileInfo()}
                    </Col>
                    <Col lg={8} md={8}>
                        <div style={{margin:"30px auto", width:"100%"}}>
                            <div style={{...globalStyles.flexRow, justifyContent:"center"}}>
                                <div>
                                    <div style={{fontWeight: "bold", fontSize:12, letterSpacing:1.5}}>
                                        NFTS OWNED
                                    </div>
                                    {/* <div style={{height:3, background:"#fff", width:8, borderRadius:100, margin:"2.5px auto"}}/> */}
                                </div>
                                {/* <div onClick={() => this.setState({activeTab:"saved"})} style={{fontWeight: activeTab == "saved" ? "bold" : "400", opacity: activeTab == "saved" ? 1 : 0.7, fontSize:12, marginLeft:30, cursor:'pointer', letterSpacing:1.5}}>
                                    SAVED
                                </div>
                                <div onClick={() => this.setState({activeTab:"sold"})} style={{fontWeight: activeTab == "sold" ? "bold" : "400", opacity: activeTab == "sold" ? 1 : 0.7, fontSize:12, marginLeft:30, cursor:'pointer', letterSpacing:1.5}}>
                                    SOLD
                                </div> */}
                            </div>
                            {/* bottom indicator */}
                            {/* <motion.div 
                                animate={{ 
                                    x: 430
                                }}
                                transition={{ duration: 0.5 }}
                                style={{height:3, background:"#fff", width:8, borderRadius:100, marginTop:2}}
                            />  */}
                        </div>
                        <Row>
                            {ownedNfts.length !== 0 ? renderNfts() : emptyState()}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}