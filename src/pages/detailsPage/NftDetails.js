import React, { Component, Fragment } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiBookmark, FiExternalLink, FiMoreVertical } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { utils } from 'near-api-js';

import NftCard from '../../components/explore/NftCard';
import { GradientBtn } from '../../components/uiComponents/Buttons';
import Spinner from '../../components/uiComponents/Spinner';
import nearIcon from "../../assets/svgs/near-icon.svg";
import globalStyles from '../../globalStyles';
import classes from './details.module.css';
import { helpers } from '../../constants';

class NftDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            nft: null,
            isOverviewActive: true
        }
    }

    componentDidMount() {

        if(this.props.walletInfo) {
            this.fetchNfts();
        }

    }

    componentDidUpdate(prevProps) {

        if(prevProps.walletInfo !== this.props.walletInfo) {
            this.fetchNfts();
        }

    }

    fetchNfts = () => {

        this.props.walletInfo.account()
        .viewFunction(
            'nft1.abhishekvenunathan.testnet', 
            'nft_tokens', 
            {
                from_index: "0",
                limit: 1000 
            }
        )
        .then(res => {
            this.fetchListedNfts(res);
        })
        .catch(err => {
            this.setState({loading:false});
            console.log(err);
        });

    }

    fetchListedNfts = (allNfts) => {

        this.props.walletInfo.account()
        .viewFunction(
            'market1.abhishekvenunathan.testnet', 
            'get_sales_by_nft_contract_id', 
            { 
                nft_contract_id: 'nft1.abhishekvenunathan.testnet',
                from_index: "0", 
                limit: 1000 
            }
        )
        .then(res => {
            
            const listedNfts = res;
            
            allNfts.map(nftItem => {
                const singleItem = listedNfts.find(t => t.token_id === nftItem.token_id);
                if(singleItem) {
                    nftItem["listed"] = true;
                    nftItem["price"] =  singleItem.sale_conditions;
                } else {
                    nftItem["listed"] = false;
                    nftItem["price"] = "NIL";
                }
            });

            const item = allNfts.find(item => item.token_id === this.props.params.id);
            item.metadata['extra'] = JSON.parse(item.metadata.extra);        
            console.log(item);
            this.setState({nft:item, loading:false});
        })
        .catch(err => {
            this.setState({loading:false});
            console.log(err);
        });
    }

    handleBuyNft = async () => {

        const gas = 200000000000000;
        const attachedDeposit = utils.format.parseNearAmount(this.state.nft.price);
        const FunctionCallOptions = {
            contractId: 'market1.abhishekvenunathan.testnet',
            methodName: 'offer',
            args: {
                nft_contract_id: 'nft1.abhishekvenunathan.testnet',
                token_id: this.state.nft.token_id
            },
            gas,
            attachedDeposit
        };

        const data = await this.props.walletInfo.account().functionCall(FunctionCallOptions);

    }

    overview = () => {

        const { nft } = this.state;

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
            <div style={{marginTop:18, fontWeight:400}}>
                <div style={{fontSize:14, opacity:0.66}}>Proof of authenticity</div>
                <div style={{marginTop:5}}>
                    <span style={{marginRight:10, borderBottom:"1px solid #fff", paddingBottom:1}}>kaer10202kaskdhfcnzaleleraoao</span>
                    <span><FiExternalLink size={22} color='#fff'/></span>
                </div>
            </div>
            {/* line seperator */}
            <div style={{height:1, width:"100%", backgroundColor:"#fff", opacity:0.16, marginTop:15}}/>
            <div style={{marginBottom:30, marginTop:14, ...globalStyles.flexRow}}>
                <div>
                    <div style={{fontSize:14, opacity:0.66, marginBottom:6}}>Artist</div>
                    <div style={globalStyles.flexRow}>
                        <img
                            style={{height:30, width:30, borderRadius:30}}
                            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"
                            alt="artist"
                        />
                        <div style={{fontSize:16, marginLeft:10}}>Lata Mangeskar</div>
                    </div>
                </div>
                <div style={{marginLeft:30}}>
                    <div style={{fontSize:14, opacity:0.66, marginBottom:6}}>Owner(s)</div>
                    <div style={globalStyles.flexRow}>
                        <img
                            style={{height:30, width:30, borderRadius:30}}
                            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"
                            alt="artist"
                        />
                        <div style={{fontSize:16, marginLeft:10}}>{nft?.owner_id}</div>
                    </div>
                </div>
            </div>
        </> 
    }

    otherDetails = () => {

        const { nft } = this.state;

        return nft?.metadata?.extra?.custom?.map(item => {
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
        })
        
    }

    render() {

        const { isOverviewActive, nft, loading } = this.state;

        if(loading) return <Spinner/>;

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
                            <img style={{borderRadius:6, width:"63.5%"}} src={nft.metadata.media} alt='nft'/>
                        </div>
                    </Col>
                    <Col lg={5}>
                        <div style={globalStyles.flexRowSpace}>
                            <div style={{fontFamily:"Athelas-Bold", fontSize:36}}>{nft?.metadata?.title}</div>
                            <div>
                                <span style={{backgroundColor:"#fff", borderRadius:100, padding:6}}>
                                    <FiBookmark size={22} color="#130F26"/>
                                </span>
                                <span style={{backgroundColor:"#fff", marginLeft:15, borderRadius:100, padding:6}}>
                                    <FiMoreVertical size={22} color="#130F26"/>
                                </span>
                            </div>
                        </div>
                        <div style={{marginTop:5}}>
                            <span style={{fontSize:15, opacity:0.6}}>Price:</span> 
                            <span style={{marginLeft:5, fontSize:17}}>{nft?.price} <img style={{marginTop:-2, marginLeft:-1}} src={nearIcon} alt="near"/></span>
                            {/* <span style={{marginLeft:10, fontSize:15, opacity:0.6}}>{`($${nft?.price * 10.43})`}</span> */}
                        </div>
                        <div>
                            <div style={{...globalStyles.flexRow, marginTop:20}}>
                                <div onClick={() => this.setState({isOverviewActive:true})} style={{fontWeight: !isOverviewActive ? "400" : "bold", opacity: !isOverviewActive ? 0.7 : 1, fontSize:12, cursor:'pointer', letterSpacing:1.5}}>
                                    OVERVIEW
                                </div>
                                <div onClick={() => this.setState({isOverviewActive:false})} style={{fontWeight: isOverviewActive ? "400" : "bold", opacity: isOverviewActive ? 0.7 : 1, fontSize:12, marginLeft:30, cursor:'pointer', letterSpacing:1.5}}>
                                    OTHER DETAILS
                                </div>
                            </div>
                            {/* bottom indicator */}
                            <motion.div 
                                animate={{ x: isOverviewActive ? 33 : 150 }}
                                transition={{ duration: 0.5 }}
                                style={{height:3, background:"#fff", width:8, borderRadius:100, marginTop:2}}
                            /> 
                        </div>
                        {isOverviewActive ? this.overview() : this.otherDetails()}
                        <GradientBtn
                            onClick={this.handleBuyNft}
                            content={
                                <div>
                                    PURCHASE FOR 200 
                                    <span><img style={{marginTop:-2, marginLeft:3}} src={nearIcon} alt="near"/></span>
                                </div>
                            }
                        />
                    </Col>
                </Row>
                <div style={{ margin: "45px 0", position: "relative" }}>
                    <div style={{height:2, width:"100%", backgroundColor:"#fff", opacity:0.16}}/>
                    <div className={classes.moreNftHeading}>
                        More NFTs like this
                    </div>
                </div>
                <Row>
                    <Col lg={3} md={3} sm={2} xs={1}>
                        <NftCard
                            image={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
                            title={"Tanjore Painting"}
                            nearFee={"31000Ⓝ"}
                            price={"$121,000,000"}
                            artistName={"Sharmila S"}
                            artistImage={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
                        />
                    </Col>
                    <Col lg={3} md={3} sm={2} xs={1}>
                        <NftCard
                            image={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
                            title={"Tanjore Painting"}
                            nearFee={"31000Ⓝ"}
                            price={"$121,000,000"}
                            artistName={"Sharmila S"}
                            artistImage={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
                        />
                    </Col>
                    <Col lg={3} md={3} sm={2} xs={1}>
                        <NftCard
                            image={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
                            title={"Tanjore Painting"}
                            nearFee={"31000Ⓝ"}
                            price={"$121,000,000"}
                            artistName={"Sharmila S"}
                            artistImage={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
                        />
                    </Col>
                    <Col lg={3} md={3} sm={2} xs={1}>
                        <NftCard
                            image={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
                            title={"Tanjore Painting"}
                            nearFee={"31000Ⓝ"}
                            price={"$121,000,000"}
                            artistName={"Sharmila S"}
                            artistImage={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
                        />
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default function NftDetailsWrapper(props) {

    const walletInfo = useSelector(state => state.nearReducer.walletInfo);
    const params = useParams();
    
    return <NftDetails
        walletInfo={walletInfo}
        params={params}
    />;

}
