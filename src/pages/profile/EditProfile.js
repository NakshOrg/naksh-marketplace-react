import { motion } from 'framer-motion';
import React, { Component, Fragment, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FiArrowLeft } from 'react-icons/fi';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import cameraIcon from '../../assets/svgs/camera.svg'
import { GradientBtn, OutlineBtn } from '../../components/uiComponents/Buttons';
import MaterialInput from '../../components/uiComponents/MaterialInput';
import Spinner from '../../components/uiComponents/Spinner';
import { helpers, staticValues } from '../../constants';
import globalStyles from '../../globalStyles';
import * as actionTypes from '../../redux/actions/actionTypes';
import { _getAllArtists, _getPresignedUrl, _postArtist, _updateArtist, _uploadFileAws } from '../../services/axios/api';
import classes from './profile.module.css';


export default function EditProfile(props) {
    
    const dispatch = useDispatch();
    const walletInfo = useSelector(state => state.nearReducer.walletInfo); 
    const isWalletSignedIn = useSelector(state => state.nearReducer.isWalletSignedIn);
    const userData = useSelector(state => state.nearReducer.userData);
    const params = useParams(); 
    const history = useHistory();
    const location = useLocation();
    
    const [loading, setLoading] = useState(true);
    const [showOptions, setShowOptions] = useState(false);
    const [value, setValue] = useState("owned");
    const [selectedGradient, setSelectedGradient] = useState(staticValues.gradients[0]);
    const [showModal, setShowModal] = useState(false);
    const [artistId, setArtistId] = useState("");
    const [image, setImage] = useState(null);
    const [imageRaw, setImageRaw] = useState(null); 
    const [coverImage, setCoverImage] = useState(null);
    const [coverImageRaw, setCoverImageRaw] = useState(null);
    const [coverStatus, setCoverStatus] = useState(0); // 0 gradient 1 image
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [wallet, setWallet] = useState("");
    const [email, setEmail] = useState("");
    const [website, setWebsite] = useState("");
    const [facebook, setFacebook] = useState("");
    const [instagram, setInstagram] = useState("");
    const [twitter, setTwitter] = useState("");
    const [profileAlreadyCreated, setProfileAlreadyCreated] = useState("false");


    useEffect(() => {
        if(walletInfo) {
            getArtist();
        }
    }, [walletInfo]);

    const getArtist = () => {
        _getAllArtists({wallet: walletInfo.getAccountId(), sortBy: 'createdAt', sort: -1})
        .then(({ data: { artists } }) => {
            
            if(artists.length !== 0) {
                console.log(artists[0]);
                setProfileAlreadyCreated(true);
                setArtistId(artists[0]._id);
                setName(artists[0].name);
                setEmail(artists[0].email);
                setWallet(artists[0].wallet);
                setDescription(artists[0].description);
                setImage(artists[0].image);
                if(artists[0].coverStatus === 1) {
                    setCoverImage(artists[0].coverImage);
                } else {
                    setSelectedGradient(artists[0].coverGradient);
                }
                artists[0].facebook &&  setFacebook(artists[0].facebook);
                artists[0].website &&  setWebsite(artists[0].website);
                artists[0].instagram && setInstagram(artists[0].instagram);
                artists[0].twitter && setTwitter(artists[0].twitter);
 
            }
            setLoading(false);
        })
        .catch(err => {
            setLoading(false);
        });
    }

    const handleGradient = (index) => {
        setSelectedGradient(staticValues.gradients[index]);
        setCoverStatus(0);
    }

    const handleImage = async (e) => {
        const res = await helpers.readImage(e);
        setImage(res[0]);
        setImageRaw(e.target.files[0]);
    }

    const handleCoverImage = async (e) => {
        const res = await helpers.readImage(e);
        setCoverImage(res[0]);
        setCoverImageRaw(e.target.files[0]);
        setCoverStatus(1);
    }

    const buildImgTag = () => {
        return <img className={classes.imgStyle} src={image} alt='icon'/> 
    } 

    const buildCoverImgTag = () => {
        return <div style={{position:"relative"}} onMouseLeave={() => setShowOptions(false)} onMouseOver={() => setShowOptions(true)} className={classes.uploadCover}>
            <img 
                style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    opacity: showOptions ? 0.5 : 1
                }}
                src={coverImage} 
                alt='icon'
            /> 
            {showOptions && <div style={{position:"absolute"}}>
                <div style={globalStyles.flexRow}>
                    <label htmlFor="replaceCover" style={{position:'relative', cursor:'pointer'}}>
                        <input onChange={(e) => handleCoverImage(e)} id="replaceCover" hidden type="file" name="Pick an Image" accept="image/x-png,image/gif,image/jpeg"/>
                        <OutlineBtn
                            style={{fontWeight:"bold", fontSize:14}}
                            text="Replace"
                        />
                    </label>
                    <div 
                        onClick={() => {
                            setCoverImage(null);
                            setImageRaw(null);
                            setCoverStatus(0);
                        }} 
                        style={{fontWeight:"bold", marginLeft:35, fontSize:14, cursor:"pointer"}}
                    >
                        Remove
                    </div>
                </div>
            </div>}
        </div>
    } 

    const saveProfile = async () => {

        setLoading(true);

        let data = {
            name: name,
            wallet: walletInfo.getAccountId(),
            coverStatus
        }

        if(coverStatus === 0) {
            data['coverGradient'] = selectedGradient;
        }
        
        const stateObj = {email:email, website:website, facebook:facebook, instagram:instagram, twitter:twitter, description:description};
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

        if(coverImageRaw !== null) {
            const urlRes = await _getPresignedUrl({"module": "artist", "totalFiles": 1});
            const uploadRes = await _uploadFileAws(urlRes.data.urls[0].url, coverImageRaw, coverImageRaw.type);
            
            if(uploadRes.status === 200) {
                data["coverImage"] = urlRes.data.urls[0].Key
            }
        }

        if(profileAlreadyCreated) {
            updateArtist(data);
        } else {
            addArtist(data);
        }

    }

    const addArtist = (data) => {
        
        data['createdBy'] = 1;
        
        _postArtist(data)
        .then(res => {
            setLoading(false);
            history.goBack();
            // this.props.alert.success('Artist added successfully!', {timeout:2000});
        })
        .catch(err => {
            alert(err.response.data.error);
            setLoading(false);
        })
    }

    const updateArtist = (data) => {
        _updateArtist(artistId, data)
        .then(({ data: { artist }}) => {
            dispatch({type: actionTypes.USER_DATA, payload:artist});
            setLoading(false);
            history.goBack();
            // this.props.alert.success('Artist updated successfully!', {timeout:2000});
        })
        .catch(err => {
            console.log(err.response.data, 'err');
            // this.props.alert.error(err.response.data.error, {timeout:5000});
            setLoading(false);
        })
    }

    if(loading) return <Spinner/>;

    return (
        <Container fluid className={classes.editContainer}>
            <div style={{...globalStyles.flexRowSpace}}>
                <div>
                    <span className={classes.arrowIcon} onClick={() => history.goBack()}>
                        <FiArrowLeft style={{marginTop:-14, marginRight:10}} size={25} color='#fff'/>
                    </span>
                    <span className={classes.sectionTitle}>Edit Profile</span>
                </div>
                <div className={classes.saveBtnDesktop}>
                    <GradientBtn
                        onClick={saveProfile}
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
                {image ?
                    buildImgTag() :
                    <div className={classes.imgStyle} style={{...globalStyles.flexCenter, background:"#14192B"}}>
                        <img src={cameraIcon} alt='icon'/> 
                    </div>
                }
                <div>
                    <div className={classes.supportedFormats}>
                        Upload your profile picture here. Your picture will be public.
                    </div>
                    <label htmlFor="addImg" style={{position:'relative', cursor:'pointer'}}>
                        <input onChange={(e) => handleImage(e)} id="addImg" hidden type="file" name="Pick an Image" accept="image/x-png,image/gif,image/jpeg"/>
                        <OutlineBtn
                            text="UPLOAD FILE"
                        />
                    </label>
                </div>
            </div>
            <div className={classes.label}>
                COVER PICTURE
            </div>
            {coverImage ?
                buildCoverImgTag() :
                <div className={classes.uploadCover}>
                    <div style={{fontSize:14, opacity:0.66, letterSpacing:0.5, fontWeight:100, width:"40%", marginBottom:15}}>
                        Lorem ipsum dolor sit amet, aliquam consectetur. (.jpeg, .jpg, .png, .gif supported)
                    </div>
                    <label htmlFor="addCoverImg" style={{position:'relative', cursor:'pointer'}}>
                        <input onChange={(e) => handleCoverImage(e)} id="addCoverImg" hidden type="file" name="Pick an Image" accept="image/x-png,image/gif,image/jpeg"/>
                        <OutlineBtn
                            text="UPLOAD FILE"
                        />
                    </label>
                </div>
            }
            <div style={{position:"relative"}}>
                <div style={{background:selectedGradient}} className={classes.gradientCover}>
                    <div style={{fontWeight:500, fontSize:16, marginRight:10}}>
                        Or use our default gradients:
                    </div>
                    <div onClick={() => handleGradient(0)} style={{border: selectedGradient == staticValues.gradients[0] ? '2px solid' : '2px solid transparent'}} className={classes.colorContainer1}>
                        <div className={classes.color1}/>
                    </div>
                    <div onClick={() => handleGradient(1)} style={{border: selectedGradient == staticValues.gradients[1] ? '2px solid' : '2px solid transparent'}} className={classes.colorContainer2}>
                        <div className={classes.color2}/>
                    </div>
                    <div onClick={() => handleGradient(2)} style={{border: selectedGradient == staticValues.gradients[2] ? '2px solid' : '2px solid transparent'}} className={classes.colorContainer3}>
                        <div className={classes.color3}/>
                    </div>
                </div>
                {coverImage &&
                <div style={{background:"#000", opacity:0.4, zIndex:3, position:"absolute", margin:0, top:0, left:0, cursor:"no-drop"}} className={classes.gradientCover}>
                </div>}
            </div>
            <div style={{marginBottom:5}} className={classes.label}>
                ABOUT YOU
            </div>
            <Row>
                <Col lg={6}>
                    <MaterialInput 
                        label="Name*"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </Col>
                <Col lg={6}>
                    <MaterialInput 
                        label="Email address"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <MaterialInput 
                        label="Tell us something about you!"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
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
                        onChange={(e) => setInstagram(e.target.value)}
                        value={instagram}
                    />
                </Col>
                <Col lg={6}>
                    <MaterialInput 
                        label="Twitter"
                        onChange={(e) => setTwitter(e.target.value)}
                        value={twitter}
                    />
                </Col>
                <Col lg={6}>
                    <MaterialInput 
                        label="Facebook"
                        onChange={(e) => setFacebook(e.target.value)}
                        value={facebook}
                    />
                </Col>
                <Col lg={6}>
                    <MaterialInput 
                        label="Website"
                        onChange={(e) => setWebsite(e.target.value)}
                        value={website}
                    />
                </Col>
            </Row>
            <div className={classes.saveBtnMobile}>
                <GradientBtn
                    onClick={saveProfile}
                    style={{width:"100%", position:"fixed", bottom:0, left:0, borderRadius:0, height:45}}
                    content={
                        <div>SAVE CHANGES</div>
                    }
                />
            </div>
        </Container>
    )

}


// class EditProfile extends Component {


 

 

        
//     }
// }

// const mapDispatchToProps = dispatch => {
//     return {
//         updateUserData: (payload) => dispatch({type: actionTypes.USER_DATA, payload}),
//     }
// };

// const mapStateToProps = state => {
//     return {
//         walletInfo: state.nearReducer.walletInfo,
//         isWalletSignedIn: state.nearReducer.isWalletSignedIn
//     }
// };

// export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);