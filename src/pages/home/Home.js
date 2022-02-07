import React from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import art1 from "../../assets/images/arts1.png";
import art2 from "../../assets/images/arts2.png";
import art3 from "../../assets/images/arts3.png";
import classes from './home.module.css';

export default function Home() {

    const navigate = useNavigate();

    return (
        <Container fluid style={{height:"100vh"}}>
            <Row>
                <Col style={{display:"flex"}} lg={5} md={5} sm={12}>
                    <div style={{alignSelf:"center", paddingLeft:75}}>
                        <div className={classes.artSectionTitle}>
                            <h1 className={classes.artSectionContent}>
                                An NFT marketplace fuelled by art communities from all over India
                            </h1>
                            <div onClick={() => navigate("/browse")} className="glow-on-hover" type="button" style={{zIndex:100}}>
                                <div style={{marginLeft:1}}>EXPLORE MARKETPLACE</div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.artworkGradientOverlay}/>
                </Col>
                <Col lg={7} md={7} sm={12}>
                    <div className={classes.artSectionCarouselDesktop}>
                        <div style={{overflow: "hidden"}} className={classes.img1}>
                            <img style={{width:"100%", height:"100vh"}} src={art1} alt="art1"/>
                        </div>
                        <div style={{overflow: "hidden"}} className={classes.img2}>
                            <img style={{width:"100%", height:"100vh"}} src={art2} alt="art2"/>
                        </div>
                        <div style={{overflow: "hidden"}} className={classes.img3}>
                            <img style={{width:"100%", height:"100vh"}} src={art3} alt="art3"/>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}
