import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import cameraIcon from '../../assets/svgs/camera.svg'
import { GradientBtn, OutlineBtn } from '../../components/uiComponents/Buttons';
import MaterialInput from '../../components/uiComponents/MaterialInput';
import Spinner from '../../components/uiComponents/Spinner';
import { helpers, staticValues } from '../../constants';
import globalStyles from '../../globalStyles';
import * as actionTypes from '../../redux/actions/actionTypes';
import { _addCollection, _getAllArtists, _getOneCollection, _getPresignedUrl, _updateArtist, _updateCollection, _uploadFileAws } from '../../services/axios/api';
import classes from '../profile/profile.module.css';


export default function Collection(props) {
    
    const dispatch = useDispatch();
    const walletInfo = useSelector(state => state.nearReducer.walletInfo); 
    const isWalletSignedIn = useSelector(state => state.nearReducer.isWalletSignedIn);
    const userData = useSelector(state => state.nearReducer.userData);
    const params = useParams(); 
    const history = useHistory();
    const location = useLocation();
    
    const [loading, setLoading] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [value, setValue] = useState("owned");
    const [selectedGradient, setSelectedGradient] = useState(staticValues.gradients[0]);
    const [collection, setCollection] = useState(null);
    const [artistId, setArtistId] = useState("");
    const [image, setImage] = useState(null);
    const [imageRaw, setImageRaw] = useState(null); 
    const [coverImage, setCoverImage] = useState(null);
    const [coverImageRaw, setCoverImageRaw] = useState(null);
    const [coverStatus, setCoverStatus] = useState(0); // 0 gradient 1 image
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [wallet, setWallet] = useState("");
    const [website, setWebsite] = useState("");
    const [facebook, setFacebook] = useState("");
    const [instagram, setInstagram] = useState("");
    const [twitter, setTwitter] = useState("");
    const [profileAlreadyCreated, setProfileAlreadyCreated] = useState(false);

    const collectionId = location.state?.collectionId;
    
    useEffect(() => {
        if(walletInfo) {
            getArtist();
        }
    }, [walletInfo]);

    const getArtist = () => {
        _getAllArtists({wallet: walletInfo.getAccountId(), sortBy: 'createdAt', sort: -1})
        .then(({ data: { artists } }) => {
            setArtistId(artists[0]._id);
            if (collectionId) {
                _getOneCollection(collectionId)
                .then(({ data: { collection } }) => {
                    console.log(collection, 'res');
                    // console.log(artists[0]);
                    setName(collection.name);
                    setDescription(collection.description);
                    setImage(collection.image);
                    if(collection.coverStatus === 1) {
                        setCoverImage(collection.coverImage);
                    } else {
                        setSelectedGradient(collection.coverGradient);
                    }
                    collection.facebook &&  setFacebook(collection.facebook);
                    collection.website &&  setWebsite(collection.website);
                    collection.instagram && setInstagram(collection.instagram);
                    collection.twitter && setTwitter(collection.twitter);
                    setCollection(collection);
                    setLoading(false);})
                .catch(err => {
                    console.log(err.response.error, 'erro')
                    setLoading(false);})
            } else {
                setLoading(false);
            }
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

    const saveChanges = async () => {

        setLoading(true);

        let data = {
            name: name,
            artist: artistId,
            coverStatus
        }

        if(coverStatus === 0) {
            data['coverGradient'] = selectedGradient;
        }
        
        const stateObj = {website:website, facebook:facebook, instagram:instagram, twitter:twitter, description:description};
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

        if(collectionId) {
            updateCollection(data);
        } else {
            addCollection(data);
        }

    }

    const addCollection = (data) => {
        
        _addCollection(data)
        .then(({ data }) => {
            setLoading(false);
            history.push(`/viewCollection/${data.collection._id}`);
            toast.success('Collection created successfully!');
        })
        .catch(err => {
            alert(err.response.data.error);
            setLoading(false);
        })
    }

    const updateCollection = (data) => {
        _updateCollection(collectionId, data)
        .then(({ data: { collection } }) => {
            setLoading(false);
            toast.success('Collection updated successfully!');
            history.push(`/viewCollection/${collection._id}`);
        })
        .catch(err => {
            console.log(err.response)
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
                    <span className={classes.sectionTitle}>{`${collectionId ? "Edit Collection" : "Create Collection"}`}</span>
                </div>
                <div className={classes.saveBtnDesktop}>
                    <GradientBtn
                        onClick={saveChanges}
                        style={{width:200, padding:'0 37px', height:45}}
                        content={
                            <div>SAVE CHANGES</div>
                        }
                    />
                </div>
            </div>
            <div className={classes.label}>
                UPLOAD PICTURE
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
                    Upload an optional cover picture for your profile here. <br/>Your picture will be public.
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
                ABOUT COLLECTION
            </div>
            <Row>
                <Col>
                    <MaterialInput 
                        label="Name*"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <MaterialInput 
                        label="Tell us something about the collection!"
                        isTextArea={true}
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
                    onClick={saveChanges}
                    style={{width:"100%", position:"fixed", bottom:0, left:0, borderRadius:0, height:45}}
                    content={
                        <div>SAVE CHANGES</div>
                    }
                />
            </div>
        </Container>
    )
}