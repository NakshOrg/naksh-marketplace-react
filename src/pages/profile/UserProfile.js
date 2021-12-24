import { motion } from 'framer-motion';
import React, { Component, Fragment } from 'react';
import { Col, Row, Container } from 'react-bootstrap';

import NftCard from '../../components/explore/NftCard';
import globalStyles from '../../globalStyles';
import classes from './profile.module.css';

export default class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: "owned"
        }
    }

    render() {

        const { activeTab } = this.state;

        return (
            <div>
                <img
                    className={classes.profileCoverImage} 
                    src='https://media.istockphoto.com/photos/fine-art-abstract-floral-painting-background-picture-id1258336471'
                    alt='cover'
                />
                <Container fluid>
                    <Row>
                        <Col lg={4}>
                            <div className={classes.profileContainer}>
                                <img 
                                    style={{height:100, width:100, borderRadius:100, objectFit:"cover", marginTop:30}}
                                    src='https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80'
                                    alt='profile'
                                />
                                <div style={{fontFamily:"Athelas-bold", fontSize:24, marginTop:10}}>Nicole Souza</div>
                            </div>
                        </Col>
                        <Col lg={8}>
                            <div style={{margin:"30px auto", width:"40%"}}>
                                <div style={globalStyles.flexRow}>
                                    <div onClick={() => this.setState({activeTab:"owned"})} style={{fontWeight: activeTab == "owned" ? "bold" : "400", opacity: activeTab == "owned" ? 1 : 0.7, fontSize:12, cursor:'pointer', letterSpacing:1.5}}>
                                        OWNED
                                    </div>
                                    <div onClick={() => this.setState({activeTab:"saved"})} style={{fontWeight: activeTab == "saved" ? "bold" : "400", opacity: activeTab == "saved" ? 1 : 0.7, fontSize:12, marginLeft:30, cursor:'pointer', letterSpacing:1.5}}>
                                        SAVED
                                    </div>
                                    <div onClick={() => this.setState({activeTab:"sold"})} style={{fontWeight: activeTab == "sold" ? "bold" : "400", opacity: activeTab == "sold" ? 1 : 0.7, fontSize:12, marginLeft:30, cursor:'pointer', letterSpacing:1.5}}>
                                        SOLD
                                    </div>
                                </div>
                                {/* bottom indicator */}
                                <motion.div 
                                    animate={{ 
                                        x: 
                                        activeTab == "owned" ? 23 :
                                        activeTab == "saved" ? 103 :
                                        175 
                                    }}
                                    transition={{ duration: 0.5 }}
                                    style={{height:3, background:"#fff", width:8, borderRadius:100, marginTop:2}}
                                /> 
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
