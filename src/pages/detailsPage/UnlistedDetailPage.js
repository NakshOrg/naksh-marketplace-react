import React, { Component, Fragment, useEffect, useState } from 'react';
import { Col, Row, Container, Modal as BootModal, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiBookmark, FiExternalLink, FiFlag } from 'react-icons/fi';
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
import { _getAllArtists, _getNftArtists, _updateTrendingNftOrArtist } from '../../services/axios/api';
import NearHelperFunctions from '../../services/nearHelperFunctions';
import Modal from '../../components/uiComponents/Modal';
import ListModal from '../../components/uiComponents/ListModal';


export default function UnlistedDetailPage(props) {
    
    const walletInfo = useSelector(state => state.nearReducer.walletInfo);
    const isWalletSignedIn = useSelector(state => state.nearReducer.isWalletSignedIn);
    const params = useParams(); 
    const history = useHistory();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [nft, setNft] = useState(null);
    const [nftPrice, setNftPrice] = useState(null);
    const [ownerData, setOwnerData] = useState(null);
    const [isOverviewActive, setIsOverviewActive] = useState(true);
    const [show, setShow] = useState(false);
    const [listed, setListed] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        if(query.get("transactionHashes")) {
            setListed(true);
            toast.success('NFT listed successfully!');
        }
    }, []);

    useEffect(() => {
        if(walletInfo) {
            setLoading(true);
            fetchNft();
        }
    }, [walletInfo, location.pathname]);

    const fetchNft = () => {

        const paramsId = localStorage.getItem("paramsId");
        const primaryParamsId = localStorage.getItem("primaryParamsId");
        const functions = new NearHelperFunctions(walletInfo, (paramsId ? paramsId : primaryParamsId ? primaryParamsId : params.id));

        functions.getNftDetails()
        .then(nfts => {
            const nft = nfts.find(item => item.token_id === params.id);
            if(paramsId) {
                return functions.nearListing(nft);
            }
            _getNftArtists({artist: nft?.artist?.wallet, owner: nft?.owner_id})
            .then(({ data: { artist, owner }}) => {
                setNft(nft);
                setLoading(false);
                owner && setOwnerData(owner);
            })
            .catch(err => {
                alert("something went wrong!");
                setLoading(false);
            });

        })
        .catch(err => {
            // console.log(err);
            alert("something went wrong!");
            setLoading(false);
        });
        
    } 
    
    function listInMarketPlace() {
        const functions = new NearHelperFunctions(walletInfo, params.id);
        functions.nearStorage(nftPrice);
    }

    const updateNft = async () => {
        const functions = new NearHelperFunctions(walletInfo);
        functions.updateNft(nft, nftPrice);    
    }

    const overview = () => {

        return <>
            <div style={{fontWeight:200, lineHeight:"25px", letterSpacing:"0.3px", marginTop:20, opacity:0.95}}>
                {nft?.metadata?.description}
            </div>
            <div style={{height:1, width:"100%", backgroundColor:"#fff", opacity:0.16, marginTop:7}}/>
            <div style={{marginTop:13}}>
                <div style={{fontSize:14, opacity:0.66}}>Quantity</div>
                <div style={{fontFamily:200, fontSize:16, opacity:0.95, marginTop:5, letterSpacing:"0.5px"}}>1 available</div>
            </div>
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
                            src={nft?.metadata?.media} 
                            alt='nft'
                        />
                    </div>
                </Col>
                <Col className={classes.descriptionCol} lg={5} md={5}>
                    <div style={globalStyles.flexRowSpace}>
                        <div style={{fontFamily:"Athelas-Bold", fontSize:36, textTransform:"capitalize", lineHeight:"40px", marginRight:10}}>{nft?.metadata?.title}</div>
                    </div>
                    {(listed && nft?.price) && <div style={{marginTop:5}}>
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
                    <div className={classes.desktopBtn}>
                        <GradientBtn
                            style={{marginTop:30, cursor: "pointer"}}
                            onClick={() => listed ? null : setModalShow(true)}
                            content={
                                <div>
                                    { listed ? "NFT is Listed" : "List this NFT" }
                                </div>
                            }
                        />
                    </div>
                </Col>
            </Row>
            <ListModal
                title={'List in Marketplace'} 
                show={modalShow}
                body={
                    <Col lg={12}>
                        <Form.Label >
                            Nft Price<span style={{color:'#FF4848'}}>*</span>
                        </Form.Label>
                        <Form.Control
                            style={{caretColor:"black"}}
                            type="number" 
                            placeholder="Type here" 
                            onChange={(e) => setNftPrice(e.target.value)} 
                            value={nftPrice} 
                        />
                    </Col>
                }
                btnRight={"Submit"}
                onHide={() => setModalShow(false)}
                onSubmit={listInMarketPlace}
                valid={nftPrice ? true : false}
            />
            <Modal
                show={show}
                onHide={() => setShow(false)}
            />
        </div>
    )

}


