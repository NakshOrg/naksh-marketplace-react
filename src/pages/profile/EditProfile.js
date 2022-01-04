import { motion } from 'framer-motion';
import React, { Component, Fragment } from 'react';
import { Container } from 'react-bootstrap';
import { FiArrowLeft } from 'react-icons/fi';

import cameraIcon from '../../assets/svgs/camera.svg'
import { GradientBtn, OutlineBtn } from '../../components/uiComponents/Buttons';
import globalStyles from '../../globalStyles';
import classes from './profile.module.css';

export default class EditProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: "owned"
        }
    }

    render() {

        return (
            <Container style={{marginTop:100, padding:'0 200px'}} fluid>
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
                <div style={{background: '#14192B', backdropFilter: 'blur(96.1806px)', textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', padding:'25px 0'}}>
                    <div style={{fontSize:14, opacity:0.66, letterSpacing:0.5, fontWeight:100, width:"40%", marginBottom:15}}>
                        Lorem ipsum dolor sit amet, aliquam consectetur. (.jpeg, .jpg, .png, .gif supported)
                    </div>
                    <OutlineBtn
                        text="UPLOAD FILE"
                    />
                </div>
            </Container>
        )
    }
}
