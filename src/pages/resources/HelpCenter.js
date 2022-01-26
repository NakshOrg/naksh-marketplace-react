import React, { Component } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { FiExternalLink } from 'react-icons/fi';

import MaterialInput from '../../components/uiComponents/MaterialInput';
import discord from "../../assets/svgs/discord.svg";
import instagram from "../../assets/svgs/instagram.svg";
import linkedIn from "../../assets/svgs/linkedIn.svg"; 
import telegram from "../../assets/svgs/telegram.svg";
import twitter from "../../assets/svgs/twitter.svg";
import sendMessage from "../../assets/svgs/sendMessage.svg";
import globalStyles from '../../globalStyles';
import classes from './resources.module.css';

export default class Blogs extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() { 

        return (
            <Container style={{marginTop:95}}>
                <div className={classes.helpCenterTopGradient}/>
                <div style={{...globalStyles.flexRowSpace, marginBottom:22}}>
                    <div className={classes.sectionTitle}>How can we help you?</div>
                </div>
                <Row>
                    <Col lg={8}>
                        <Row>
                            <Col>
                                <div className={classes.sectionCard}>
                                    <FiExternalLink style={{position:'absolute', top:8, right:8}} size={20} color='#fff'/>
                                    <div className={classes.sectionCardTitle}>Get familiar with Naksh</div>
                                    <div className={classes.sectionCardDescription}>Everything you need to know about Naksh</div>
                                </div>
                            </Col>
                            <Col>
                                <div className={classes.sectionCard}>
                                    <FiExternalLink style={{position:'absolute', top:8, right:8}} size={20} color='#fff'/>
                                    <div className={classes.sectionCardTitle}>Naksh and its functioning</div>
                                    <div className={classes.sectionCardDescription}>Everything about blockchain, wallets used and gas fee</div>
                                </div>
                            </Col>
                        </Row>
                        <div style={{marginTop:20}}/>
                        <Row>
                            <Col>
                                <div className={classes.sectionCard}>
                                    <FiExternalLink style={{position:'absolute', top:8, right:8}} size={20} color='#fff'/>
                                    <div className={classes.sectionCardTitle}>Questions for existing users</div>
                                    <div className={classes.sectionCardDescription}>Everything you need to know about Naksh</div>
                                </div>            
                            </Col>
                            <Col>
                                <div className={classes.sectionCard}>
                                    <FiExternalLink style={{position:'absolute', top:8, right:8}} size={20} color='#fff'/>
                                    <div className={classes.sectionCardTitle}>Questions for NFT owners</div>
                                    <div className={classes.sectionCardDescription}>Everything about blockchain, wallets used and gas fee</div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={4}>
                        <div style={{height:"100%"}} className={classes.sectionCard}>
                            <FiExternalLink style={{position:'absolute', top:8, right:8}} size={20} color='#fff'/>
                            <div className={classes.sectionCardTitle}>Frequently asked questions</div>
                            <div className={classes.sectionCardDescription}>Everything about blockchain, wallets used and gas fee</div>
                        </div>
                    </Col>
                </Row>
                <Row style={{margin:"65px 0"}}>
                    <Col lg={6}>
                        <div style={{fontSize:42, lineHeight:"40px", fontFamily:"Athelas-Bold"}}>Write to us and we'll reach out to you</div>
                        <div style={{fontSize: "16px", opacity: 0.7, marginTop: "10px", letterSpacing: "0.5px", fontWeight: 100, width: "60%", lineHeight: "20px"}}>
                            Fill out the form, and we'll reply to you soon.
                        </div>
                        <div className={classes.iconsContainer} style={{...globalStyles.flexRow, marginTop:30}}>
                            <div><img src={discord} alt='discord'/></div>
                            <div><img src={instagram} alt='instagram'/></div>
                            <div><img src={twitter} alt='twitter'/></div>
                            <div><img src={linkedIn} alt='linkedIn'/></div>
                            <div><img src={telegram} alt='telegram'/></div>
                        </div>
                    </Col>
                    <Col>
                        <MaterialInput 
                            label="Enter your name"
                        />
                        <MaterialInput 
                            label="Enter mail address"
                        />
                        <MaterialInput 
                            label="Enter your message here"
                            type="textarea"
                            isTextArea={true}
                        />
                        <div className={classes.sendBtn}>
                            <img src={sendMessage} alt='sendMessage'/>
                        </div>
                    </Col>
                </Row>
            </Container>
        )
    }
}
