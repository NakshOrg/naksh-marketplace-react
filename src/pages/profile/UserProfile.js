import { motion } from 'framer-motion';
import React, { Component, Fragment } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { FiFacebook, FiGlobe } from 'react-icons/fi';
import { BsInstagram } from 'react-icons/bs';
      
import profileSvg from '../../assets/svgs/profile-icon-big.svg';
import NftCard from '../../components/explore/NftCard';
import globalStyles from '../../globalStyles';
import classes from './profile.module.css';
import { connect } from 'react-redux';
import { _getAllArtists } from '../../services/axios/api';
import NearHelperFunctions from '../../services/nearHelperFunctions';
import Spinner from '../../components/uiComponents/Spinner';
import uuid from 'react-uuid';

class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: "owned",
            artist: "",
            ownedNfts: [],
            loading: true
        }
    }

    componentDidMount() {
        if(this.props.walletInfo) {
            this.getArtist();
        }
     }
 
    componentDidUpdate(prevProps) {
        if(prevProps.walletInfo !== this.props.walletInfo) {
            this.getArtist();
        }
    }

    getOwnedNfts = () => {

        const functions = new NearHelperFunctions(this.props.walletInfo); 

        functions.getOwnedNfts()
        .then(res => {
            this.setState({
                ownedNfts: res,
                loading:false
            });
        })
        .catch(err => {
            console.log(err);
            alert("something went wrong!");
            this.setState({loading:false});
        });

    }
 
    getArtist = () => {
        _getAllArtists({wallet: this.props.walletInfo.getAccountId(), sortBy: 'createdAt', sort: -1})
        .then(({ data: { artists } }) => {
            this.setState({artist: artists[0]});
            this.getOwnedNfts();        
        })
        .catch(err => {
            this.setState({loading: false});
        });
    }

    profileInfo = () => {

        const isWalletSignedIn = this.props.isWalletSignedIn;
        const walletInfo = this.props.walletInfo;
        const { artist } = this.state;

        return <div className={classes.profileContainer}>
            <img 
                style={{height:100, width:100, borderRadius:100, objectFit:"cover", marginTop:30}}
                src={artist?.image ?? profileSvg}
                alt='profile'
            />
            <div style={{fontFamily:"Athelas-bold", fontSize:24, marginTop:10}}>{artist?.name}</div>
            <div style={{opacity:0.7, fontSize:13, color:"#fff", letterSpacing:1, marginTop:4}}>
                {walletInfo?.getAccountId()}
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
            <div onClick={() => this.props.navigate('/editprofile')} className={classes.editBtn}>
                EDIT PROFILE
            </div>
        </div>
    }

    renderNfts = () => {

        return this.state.ownedNfts.map(nft => {
            return <Col key={uuid()} style={{marginBottom:25}} lg={3} md={3} sm={2} xs={1}>
                <NftCard
                    onClick={() => this.props.navigate(`/nftdetails/${nft.token_id}`)}
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

    render() { 

        const { activeTab, loading } = this.state;

        if(loading) return <Spinner/>;

        return (
            <div>
                {/* <img
                    className={classes.profileCoverImage} 
                    src='https://media.istockphoto.com/photos/fine-art-abstract-floral-painting-background-picture-id1258336471'
                    alt='cover'
                /> */}
                <div className={classes.gradientCover1} />
                <Container fluid>
                    <Row>
                        <Col lg={4}>
                            {this.profileInfo()}
                        </Col>
                        <Col lg={8}>
                            <div style={{margin:"30px auto", width:"100%"}}>
                                <div style={{...globalStyles.flexRow, justifyContent:"center"}}>
                                    <div>
                                        <div style={{fontWeight: activeTab == "owned" ? "bold" : "400", opacity: activeTab == "owned" ? 1 : 0.7, fontSize:12, cursor:'pointer', letterSpacing:1.5}}>
                                            OWNED
                                        </div>
                                        <div style={{height:3, background:"#fff", width:8, borderRadius:100, margin:"2.5px auto"}}/>
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
                                {this.renderNfts()}
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        walletInfo: state.nearReducer.walletInfo,
        isWalletSignedIn: state.nearReducer.isWalletSignedIn,
        userData: state.nearReducer.userData
    }
};

export default connect(mapStateToProps, null)(UserProfile);