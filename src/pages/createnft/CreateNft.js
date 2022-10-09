import { motion } from 'framer-motion';
import React, { Component, Fragment, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FiArrowLeft } from 'react-icons/fi';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import cameraIcon from '../../assets/svgs/camera.svg'
import { GradientBtn, OutlineBtn } from '../../components/uiComponents/Buttons';
import MaterialInput from '../../components/uiComponents/MaterialInput';
import Spinner from '../../components/uiComponents/Spinner';
import Dropdown from '../../components/uiComponents/Dropdown';
import { helpers, staticValues } from '../../constants';
import globalStyles from '../../globalStyles';
import * as actionTypes from '../../redux/actions/actionTypes';
import { _getAllArtforms, _getAllArtists, _getPresignedUrl, _postArtist, _updateArtist, _uploadFileAws, _uploadNft } from '../../services/axios/api';
import classes from '../profile/profile.module.css';
import { AddWalletIcon, EditIcon, UploadNftPlaceholder } from '../../components/svgComponents';
import NearHelperFunctions from '../../services/nearHelperFunctions';


export default function CreateNft(props) {
    
    const dispatch = useDispatch();
    const walletInfo = useSelector(state => state.nearReducer.walletInfo); 
    const isWalletSignedIn = useSelector(state => state.nearReducer.isWalletSignedIn);
    const userData = useSelector(state => state.nearReducer.userData);
    const params = useParams(); 
    const history = useHistory();
    const location = useLocation();
    
    const [loading, setLoading] = useState(true);
    const [nftImage, setNftImage] = useState(null);
    const [nftImageRaw, setNftImageRaw] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [royaltyError, setRoyaltyError] = useState("");
    const [artforms, setArtforms] = useState([]);
    const [artist, setArtist] = useState("");
    const [selectedArtform, setSelectedArtform] = useState({name:"Artform", _id:"dummy"});
    const [royalties, setRoyalties] = useState([{walletAddress:"", percentage:null}]);


    useEffect(() => {
        if(walletInfo) {
            setWalletAddress(walletInfo.getAccountId())
            getArtforms();
            getArtist();
        }
    }, [walletInfo]);

    useEffect(() => {
        setRoyaltyError("");
        const totalPercentage = royalties.reduce(
            (previousValue, currentValue) => previousValue + Number(currentValue.percentage),
            0
        );
        if (totalPercentage > 15) {
            setRoyaltyError("Royalties shouldn't exceed 15% in total");
        }
        // if (royalties.length >= 5) {
        //     setRoyaltyError("Cannot add more than 5 wallets");
        // }
    }, [royalties])

    const getArtist = () => {
        _getAllArtists({wallet: walletInfo.getAccountId(), sortBy: 'createdAt', sort: -1})
        .then(({ data: { artists } }) => {
            setArtist(artists[0]);
            setLoading(false);
        })
        .catch(err => {
            setLoading(false);
        });
    }

    const getArtforms = () => {
        _getAllArtforms()
        .then(res => {
            setArtforms(res.data.artforms);
        })
        .catch(err => {
            console.log(err);
        })
    }

    const handleImage = async (e) => {
        const res = await helpers.readImage(e);
        setNftImage(res[0]);
        setNftImageRaw(e.target.files[0]);
    }

    const handleRoyalties = (type, index, value, input) => {

        const copiedArr = [...royalties];

        if (type === "edit") {
            copiedArr.map((item, i) => {
                if (index === i) {
                    item[input] = value;
                }
            });
        }

        if (type === "add") {
            copiedArr.push({walletAddress:"", percentage:""});
        }

        if (type === "delete") {
            copiedArr.splice(index, 1);
        }
        setRoyalties(copiedArr);
    }

    const buildImgTag = () => {
        return <div style={{display:'flex', marginRight:10}}>
            <img height='180px' width= '180px' style={{borderRadius:100}} src={nftImage} alt="upload"/>
        </div>
    } 

    const uploadFilesToPinata = async () => {
        const fd = new FormData();
        fd.append("nftImage", nftImageRaw);

        // if(this.state.customInputs.length !== 0) {
        //     this.state.customInputs.map(cI => {
        //         if(cI.type === 1) {
        //             fd.append("custom", cI.fileKey);
        //         };
        //     });
        // };
        
        const response = await _uploadNft(fd);
        return response;

    }

    const handleNftMint = async () => { 
       
        const isValid = royalties.every(item => item.percentage !== null && item.walletAddress !== "");
 
        if(name && nftImage && walletAddress && description && isValid) {
            
            setLoading(true);
            const pinataResponse = await uploadFilesToPinata();

            if(pinataResponse.status === 200) {
    
                const { nftImageUrl, nftThumbnailUrl } = pinataResponse.data;
                const extraData = { walletAddress };
                if (selectedArtform) {
                    extraData["selectedArtform"] = selectedArtform;
                }
                extraData['nftThumbnailUrl'] = nftThumbnailUrl;
                extraData['artistName'] = artist.name;
                extraData['artistId'] = artist._id;
                const perpetualRoyalties = {};
                royalties.map(item => perpetualRoyalties[item.walletAddress] = item.percentage * 100);
                const metadata = {
                    media: nftImageUrl,
                    issued_at: Date.now(),
                    title: name,
                    description: description,
                    extra: JSON.stringify(extraData)
                };
                const functions = new NearHelperFunctions(walletInfo);
                functions.mintNft(metadata, perpetualRoyalties);  
               
            } else {
                this.setState({loading:false});
                alert("Failed to upload nft!");
            }
        } else {
            toast.error('All the fields are mandatory!');
            
        }
        
    }

    if(loading) return <Spinner/>;

    return (
        <Container fluid className={classes.editContainer}>
            <div style={{...globalStyles.flexRowSpace}}>
                <div>
                    <span className={classes.arrowIcon} onClick={() => history.goBack()}>
                        <FiArrowLeft style={{marginTop:-14, marginRight:10}} size={25} color='#fff'/>
                    </span>
                    <span className={classes.sectionTitle}>Create NFT</span>
                </div>
                <div className={classes.saveBtnDesktop}>
                    <GradientBtn
                        onClick={handleNftMint}
                        style={{width:200, padding:'0 37px', height:45}}
                        content={
                            <div>MINT NFT</div>
                        }
                    />
                </div>
            </div>
            <div className={classes.label}>
                NFT DETAILS
            </div>
            <Row>
                <Col lg={4}>
                    <div className={classes.containerCard} style={{background:"#14192B", textAlign:'center', padding: "50px", height: "fit-content"}}>
                        <label htmlFor="addImg" style={{position:'relative', cursor:'pointer'}}>
                            <input onChange={(e) => handleImage(e)} id="addImg" hidden type="file" name="Pick an Image" accept="image/x-png,image/gif,image/jpeg"/>
                            {nftImage ?
                                buildImgTag() :
                            <UploadNftPlaceholder size={128}/>}
                            {nftImage && <div className={classes.editIcon}>
                                <EditIcon size={20}/>
                            </div>}
                        </label>
                        <div style={{fontSize:16, fontWeight:600, opacity:0.7, marginTop:15}}>Upload your NFT here</div>
                        <div style={{fontSize:12, fontWeight:600, opacity:0.4, marginTop:5}}>(Supports JPEG, .jpg, .png, .mp4 format)</div>
                    </div>
                </Col>
                <Col lg={8}>
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
                                readOnly={true}
                                label="Wallet Address*"
                                value={walletAddress}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <MaterialInput
                                isTextArea={true}
                                label="Description*"
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={6}>
                            <Dropdown
                                style={{paddingTop:100}}
                                title={selectedArtform.name}
                                content={artforms}
                                onChange={(val) => setSelectedArtform(val)}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <div className={classes.label}>
                FOREVER ROYALTIES
            </div>
            <div style={{...globalStyles.flexRowSpace, marginTop:-10, marginBottom:20}}> 
                <div style={{fontSize:14, fontWeight:600, opacity:0.4}}>
                    Forever Royalties are perpetual. You can add royalties up to 15% split across 5 accounts.
                </div>
                <div onClick={() => royalties.length >= 5 ? null : handleRoyalties("add")} style={{cursor:"pointer"}}>
                    <AddWalletIcon/>
                </div>
            </div>

            <Row>
                {royaltyError && <div style={{color:"red", marginTop:-30, fontSize:18}}>{royaltyError}</div>}
            {
                royalties.map((item, index) => {
                        return <>
                        <Col lg={8}>
                            <MaterialInput 
                                label="Wallet Address"
                                onChange={(e) => handleRoyalties("edit", index, e.target.value, "walletAddress")}
                                value={item.walletAddress}
                                showIcon={true}
                                handleDelete={() => handleRoyalties("delete", index)}
                            />
                        </Col>
                        <Col lg={4}>
                            <MaterialInput
                                type="number"
                                label="Percentage"
                                onChange={(e) => handleRoyalties("edit", index, e.target.value, "percentage")}
                                value={item.percentage}
                            />
                        </Col>
                    </>
                })
            }
        </Row>

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