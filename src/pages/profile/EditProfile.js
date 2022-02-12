import { motion } from 'framer-motion';
import React, { Component, Fragment } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FiArrowLeft } from 'react-icons/fi';
import { connect } from 'react-redux';

import cameraIcon from '../../assets/svgs/camera.svg'
import { GradientBtn, OutlineBtn } from '../../components/uiComponents/Buttons';
import MaterialInput from '../../components/uiComponents/MaterialInput';
import Spinner from '../../components/uiComponents/Spinner';
import { helpers } from '../../constants';
import globalStyles from '../../globalStyles';
import * as actionTypes from '../../redux/actions/actionTypes';
import { _getAllArtists, _getPresignedUrl, _postArtist, _updateArtist, _uploadFileAws } from '../../services/axios/api';
import classes from './profile.module.css';

class EditProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: "owned",
            selectedGradient: 1,
            showModal: false,
            artistId: "",
            image: null, 
            imageRaw: null, 
            name: "",
            description: "",
            wallet: "",
            email: "",
            website: "",
            facebook: "",
            instagram: "",
            twitter: "",
            profileAlreadyCreated: false,
            loading: true,
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
            
            if(artists.length !== 0) {

                this.setState({profileAlreadyCreated: true, artistId: artists[0]._id});
                const artistKeys = Object.entries(artists[0]);
                const stateKeys = Object.keys(this.state);
        
                artistKeys.map(key => {
                    if(stateKeys.includes(key[0])) {
                        this.setState({[key[0]]: key[1]});
                    }
                });

            }
            this.setState({loading: false});
        })
        .catch(err => {
            this.setState({loading: false});
        });
    }

    handleImage = async (e) => {
        const res = await helpers.readImage(e);
        this.setState({image:res[0], imageRaw: e.target.files[0]});
    }

    buildImgTag = () => {
        return <img className={classes.imgStyle} src={this.state.image} alt='icon'/> 
    } 

    saveProfile = async () => {

        this.setState({loading: true});

        const { 
            imageRaw,
            name, 
            description, 
            email, 
            website, 
            facebook, 
            instagram,
            profileAlreadyCreated
        } = this.state;

        let data = {
            name: name,
            wallet: this.props.walletInfo.getAccountId() 
        }

        const stateObj = {email:email, website:website, facebook:facebook, instagram:instagram, description:description};
        const stateEntries =  Object.entries(stateObj);

        stateEntries.map(entry => {
            if(entry[1] !== "") {
                data[entry[0]] = entry[1];
            }
        });
        
        if(imageRaw !== null) {
            const urlRes = await _getPresignedUrl({"module": "artist", "totalFiles": 1});
            const uploadRes = await _uploadFileAws(urlRes.data.urls[0].url, imageRaw, imageRaw.type);
            
            if(uploadRes.status === 200) {
                data["image"] = urlRes.data.urls[0].Key
            }
        }

        if(profileAlreadyCreated) {
            this.updateArtist(data);
        } else {
            this.addArtist(data);
        }

    }

    addArtist = (data) => {
        
        data['createdBy'] = 1;
        
        _postArtist(data)
        .then(res => {
            this.setState({loading:false});
            this.props.history.push('/userprofile');
            // this.props.alert.success('Artist added successfully!', {timeout:2000});
        })
        .catch(err => {
            console.log(err.response.data.error, 'err');
            alert(err.response.data.error);
            // this.props.alert.error(err.response.data.error, {timeout:5000});
            this.setState({loading:false});
        })
    }

    updateArtist = (data) => {
        _updateArtist(this.state.artistId, data)
        .then(({ data: { artist }}) => {
            this.props.updateUserData(artist);
            this.setState({loading:false});
            this.props.history.push('/userprofile');
            // this.props.alert.success('Artist updated successfully!', {timeout:2000});
        })
        .catch(err => {
            console.log(err.response.data, 'err');
            // this.props.alert.error(err.response.data.error, {timeout:5000});
            this.setState({loading:false});
        })
    }

    render() {

        const { loading } = this.state;

        if(loading) {
            return <Spinner/>
        }

        return (
            <Container fluid className={classes.editContainer}>
                <div style={{...globalStyles.flexRowSpace}}>
                    <div>
                        <span className={classes.arrowIcon} onClick={() => this.props.history.goBack()}>
                            <FiArrowLeft style={{marginTop:-14, marginRight:10}} size={25} color='#fff'/>
                        </span>
                        <span className={classes.sectionTitle}>Edit Profile</span>
                    </div>
                    <div className={classes.saveBtnDesktop}>
                        <GradientBtn
                            onClick={this.saveProfile}
                            style={{width:200, padding:'0 37px', height:45}}
                            content={
                                <div>SAVE CHANGES</div>
                            }
                        />
                    </div>
                </div>
                <div className={classes.label}>
                    PROFILE PICTURE
                </div>
                <div style={{...globalStyles.flexRow}}>
                    {this.state.image ?
                        this.buildImgTag() :
                        <div className={classes.imgStyle} style={{...globalStyles.flexCenter, background:"#14192B"}}>
                            <img src={cameraIcon} alt='icon'/> 
                        </div>
                    }
                    <div>
                        <div className={classes.supportedFormats}>
                            Lorem ipsum dolor sit amet, aliquam consectetur. (.jpeg, .jpg, .png, .gif supported)
                        </div>
                        <label htmlFor="addImg" style={{position:'relative', cursor:'pointer'}}>
                            <input onChange={(e) => this.handleImage(e)} id="addImg" hidden type="file" name="Pick an Image" accept="image/x-png,image/gif,image/jpeg"/>
                            <OutlineBtn
                                text="UPLOAD FILE"
                            />
                        </label>
                    </div>
                </div>
                {/* <div className={classes.label}>
                    COVER PICTURE
                </div>
                <div className={classes.uploadCover}>
                    <div style={{fontSize:14, opacity:0.66, letterSpacing:0.5, fontWeight:100, width:"40%", marginBottom:15}}>
                        Lorem ipsum dolor sit amet, aliquam consectetur. (.jpeg, .jpg, .png, .gif supported)
                    </div>
                    <OutlineBtn
                        text="UPLOAD FILE"
                    />
                </div> */}
                {/* <div className={classes.gradientCover}>
                    <div style={{fontWeight:500, fontSize:16, marginRight:10}}>
                        Or use our default gradients:
                    </div>
                    <div onClick={() => this.setState({ selectedGradient:1 })} style={{border: selectedGradient == 1 ? '2px solid' : '2px solid transparent'}} className={classes.colorContainer1}>
                        <div className={classes.color1}/>
                    </div>
                    <div onClick={() => this.setState({ selectedGradient:2 })} style={{border: selectedGradient == 2 ? '2px solid' : '2px solid transparent'}} className={classes.colorContainer2}>
                        <div className={classes.color2}/>
                    </div>
                    <div onClick={() => this.setState({ selectedGradient:3 })} style={{border: selectedGradient == 3 ? '2px solid' : '2px solid transparent'}} className={classes.colorContainer3}>
                        <div className={classes.color3}/>
                    </div>
                </div> */}
                <div style={{marginBottom:5}} className={classes.label}>
                    ABOUT YOU
                </div>
                <Row>
                    <Col lg={6}>
                        <MaterialInput 
                            label="Name*"
                            onChange={(e) => this.setState({name: e.target.value})}
                            value={this.state.name}
                        />
                    </Col>
                    <Col lg={6}>
                        <MaterialInput 
                            label="Email address"
                            onChange={(e) => this.setState({email: e.target.value})}
                            value={this.state.email}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <MaterialInput 
                            label="Tell us something about you!"
                            onChange={(e) => this.setState({description: e.target.value})}
                            value={this.state.description}
                        />
                    </Col>
                </Row>
                <div style={{marginBottom:5}} className={classes.label}>
                    SOCIAL MEDIA
                </div>
                <Row style={{marginBottom:60}}>
                    <Col lg={6}>
                        <MaterialInput 
                            label="Instagram"
                            onChange={(e) => this.setState({instagram: e.target.value})}
                            value={this.state.instagram}
                        />
                    </Col>
                    <Col lg={6}>
                        <MaterialInput 
                            label="Twitter"
                            onChange={(e) => this.setState({twitter: e.target.value})}
                            value={this.state.twitter}
                        />
                    </Col>
                    <Col lg={6}>
                        <MaterialInput 
                            label="Facebook"
                            onChange={(e) => this.setState({facebook: e.target.value})}
                            value={this.state.facebook}
                        />
                    </Col>
                    <Col lg={6}>
                        <MaterialInput 
                            label="Website"
                            onChange={(e) => this.setState({website: e.target.value})}
                            value={this.state.website}
                        />
                    </Col>
                </Row>
                <div className={classes.saveBtnMobile}>
                    <GradientBtn
                        onClick={this.saveProfile}
                        style={{width:"100%", position:"fixed", bottom:0, left:0, borderRadius:0, height:45}}
                        content={
                            <div>SAVE CHANGES</div>
                        }
                    />
                </div>
            </Container>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateUserData: (payload) => dispatch({type: actionTypes.USER_DATA, payload}),
    }
};

const mapStateToProps = state => {
    return {
        walletInfo: state.nearReducer.walletInfo,
        isWalletSignedIn: state.nearReducer.isWalletSignedIn
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);