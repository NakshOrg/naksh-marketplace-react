import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import uuid from 'react-uuid';
import { useSelector } from 'react-redux';

import profileSvg from '../../assets/svgs/profile-icon-big.svg';
import NftCard from '../../components/explore/NftCard';
import globalStyles from '../../globalStyles';
import classes from '../profile/profile.module.css';
import { _getOneCollection } from '../../services/axios/api';
import Spinner from '../../components/uiComponents/Spinner';
import NearHelperFunctions from '../../services/nearHelperFunctions';


export default function ViewCollection(props) {
    
    const walletInfo = useSelector(state => state.nearReducer.walletInfo); 
    const params = useParams(); 
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [collection, setCollection] = useState(null);
    const [nfts, setNfts] = useState([]);
    const [mintedNfts, setMintedNfts] = useState([]);
    const [activeTab, setActiveTab] = useState("items");
    
    useEffect(() => {
        if(walletInfo) {
            getCollection();
        }
    }, [walletInfo]);

    const EmptyState = () => {
        return <div style={{...globalStyles.flexRow, flexDirection:"column", marginTop:50, marginBottom:30}}>
            <div style={{fontSize:16, opacity:0.7}}>You have no minted NFTs in this collection.</div>
            <div onClick={() => history.push("/createnft", {collection})} className="glow-on-hover" type="button" style={{zIndex:100}}>
                <div className={classes.glowBtnText} >
                    <span style={{marginLeft:45, fontSize:12}}>CREATE NFT</span>
                </div>
            </div>
        </div>
    }

    const getCollection = () => {

        _getOneCollection(params.id)
        .then(async ({ data: { collection } }) => {

            const functions = new NearHelperFunctions(walletInfo); 
            const mintedNfts = await functions.getMintedNft();
            const allNfts = await functions.getAllNfts();
            const minted = [];
            collection.tokens.map(token => {
                const item = mintedNfts.find(nft => nft.token_id === token);
                if (item) {
                    minted.push(item);
                } else {
                    const item = allNfts.find(nft => nft.token_id === token);
                    if (item) {
                        minted.push(item);
                    }
                }
            });
            setMintedNfts(minted);
            setCollection(collection);
            setLoading(false);
        })
        .catch(err => {
            // console.log(err);
            alert("something went wrong!");
            setLoading(false);
        });
    }
    
    const profileInfo = () => {
        return <div className={classes.profileContainer}>
            <img 
                style={{height:100, width:100, borderRadius:100, objectFit:"cover", marginTop:30}}
                src={collection?.image ?? profileSvg}
                alt='profile'
            />
            <div style={{fontFamily:"Athelas-bold", fontSize:24, marginTop:10}}>{collection?.name}</div>
            <div style={{opacity:0.7, fontSize:13, color:"#fff", letterSpacing:1, marginTop:4, wordBreak: "break-word", padding: "0 30px"}}>
                Created by {collection.artist?.name}
            </div>
            <div style={{opacity:0.9, fontSize:15, color:"#fff", letterSpacing:1, marginTop:17}}>
                {collection?.description}
            </div>
            <div style={{padding:"0 30px", marginTop:50}}>
                {mintedNfts.length && 
                <div onClick={() => history.push("/createnft", {collection})} className="glow-on-hover" type="button" style={{zIndex:100, width:"100%", marginBottom:20}}>
                    <div className={classes.glowBtnText} style={{paddingLeft:47}}>MINT NFT</div>
                </div>}
                <div style={{fontSize:11, margin:0, width:"100%"}} onClick={() => history.push('/collection', { collectionId: collection._id })} className={classes.editBtn}>
                    EDIT COLLECTION
                </div>
            </div>
        </div>
    }

    const renderMintedNfts = () => {

        if (mintedNfts.length) {
            return mintedNfts.map(nft => {
                return <Col key={uuid()} style={{marginBottom:25}} lg={4} md={6} sm={6} xs={12}>
                    <NftCard
                        onClick={() => history.push(`/unlisted/${nft.token_id}/${params.id}`)}
                        image={nft.metadata.media}
                        title={nft.metadata.title}
                        nearFee={nft.price}
                        price={"$121,000,000"}
                        artistName={nft?.artist?.name} 
                        artistImage={nft?.artist?.image}
                        unlisted={nft.price ? false : true}
                    />
                </Col>
            });
        }

        return <div style={{...globalStyles.flexRow, flexDirection:"column", marginTop:50, marginBottom:30}}>
            <div style={{fontSize:16, opacity:0.7}}>Create NFT and mint it now to get forever royalties!</div>
            <div onClick={() => history.push("/createnft", {collection})} className="glow-on-hover" type="button" style={{zIndex:100}}>
                <div className={classes.glowBtnText} style={{paddingLeft:47}}>MINT NFT</div>
            </div>
        </div>

    }

    const renderActivity = () => {

        if (collection.activity.length) {
            return collection.activity.map(activity => {
                return <div key={activity._id}>
                    <div style={{padding:"15px 0", paddingRight:"15%"}} className='d-flex justify-content-between'>
                        <div>{activity.message}</div>
                        <div>{activity.amount}</div>
                    </div>
                    <div style={{height:1, background:"#fff", opacity:0.3, marginRight:"15%"}}/>
                </div>
            });
        }

        return <div style={{...globalStyles.flexRow, flexDirection:"column", marginTop:50, marginBottom:30}}>
            <div style={{fontSize:16, opacity:0.7}}>No activities</div>
        </div>

    }

    if(loading) return <Spinner/>;
     

    return (
        <div>
            {collection.coverStatus === 0 ? 
            <div 
                style={{background:collection.coverGradient}} 
                className={classes.profileCover} 
            /> :
            <img 
                className={classes.profileCover}
                src={collection.coverImage} 
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
                                <div onClick={() => setActiveTab("items")} style={{fontWeight: activeTab == "items" ? "bold" : "400", opacity: activeTab === "items" ? 1 : 0.7, fontSize:12, letterSpacing:1.5, cursor:"pointer"}}>
                                    ITEMS
                                </div>
                                <div onClick={() => setActiveTab("activity")} style={{fontWeight: activeTab == "activity" ? "bold" : "400", opacity: activeTab === "activity" ? 1 : 0.7, fontSize:12, letterSpacing:1.5, cursor:"pointer", marginLeft:30}}>
                                    ACTIVITY
                                </div>
                            </div>
                            {/* bottom indicator */}
                            {/* <motion.div 
                                animate={{ 
                                    x: activeTab === "minted" ? 360 :
                                    activeTab === "owned" ? 470 : 565
                                }}
                                transition={{ duration: 0.5 }}
                                style={{height:3, background:"#fff", width:8, borderRadius:100, marginTop:2}}
                            />  */}
                        </div>
                        <Row>
                            {
                                activeTab === "activity" ?
                                renderActivity() :
                                renderMintedNfts()
                            }
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}