import { motion } from 'framer-motion';
import React, { Component, Fragment } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FiArrowLeft } from 'react-icons/fi';

import cameraIcon from '../../assets/svgs/camera.svg'
import { GradientBtn, OutlineBtn } from '../../components/uiComponents/Buttons';
import MaterialInput from '../../components/uiComponents/MaterialInput';
import globalStyles from '../../globalStyles';
import classes from './profile.module.css';

export default class EditProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: "owned",
            selectedGradient: 1
        }
    }

    render() {

        const { selectedGradient } = this.state;

        return (
            <Container style={{marginTop:100, marginBottom:40, padding:'0 200px'}} fluid>
                <div style={{...globalStyles.flexRowSpace}}>
                    <div>
                        <span onClick={() => this.props.navigate(-1)}><FiArrowLeft style={{marginTop:-14, marginRight:10}} size={25} color='#fff'/></span>
                        <span className={classes.sectionTitle}>Edit Profile</span>
                    </div>
                    <GradientBtn
                        style={{width:200, padding:'0 37px', height:45}}
                        content={
                            <div>SAVE CHANGES</div>
                        }
                    />
                </div>
                <div className={classes.label}>
                    PROFILE PICTURE
                </div>
                <div style={{...globalStyles.flexRow}}>
                    <div style={{...globalStyles.flexCenter, background:"#14192B", width:150, height:150, borderRadius:75, marginRight:25}}>
                        <img src={cameraIcon} alt='icon'/> 
                    </div>
                    <div>
                        <div style={{fontSize:14, opacity:0.66, letterSpacing:0.5, fontWeight:100, width:"60%", marginBottom:15}}>
                            Lorem ipsum dolor sit amet, aliquam consectetur. (.jpeg, .jpg, .png, .gif supported)
                        </div>
                        <OutlineBtn
                            text="UPLOAD FILE"
                        />
                    </div>
                </div>
                <div className={classes.label}>
                    COVER PICTURE
                </div>
                <div className={classes.uploadCover}>
                    <div style={{fontSize:14, opacity:0.66, letterSpacing:0.5, fontWeight:100, width:"40%", marginBottom:15}}>
                        Lorem ipsum dolor sit amet, aliquam consectetur. (.jpeg, .jpg, .png, .gif supported)
                    </div>
                    <OutlineBtn
                        text="UPLOAD FILE"
                    />
                </div>
                <div className={classes.gradientCover}>
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
                </div>
                <div style={{marginBottom:5}} className={classes.label}>
                    ABOUT YOU
                </div>
                <Row>
                    <Col lg={6}>
                        <MaterialInput 
                            label="Username*"
                        />
                    </Col>
                    <Col lg={6}>
                        <MaterialInput 
                            label="Email address"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <MaterialInput 
                            label="Tell us something about you!"
                        />
                    </Col>
                </Row>
                <div style={{marginBottom:5}} className={classes.label}>
                    SOCIAL MEDIA
                </div>
                <Row>
                    <Col lg={6}>
                        <MaterialInput 
                            label="Instagram"
                        />
                    </Col>
                    <Col lg={6}>
                        <MaterialInput 
                            label="Twitter"
                        />
                    </Col>
                    <Col lg={6}>
                        <MaterialInput 
                            label="Facebook"
                        />
                    </Col>
                    <Col lg={6}>
                        <MaterialInput 
                            label="Website"
                        />
                    </Col>
                </Row>
            </Container>
        )
    }
}
