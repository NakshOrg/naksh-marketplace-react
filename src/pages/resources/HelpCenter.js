import React, { Component } from 'react';
import { Col, Row, Container, Spinner } from 'react-bootstrap';
import { FiExternalLink } from 'react-icons/fi';
import { motion } from "framer-motion"

import { _postFeedback } from '../../services/axios/api';
import MaterialInput from '../../components/uiComponents/MaterialInput';
import discord from "../../assets/svgs/discord.svg";
import instagram from "../../assets/svgs/instagram.svg";
import linkedIn from "../../assets/svgs/linkedIn.svg"; 
import telegram from "../../assets/svgs/telegram.svg"; 
import twitter from "../../assets/svgs/twitter.svg";
import party from "../../assets/svgs/party.svg";
import sendMessage from "../../assets/svgs/sendMessage.svg";
import globalStyles from '../../globalStyles';
import classes from './resources.module.css';
import configs from '../../configs';
import { helpers } from '../../constants';
import Footer from '../../components/uiComponents/Footer';

export default class Blogs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            message: "",
            isEmailSent: false,
            loading: false
        }
    }

    handleSendMessage = () => {

        const { name, email, message } = this.state;

        if(name && email && message) {
            this.setState({loading:true});
            _postFeedback({name, email, message})
            .then(res => {
                this.setState({loading:false, isEmailSent:true});
            })
            .catch(err => {
                this.setState({loading:false});
                alert(err.response.data.error);
            })

        } else {
            alert("All the fields are required!");
        }

    }

    render() { 

        return (
            <Container fluid className={classes.helpContainer}>
                <div className={classes.helpCenterTopGradient}/>
                <div style={{...globalStyles.flexRowSpace, marginBottom:22}}>
                    <div className={classes.sectionTitle}>How can we help you?</div>
                </div>
                <Row>
                    <Col lg={8} md={12}>
                        <Row>
                            <Col md={6} sm={12}>
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => helpers.openInNewTab(configs.familiarWithNaksh)} 
                                    className={classes.sectionCard}
                                >
                                    <FiExternalLink style={{position:'absolute', top:8, right:8}} size={20} color='#fff'/>
                                    <div className={classes.sectionCardTitle}>Get familiar with Naksh</div>
                                    <div className={classes.sectionCardDescription}>Creating an account, buying an NFT and other introductory topics for new users.</div>
                                </motion.div>
                            </Col>
                            <div className={classes.mobileCardColSpace}/>
                            <Col md={6} sm={12}>
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => helpers.openInNewTab(configs.nakshFunctioning)} 
                                    className={classes.sectionCard}
                                >
                                    <FiExternalLink style={{position:'absolute', top:8, right:8}} size={20} color='#fff'/>
                                    <div className={classes.sectionCardTitle}>Naksh and its functioning</div>
                                    <div className={classes.sectionCardDescription}>Gas fee, blockchain support and other questions regarding Naksh's functioning.</div>
                                </motion.div>
                            </Col>
                        </Row>
                        <div style={{marginTop:20}}/>
                        <Row>
                            <Col md={6} sm={12}>
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => helpers.openInNewTab(configs.existingUsers)} 
                                    className={classes.sectionCard}
                                >
                                    <FiExternalLink style={{position:'absolute', top:8, right:8}} size={20} color='#fff'/>
                                    <div className={classes.sectionCardTitle}>Questions for existing users</div>
                                    <div className={classes.sectionCardDescription}>Checking the history of an NFT, Making an offer and other queries for account holders.</div>
                                </motion.div>
                            </Col>
                            <div className={classes.mobileCardColSpace}/>
                            <Col md={6} sm={12}>
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => helpers.openInNewTab(configs.nftOwners)} 
                                    className={classes.sectionCard}
                                >
                                    <FiExternalLink style={{position:'absolute', top:8, right:8}} size={20} color='#fff'/>
                                    <div className={classes.sectionCardTitle}>Questions for NFT owners</div>
                                    <div className={classes.sectionCardDescription}>Finances, Reselling and Visibility of NFTs for owners, collectors and artists.</div>
                                </motion.div>
                            </Col>
                        </Row>
                    </Col>
                    <div className={classes.mobileCardSpace}/>
                    <Col lg={4} md={12}>
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => helpers.openInNewTab(configs.faq)} 
                            style={{height:"100%", cursor:"pointer"}} 
                            className={classes.sectionCard}
                        >
                            <FiExternalLink style={{position:'absolute', top:8, right:8}} size={20} color='#fff'/>
                            <div className={classes.sectionCardTitle}>Frequently asked questions</div>
                            <div className={classes.sectionCardDescription}>Answers to common questions you may have!</div>
                        </motion.div>
                    </Col>
                </Row>
                <Row style={{margin:"65px 0"}}>
                    <Col lg={6}>
                        <div className={classes.writeToUs} style={{fontSize:42, lineHeight:"40px", fontFamily:"Athelas-Bold"}}>Write to us and we'll reach out to you</div>
                        <div className={classes.fillForm} style={{fontSize: "16px", opacity: 0.7, marginTop: "10px", letterSpacing: "0.5px", fontWeight: 100, width: "60%", lineHeight: "20px"}}>
                            Fill out the form, and we'll reply to you soon.
                        </div>
                        <div className={classes.iconsContainer} style={{...globalStyles.flexRow, margin:"30px 0"}}>
                            <div onClick={() => helpers.openInNewTab(configs.discord)}><img src={discord} alt='discord'/></div>
                            <div onClick={() => helpers.openInNewTab(configs.instagram)}><img src={instagram} alt='instagram'/></div>
                            <div onClick={() => helpers.openInNewTab(configs.twitter)}><img src={twitter} alt='twitter'/></div>
                            <div onClick={() => helpers.openInNewTab(configs.linkedin)}><img src={linkedIn} alt='linkedIn'/></div>
                            <div onClick={() => helpers.openInNewTab(configs.telegram)}><img src={telegram} alt='telegram'/></div>
                        </div>
                    </Col>
                    {!this.state.isEmailSent ?
                    <Col>
                        <MaterialInput
                            onChange={(e) => this.setState({name:e.target.value})} 
                            value={this.state.name}
                            label="Enter your name"
                        />
                        <MaterialInput 
                            onChange={(e) => this.setState({email:e.target.value})} 
                            value={this.state.email}
                            label="Enter mail address"
                        />
                        <MaterialInput 
                            onChange={(e) => this.setState({message:e.target.value})} 
                            value={this.state.message}
                            label="Enter your message here"
                            type="textarea"
                            isTextArea={true}
                        />
                        <div onClick={this.handleSendMessage} className={classes.sendBtn}>
                            {this.state.loading ?
                            <Spinner 
                                size={20} 
                                animation="border"
                                style={{
                                    color:"#000",
                                    cursor:"pointer",
                                    height:20,
                                    width:20,
                                    borderWidth:2
                                }}
                            /> :
                            <img src={sendMessage} alt='sendMessage'/>}
                        </div>
                    </Col> :
                    <Col style={{padding:0}}>
                        <div className={classes.successMessage}>
                            <img style={{height:65, marginBottom:15}} src={party} alt="party"/>
                            <div className={classes.successTitle}>Thank you for writing to us! </div>
                            <div className={classes.successDescription}>
                                Please keep an eye on your inbox for a response from us!
                            </div>
                        </div>
                    </Col>}
                    <div className={classes.helpCenterBottomGradient}/>
                </Row>
                <Footer/>
            </Container>
        )
    }
}
