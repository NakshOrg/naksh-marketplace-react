import React, { useState, useEffect, Fragment } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiBookmark, FiExternalLink, FiMoreVertical } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';

import NftCard from '../../components/explore/NftCard';
import { GradientBtn } from '../../components/uiComponents/Buttons';
import nearIcon from "../../assets/svgs/near-icon.svg";
import globalStyles from '../../globalStyles';
import classes from './details.module.css';
import { _getOneArtist } from '../../services/axios/api';
import Spinner from '../../components/uiComponents/Spinner';
import instagram from "../../assets/svgs/instagram.svg";
import facebook from "../../assets/svgs/facebook.svg";  
import website from "../../assets/svgs/website.svg";
import location from "../../assets/svgs/location.svg";
import imgbackground from "../../assets/svgs/imgbackground.svg";
import { helpers } from '../../constants';
import NearHelperFunctions from '../../services/nearHelperFunctions';
import { useSelector } from 'react-redux';
import uuid from 'react-uuid';

export default function ArtistDetails() {

    const params = useParams();
    const navigate = useNavigate();
    const walletInfo = useSelector(state => state.nearReducer.walletInfo);
    const [loading, setLoading] = useState(true);
    const [artistDetails, setArtistDetails] = useState(null);
    const [isOverviewActive, setIsOverviewActive] = useState(true);
    const [artworks, setArtworks] = useState([]);

    useEffect(() => {

        getArtists();

        return () => {

        };

    }, []);

    const getArtists = () => {

        _getOneArtist(params.id)
        .then(({ data }) => {

            const functions = new NearHelperFunctions(walletInfo); 
            functions.getAllNfts()
            .then(res => {
                const filteredNfts = res.filter(item => item?.metadata?.extra?.artistId === params.id);
                setArtworks(filteredNfts);
                setArtistDetails(data.artist);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
            });

        })
        .catch(err => {
            setLoading(false);
        })

    }

    const customFields = () => {

        return <>
            {artistDetails.custom?.map(item => {
                return <Fragment key={uuid()}>
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
                </Fragment>
            })}
        </>
                
    }
    
    if(loading) return <Spinner/>

    return (
        <Container style={{marginTop:105}}>
            {/* overlay gradient  */}
            <div className={classes.detailsGradientOverlay}/>
            {/* overlay gradient  */}
            <div className={classes.detailsGradientOverlayPink}/>
            <Row>
                <Col lg={7}>
                    {/* <div style={{height:"63.5%", width:"100%", textAlign:"center"}}>
                        <img style={{maxWidth:"100%", maxHeight:"100%", borderRadius:6}} src='https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80' alt='nft'/>
                    </div> */}
                    <div style={{textAlign:"center"}}>
                        <img style={{borderRadius:6, width:"63.5%"}} src={artistDetails.image} alt='artist'/>
                    </div>
                </Col>
                <Col lg={5}>
                    <div style={globalStyles.flexRowSpace}>
                        <div style={{fontFamily:"Athelas-Bold", fontSize:52, lineHeight:"55px"}}>{artistDetails.name}</div>
                    </div>
                    <div className={classes.iconsContainer} style={{...globalStyles.flexRow}}>
                        {artistDetails.instagram && <div style={{marginTop:10}} onClick={() => helpers.openInNewTab(artistDetails.instagram)}><img src={instagram} alt='instagram'/></div>}
                        {artistDetails.facebook && <div style={{marginTop:10}} onClick={() => helpers.openInNewTab(artistDetails.facebook)}><img src={facebook} alt='facebook'/></div>}
                        {artistDetails.website && <div style={{marginTop:10}} onClick={() => helpers.openInNewTab(artistDetails.website)}><img src={website} alt='website'/></div>}
                    </div>
                    <div style={{...globalStyles.flexRow, marginTop:20}}>
                        <div style={{...globalStyles.flexRow, marginRight:20}}>
                            <img src={location} alt="icon"/>
                            <div style={{fontSize:13, marginLeft:5, textTransform:"uppercase", fontWeight:500, letterSpacing:"0.4px"}}>{artistDetails.city}</div>
                        </div>
                        <div style={{...globalStyles.flexRow}}>
                            <img src={imgbackground} alt="icon"/>
                            <div style={{fontSize:13, marginLeft:5, textTransform:"uppercase", fontWeight:500, letterSpacing:"0.4px"}}>{artistDetails.artform.name}</div>
                        </div>
                    </div>
                    <div style={{fontWeight:200, lineHeight:"25px", letterSpacing:"0.3px", marginTop:20, opacity:0.95}}>
                        {artistDetails.description}
                    </div>
                    {/* line seperator */}
                    <div style={{height:1, width:"100%", backgroundColor:"#fff", opacity:0.16, marginTop:7}}/>
                    {customFields()}
                </Col>
            </Row>
            <div style={{ margin: "45px 0", marginTop: 80, position: "relative" }}>
                <div style={{height:2, width:"100%", backgroundColor:"#fff", opacity:0.16}}/>
                <div className={classes.moreNftHeading}>
                    Artworks by Shwetambari Shetty
                </div>
            </div>
            <Row>
                {artworks.map(nft => {
                    return <Col key={uuid()} style={{zIndex:2}} lg={3} md={3} sm={2} xs={1}>
                        <NftCard
                            onClick={() => navigate(`/nftdetails/${nft.token_id}`)}
                            image={nft.metadata.media}
                            title={nft.metadata.title}
                            nearFee={nft.price}
                            price={"$121,000,000"}
                            artistName={nft?.artist?.name} 
                            artistImage={nft?.artist?.image}
                            // image={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
                            // title={"Tanjore Painting"}
                            // nearFee={"31000Ⓝ"}
                            // price={"$121,000,000"}
                            // artistName={"Sharmila S"}
                            // artistImage={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
                        />
                    </Col>
                })}
            </Row>
        </Container>
    )
}
