import React, { Component, Fragment } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import AboutCard from '../../components/about/AboutCard';

import classes from './about.module.css';

export default class About extends Component {
    render() {
        return (
            <Container style={{marginTop:160}}>
                <div className={classes.sectionCaption}>
                    Naksh is constantly pushing the boundaries of what NFTs can do
                </div>
                <div className={classes.sectionSubHeading}>
                    The past and the future of art and art exchanges needed a bridge, and this is where we came up with the idea of an NFT marketplace catering to regional artists and traditional mediums.
                </div>
                <div className={classes.sectionTitle}>
                    With Naksh, you can
                </div>
                <Row>
                    <Col lg={4}>
                        <AboutCard
                            title={"Original Artworks"}
                            content={"Paid works by some of the finest creators of India"}
                        />
                    </Col>
                    <Col lg={4}>
                        <AboutCard
                            title={"Community"}
                            content={"A place to find new creators, build a community that lasts for a long time"}
                        />
                    </Col>
                    <Col lg={4}>
                        <AboutCard
                            title={"NFT Collectibles"}
                            content={"Create a collection of your favorite artworks minted by our creators"}
                        />
                    </Col>
                </Row>
                <Row style={{margin:"90px 0"}}>
                    <Col lg={4}>
                        <div style={{fontSize:46, fontFamily:'Athelas-Bold', lineHeight:"50px"}}>The women behind Naksh</div>
                        <div style={{fontSize: "16px", opacity: 0.7, marginTop: "15px", lineHeight: "25px"}}>Our co-founders envisioned Naksh at a NEAR Hackathon in May 2020. We have come a long way since then.</div>
                    </Col>
                    <Col lg={4}>
                        <div>
                            <img style={{height:400, width:"100%", borderRadius:5, objectFit:"cover"}} src={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"} alt='co-founder'/>
                        </div>
                        <div style={{marginTop:15, fontFamily:'Athelas-Bold', fontSize:24, letterSpacing:0.4}}>Sri Lakshmi</div>
                        <div style={{fontSize:16, opacity:0.7, lineHeight:"20px", letterSpacing:0.5}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
                    </Col>
                    <Col lg={4}>
                        <div>
                            <img style={{height:400, width:"100%", borderRadius:5, objectFit:"cover"}} src={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"} alt='co-founder'/>
                        </div>
                        <div style={{marginTop:15, fontFamily:'Athelas-Bold', fontSize:24, letterSpacing:0.4}}>Nivedita</div>
                        <div style={{fontSize:16, opacity:0.7, lineHeight:"20px", letterSpacing:0.5}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
                    </Col>
                </Row>
            </Container>
        )
    }
}
