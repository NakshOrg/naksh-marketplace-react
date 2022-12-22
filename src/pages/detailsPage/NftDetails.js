import React, { Component, Fragment, useEffect, useState } from 'react';
import { Col, Row, Spinner, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiBookmark, FiExternalLink, FiFlag } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import uuid from 'react-uuid';
import toast from 'react-hot-toast';

import NftCard from '../../components/explore/NftCard';
import { GradientBtn } from '../../components/uiComponents/Buttons';
import nearIcon from "../../assets/svgs/near-icon.svg"; 
import party from "../../assets/svgs/party.svg"; 
import profileSvg from '../../assets/svgs/profile-icon-big.svg';
import globalStyles from '../../globalStyles';
import classes from './details.module.css';
import { helpers } from '../../constants';
import { _getAllArtists, _getNftArtists, _saveNft, _unSaveNft, _updateTrendingNftOrArtist } from '../../services/axios/api';
import NearHelperFunctions from '../../services/nearHelperFunctions';
import Modal from '../../components/uiComponents/Modal';
import ListModal from '../../components/uiComponents/ListModal';


export default function NftDetails(props) {
    
    const walletInfo = useSelector(state => state.nearReducer.walletInfo);
    const isWalletSignedIn = useSelector(state => state.nearReducer.isWalletSignedIn);
    const params = useParams(); 
    const history = useHistory();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [nft, setNft] = useState(null);
    const [ownerData, setOwnerData] = useState(null);
    const [artistData, setMyArtistData] = useState(null);
    const [moreNfts, setMoreNfts] = useState([]);
    const [isOverviewActive, setIsOverviewActive] = useState(true);
    const [show, setShow] = useState(false); 
    const [nftPrice, setNftPrice] = useState(null);
    const [shouldUpdateNft, setShouldUpdateNft] = useState(false);
    const [isListed, setIsListed] = useState(true);
    const [modalShow, setModalShow] = useState(false);
    const [minimumBid, setMinimumBid] = useState("");
    const [price, setPrice] = useState("");
    const [pricingType, setPricingType] = useState("fixed");
    const googleForm = `https://docs.google.com/forms/d/e/1FAIpQLScaqPJC9CPhLWJfAYDbb3P5V98MMb9d3OrVqQOctS-Ynp-4Cw/viewform?usp=pp_url&entry.301861387=${window.location.href}`

    useEffect(() => {
        if(walletInfo) {
            setLoading(true);
            fetchNft();
        }
    }, [walletInfo, location.pathname]);

    const updateTrendings = async (body, token, artistId) => {
        const params = {
            token: token,
            blockchain: 0,
            artist: artistId
        }
        await _updateTrendingNftOrArtist(body, params) 
    }

    const fetchNft = () => {

        const paramsId = localStorage.getItem("paramsId");
        const primaryParamsId = localStorage.getItem("primaryParamsId");
        const pricingType = localStorage.getItem("pricingType");
        const functions = new NearHelperFunctions(walletInfo, (paramsId ? paramsId : primaryParamsId ? primaryParamsId : params.id));

        functions.getSalesNft()
        .then(saleNfts => {
            
            functions.getNftDetails()
            .then(nfts => {

                const isListed = saleNfts.find(item => item.token_id === params.id);

                if (!isListed) {
                    setIsListed(false);
                }

                const nft = nfts.find(item => item.token_id === params.id);

                if(paramsId) {
                    return functions.nearListing(nft, pricingType);
                }

                const moreNfts = nfts.filter(item => item.token_id !== params.id);
                _getAllArtists({wallet: walletInfo.getAccountId(), sortBy: 'createdAt', sort: -1})
                .then(({ data }) => {
                    setMyArtistData(data.artists[0]);
                    const savedNfts = data.artists[0].savedNft.map(item => item.token);
                    nft['saved'] = savedNfts.length ? savedNfts.includes(nft.token_id) : false;
                    _getNftArtists({artist: nft?.artist?.wallet, owner: nft?.owner_id})
                    .then(({ data: { artist, owner }}) => {
                        updateTrendings({view:1}, nft.token_id, artist._id);
                        setNft(nft);
                        setMoreNfts(moreNfts.reverse());
                        const query = new URLSearchParams(location.search); 
                        if(query.get("transactionHashes") && helpers.isNftPurchased()) {
                            helpers.clearIsNftPurchased();
                            updateTrendings({sale:1}, nft.token_id, artist._id);
                            toast.success('NFT successfully purchased!');
                        }
                        if(query.get("transactionHashes") && helpers.isNftListed()) {
                            toast.success('NFT listed successfully!');
                        }
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
            })
        })
    } 
    
    const handleBuyNft = async () => {

        if(isWalletSignedIn) {
            helpers.setIsNftPurchased();
            const functions = new NearHelperFunctions(walletInfo); 
            functions.buyNFt(nft.price, nft.token_id);
            return;
        }
        setShow(true);
    }
    
    function listInMarketPlace() {
        helpers.setIsNftListed();
        const functions = new NearHelperFunctions(walletInfo, params.id);
        functions.nearStorage(pricingType === "auction" ? minimumBid : nftPrice, pricingType);
    }

    const updateNft = async () => {
        const functions = new NearHelperFunctions(walletInfo);
        functions.updateNft(nft, pricingType === "auction" ? minimumBid : nftPrice);    
    }

    const handleSaveUnSaveNft = () => {

        setSaveLoading(true);
        const data = {
            "blockchain": 0,
            "token": nft.token_id
        }
        const copiedNft = {...nft};
        if (walletInfo.isSignedIn()) {
            (nft.saved ? _unSaveNft(artistData._id, data) : _saveNft(artistData._id, data))
            .then(({ data: { artist } }) => {
                setSaveLoading(false);
                const savedNfts = artist.savedNft.map(item => item.token);
                copiedNft['saved'] = savedNfts.length ? savedNfts.includes(copiedNft.token_id) : false;
                toast.success(copiedNft.saved ? "NFT saved" : "NFT unsaved");
                setNft(copiedNft);
            })
            .catch(err => {
                setSaveLoading(false);
                toast.error(err.response.data.error);
            })
        } else {
            toast.error("Connect wallet to save NFT");
        }

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
                    image={nft?.metadata?.media}
                    title={nft?.metadata?.title}
                    nearFee={nft?.price}
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
                            src={nft?.metadata?.media} 
                            alt='nft'
                        />
                    </div>
                </Col>
                <Col className={classes.descriptionCol} lg={5} md={5}>
                    <div style={globalStyles.flexRowSpace}>
                        <div style={{fontFamily:"Athelas-Bold", fontSize:36, textTransform:"capitalize", lineHeight:"40px", marginRight:10}}>{nft?.metadata?.title}</div>
                        <div style={{display:'flex'}}>
                            { !saveLoading ?
                            <span onClick={handleSaveUnSaveNft} style={{backgroundColor:"#fff", borderRadius:100, padding:6, cursor:"pointer"}}>
                                <FiBookmark fill={nft.saved ? 'black' : 'white'} size={22} color="#130F26"/>
                            </span> :
                            <Spinner style={{marginTop:2}} color='#fff' animation="border"/> }
                            <span onClick={() => helpers.openInNewTab(googleForm)} style={{backgroundColor:"#fff", marginLeft:15, borderRadius:100, padding:6, cursor:"pointer"}}>
                                <FiFlag size={22} color="#130F26"/>
                            </span>
                        </div>
                    </div>
                    {((purchasable && nft?.price) || isListed) && 
                    <div style={{marginTop:5}}>
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
                    {purchasable ? 
                    <div className={classes.desktopBtn}>
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
                    isListed ?
                    <GradientBtn
                        style={{marginTop:30, cursor: "pointer"}}
                        onClick={() => {
                            setModalShow(true)
                            setShouldUpdateNft(true)
                        }}
                        content={
                            <div>
                                Update NFT price
                            </div>
                        }
                    /> :
                    <GradientBtn
                        style={{marginTop:30, cursor: "pointer"}}
                        onClick={() => setModalShow(true)}
                        content={
                            <div>
                                List this NFT
                            </div>
                        }
                    />
                }
                </Col>
            </Row>
            <div className={classes.bottomContent}>
                <div className={classes.heading}>
                    More NFTs like this
                </div>
                <Row>
                    {renderNfts()}
                </Row>
            </div>
            <ListModal
                title='NFT listing'
                show={modalShow}
                btnRight={"Submit"}
                onHide={() => setModalShow(false)}
                onSubmit={shouldUpdateNft ? updateNft : listInMarketPlace}
                valid={((pricingType === "auction" && minimumBid) || (pricingType === "fixed" && price)) ? true : false}
                minimumBid={minimumBid}
                setMinimumBid={setMinimumBid}
                price={price}
                setPrice={setPrice}
                pricingType={pricingType}
                setPricingType={setPricingType}
            />
            {/* <ListModal
                valid={nftPrice ? true : false}
            /> */}
            <Modal
                show={show}
                onHide={() => setShow(false)}
            />
        </div>
    )

}


