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

class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: "owned",
            loading: true,
            artist: ""
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
 
     getArtist = () => {
         _getAllArtists({wallet: this.props.walletInfo.getAccountId(), sortBy: 'createdAt', sort: -1})
         .then(({ data: { artists } }) => {

            this.setState({loading: false, artist: artists[0]});
            
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

    render() { 

        const { activeTab } = this.state;

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
                                <Col lg={4}>
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
        isWalletSignedIn: state.nearReducer.isWalletSignedIn
    }
};

export default connect(mapStateToProps, null)(UserProfile);