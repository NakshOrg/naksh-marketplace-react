import React from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import SwipingCarousel from '../../components/uiComponents/SwipingCarousel';
import classes from './home.module.css';
import DesktopCarousel from '../../components/uiComponents/DesktopCarousel';


export default function Home() {

    const history = useHistory();

    return (
        <Container fluid style={{height:"100vh"}}>
            <Row>
                <Col style={{display:"flex"}} lg={5} md={5} sm={12}>
                    <div className={classes.artSectionContentContainer}>
                        <div className={classes.artSectionTitle}>
                            <h1 className={classes.artSectionContent}>
                                An NFT marketplace fuelled by art communities from all over India
                            </h1>
                            <div id={classes.btnContainer} onClick={() => history.push("/browse")} className="glow-on-hover" type="button" style={{zIndex:100}}>
                                <div className={classes.glowBtnText} style={{marginLeft:1}}>EXPLORE MARKETPLACE</div>
                            </div>
                        </div>
                        <div className={classes.artworkGradientOverlay}/>
                    </div>
                </Col>
                <Col style={{padding:0}} lg={7} md={7} sm={12}>
                    <div className={classes.artSectionCarouselDesktop}>
                        <DesktopCarousel/>
                    </div>
                    <div className={classes.artSectionCarouselMobile}> 
                        <SwipingCarousel/>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}
