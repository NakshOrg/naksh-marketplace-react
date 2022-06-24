import React, { Component, Fragment, useEffect, useState } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiBookmark, FiExternalLink, FiMoreVertical } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import uuid from 'react-uuid';
import toast from 'react-hot-toast';

import NftCard from '../../components/explore/NftCard';
import { GradientBtn } from '../../components/uiComponents/Buttons';
import Spinner from '../../components/uiComponents/Spinner';
import nearIcon from "../../assets/svgs/near-icon.svg"; 
import party from "../../assets/svgs/party.svg"; 
import profileSvg from '../../assets/svgs/profile-icon-big.svg';
import globalStyles from '../../globalStyles';
import classes from './details.module.css';
import { helpers } from '../../constants';
import { _getAllArtists } from '../../services/axios/api';
import NearHelperFunctions from '../../services/nearHelperFunctions';
import Modal from '../../components/uiComponents/Modal';


export default function NftDetails(props) {
    
    const walletInfo = useSelector(state => state.nearReducer.walletInfo);
    const isWalletSignedIn = useSelector(state => state.nearReducer.isWalletSignedIn);
    const params = useParams(); 
    const history = useHistory();
    const location = useLocation();
    
    const [loading, setLoading] = useState(true);
    const [nft, setNft] = useState(null);
    const [ownerData, setOwnerData] = useState(null);
    const [moreNfts, setMoreNfts] = useState([]);
    const [isOverviewActive, setIsOverviewActive] = useState(true);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if(walletInfo) {
            setLoading(true);
            fetchNft();
        }
    }, [walletInfo]);

    useEffect(() => {
        if(walletInfo) {
            setLoading(true);
            fetchNft();
        }
    }, [location.pathname]);

    // const handleOnSubmit = async () => {
    //     const response = await fetch(nft.metadata.media);
    //     // here image is url/location of image
    //     const blob = await response.blob();
    //     const file = new File([blob], 'share.jpg', {type: blob.type});
    //     console.log(file);
    //     if(navigator.share) {
    //       await navigator.share({
    //         title: this.state.nft.metadata?.title,
    //         text: "Take a look at my beautiful nft",
    //         url: window.location.href,
    //         files: [file]     
    //       })
    //         .then(() => console.log('Successful share'))
    //         .catch((error) => console.log('Error in sharing', error));
    //     }else {
    //       console.log(`system does not support sharing files.`);
    //     }
    // }

    const fetchNft = () => {

        const functions = new NearHelperFunctions(walletInfo); 

        functions.getNftDetails()
        .then(nfts => {

            const nft = nfts.find(item => item.token_id === params.id);
            const moreNfts = nfts.filter(item => item.token_id !== params.id);
            
            _getAllArtists({wallet: nft?.owner_id, sortBy: 'createdAt', sort: -1})
            .then(res => {
                res.data.artists.length !== 0 && setOwnerData(res.data.artists[0]);
                setNft(nft);
                setMoreNfts(moreNfts.reverse());
                const query = new URLSearchParams(location.search);
                if(query.get("transactionHashes")) {
                    toast.success('NFT successfully purchased!');
                }
                setLoading(false);
            })
            .catch(err => {
                alert("something went wrong!");
                setLoading(false);
            });
        })
        .catch(err => {
            console.log(err);
            alert("something went wrong!");
            setLoading(false);
        });
        
    } 
    
    const handleBuyNft = async () => {

        if(isWalletSignedIn) {
            const functions = new NearHelperFunctions(walletInfo); 
            functions.buyNFt(nft.price, nft.token_id);
            return;
        }
        setShow(true);
    }

    const overview = () => {

        return <>
            <div style={{fontWeight:200, lineHeight:"25px", letterSpacing:"0.3px", marginTop:20, opacity:0.95}}>
                {nft?.metadata?.description}
            </div>
            {/* line seperator */}
            <div style={{height:1, width:"100%", backgroundColor:"#fff", opacity:0.16, marginTop:7}}/>
            <div style={{marginTop:13}}>
                <div style={{fontSize:14, opacity:0.66}}>Quantity</div>
                <div style={{fontFamily:200, fontSize:16, opacity:0.95, marginTop:5, letterSpacing:"0.5px"}}>1 available</div>
            </div>
            {/* <div style={{marginTop:18, fontWeight:400}}>
                <div style={{fontSize:14, opacity:0.66}}>Proof of authenticity</div>
                <div style={{marginTop:5}}>
                    <span style={{marginRight:10, borderBottom:"1px solid #fff", paddingBottom:1}}>kaer10202kaskdhfcnzaleleraoao</span>
                    <span><FiExternalLink size={22} color='#fff'/></span>
                </div>
            </div> */}
            {/* line seperator */}
            <div style={{height:1, width:"100%", backgroundColor:"#fff", opacity:0.16, marginTop:15}}/>
            <div style={{marginTop:14, ...globalStyles.flexRow}}>
                <div>
                    <div style={{fontSize:14, opacity:0.66, marginBottom:6}}>Artist</div>
                    <div onClick={() => history.push(`/ourartists/${nft?.artist?._id}`)} style={{...globalStyles.flexRow, cursor:"pointer"}}>
                        <img
                            style={{height:30, width:30, borderRadius:30, objectFit:'cover'}}
                            src={nft?.artist?.image}
                            alt="artist"
                        />
                        <div style={{fontSize:16, marginLeft:10}}>{nft?.artist?.name}</div>
                    </div>
                </div>
                <div style={{marginLeft:30}}>
                    {console.log(ownerData, 'ownerData')}
                    <div style={{fontSize:14, opacity:0.66, marginBottom:6}}>Owner(s)</div>
                    <div onClick={() => history.push('/userprofile', {ownerAccountId:nft?.owner_id})} style={{...globalStyles.flexRow, cursor:"pointer"}}>
                        <img
                            style={{height:30, width:30, borderRadius:30, objectFit:'cover'}}
                            src={ownerData?.image ?? profileSvg }
                            alt="artist"
                        />
                        <div style={{fontSize:16, marginLeft:10, wordBreak:"break-word"}}>{nft?.owner_id}</div>
                    </div>
                </div>
            </div>
        </> 
    }

    const otherDetails = () => {

        return <>
            {nft?.metadata?.extra?.materialMediumUsed &&
            <div style={{marginTop:20}}>
                <div style={{fontSize:14, opacity:0.66}}>Material Medium Used</div>
                <div style={{fontFamily:200, fontSize:16, opacity:0.95, marginTop:5, letterSpacing:"0.5px"}}>
                    {nft?.metadata?.extra?.materialMediumUsed}
                </div>
            </div>}
            <div style={{height:1, width:"100%", backgroundColor:"#fff", opacity:0.16, marginTop:7}}/>
            {nft?.metadata?.extra?.custom?.map(item => {
                return <>
                    <div style={{marginTop:13}}>
                        <div style={{fontSize:14, opacity:0.66}}>{item.name}</div>
                        {item.type === 1 ?
                        <div onClick={() => helpers.openInNewTab(item.fileUrl)} style={{fontFamily:200, fontSize:16, opacity:0.95, marginTop:5, cursor:"pointer", letterSpacing:"0.5px", display:"flex"}}>
                            <div style={{marginRight:10, borderBottom:"1px solid #fff", paddingBottom:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{item.fileUrl}</div>
                            <div><FiExternalLink size={22} color='#fff'/></div>
                        </div> :
                        <div style={{fontFamily:200, fontSize:16, opacity:0.95, marginTop:5, letterSpacing:"0.5px"}}>
                            {item?.text || item?.date}
                        </div>}
                    </div>
                    <div style={{height:1, width:"100%", backgroundColor:"#fff", opacity:0.16, marginTop:7}}/>
                </>
            })}
        </>
                
    }

    const renderNfts = () => {

        return moreNfts.slice(0, 4).map(nft => {
            return <Col key={uuid()} style={{marginBottom:25}} lg={3} md={4} sm={6} xs={12}>
                <NftCard
                    onClick={() => history.push(`/nftdetails/${nft.token_id}`, {replace: true})}
                    image={nft.metadata?.media}
                    title={nft.metadata?.title}
                    nearFee={nft.price}
                    artistName={nft?.artist?.name} 
                    artistImage={nft?.artist?.image}
                />
            </Col>
        });

    }

    if(loading) return <Spinner/>;

    const purchasable = walletInfo?.getAccountId() !== nft?.owner_id;

    return (
        <div className={classes.container}>
            <div className={classes.detailsGradientOverlay}/>
            <div className={classes.detailsGradientOverlayPink}/>
            <Row>
                <Col lg={7} md={7}>
                    <div style={{textAlign:"center"}}>
                        <img
                            className={classes.nftImage}
                            src={nft.metadata.media} 
                            alt='nft'
                        />
                    </div>
                </Col>
                <Col className={classes.descriptionCol} lg={5} md={5}>
                    <div style={globalStyles.flexRowSpace}>
                        <div style={{fontFamily:"Athelas-Bold", fontSize:36, textTransform:"capitalize", lineHeight:"40px", marginRight:10}}>{nft?.metadata?.title}</div>
                        <div style={{display:'flex'}}>
                            <span style={{backgroundColor:"#fff", borderRadius:100, padding:6, opacity:0.6, cursor:"no-drop"}}>
                                <FiBookmark size={22} color="#130F26"/>
                            </span>
                            <span style={{backgroundColor:"#fff", marginLeft:15, borderRadius:100, padding:6, opacity:0.6, cursor:"no-drop"}}>
                                <FiMoreVertical size={22} color="#130F26"/>
                            </span>
                        </div>
                    </div>
                    {/* <WhatsappShareButton
                        title={nft?.metadata?.title}
                        separator={"/%0A"}
                        style={{height:50, width:50, background:"#fff", color:'red'}} 
                        url={window.location.href}
                    >
                        whatsapp
                    </WhatsappShareButton> */}
                    {(purchasable && nft?.price) && <div style={{marginTop:5}}>
                        <span style={{fontSize:15, opacity:0.6}}>Price:</span> 
                        <span style={{marginLeft:5, fontSize:17}}>{nft?.price} <img style={{marginTop:-2, marginLeft:-1}} src={nearIcon} alt="near"/></span>
                    </div>}
                    <div>
                        <div style={{...globalStyles.flexRow, marginTop:20}}>
                            <div onClick={() => setIsOverviewActive(true)} style={{fontWeight: !isOverviewActive ? "400" : "bold", opacity: !isOverviewActive ? 0.7 : 1, fontSize:12, cursor:'pointer', letterSpacing:1.5}}>
                                OVERVIEW
                            </div>
                            <div onClick={() => setIsOverviewActive(false)} style={{fontWeight: isOverviewActive ? "400" : "bold", opacity: isOverviewActive ? 0.7 : 1, fontSize:12, marginLeft:30, cursor:'pointer', letterSpacing:1.5}}>
                                OTHER DETAILS
                            </div>
                        </div>
                        <motion.div 
                            animate={{ x: isOverviewActive ? 33 : 150 }}
                            transition={{ duration: 0.5 }}
                            style={{height:3, background:"#fff", width:8, borderRadius:100, marginTop:2}}
                        /> 
                    </div>
                    {isOverviewActive ? overview() : otherDetails()}
                    {purchasable ? <div className={classes.desktopBtn}>
                        <GradientBtn
                            style={{marginTop:30, cursor: purchasable ? "pointer" : "no-drop", opacity: purchasable ? 1 : 0.6}}
                            onClick={() => (purchasable && nft?.price) ? handleBuyNft() : null}
                            content={
                                <div>
                                    {(purchasable && nft?.price) ? `PURCHASE FOR ${nft?.price}` : !purchasable ? 'You own this nft' : 'Unavailable'}
                                    {(purchasable && nft?.price) && 
                                    <span><img style={{marginTop:-2, marginLeft:3}} src={nearIcon} alt="near"/></span>}
                                </div>
                            }
                        />
                    </div> :
                    <div className={classes.ownedBtn}>
                        <img style={{height:30}} src={party} alt="party"/>&nbsp;&nbsp; This nft is now yours!
                    </div>}
                </Col>
            </Row>
            {purchasable ? 
            <div onClick={() => (purchasable && nft?.price) ? handleBuyNft() : null} className={classes.mobileFixedBtn}>
                <div>
                    {(purchasable && nft?.price) ? `PURCHASE FOR ${nft?.price}` : !purchasable ? '🎉 You own this nft' : 'Unavailable'}
                    {(purchasable && nft?.price) && 
                    <span><img style={{marginTop:-2, marginLeft:3}} src={nearIcon} alt="near"/></span>}
                </div>
            </div> :
            <div className={classes.ownedBtnFixed}>
                <img style={{height:30}} src={party} alt="party"/>&nbsp; This nft is now yours!
            </div>}
            <div className={classes.bottomContent}>
                <div className={classes.heading}>
                    More NFTs like this
                </div>
                <Row>
                    {renderNfts()}
                </Row>
            </div>
            <Modal
                show={show}
                onHide={() => setShow(false)}
            />
        </div>
    )

}


