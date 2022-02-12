import React from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import SwipingCarousel from '../../components/uiComponents/SwipingCarousel';
import classes from './home.module.css';
import DesktopCarousel from '../../components/uiComponents/DesktopCarousel';
import { motion } from 'framer-motion';


export default function Home() {

    const history = useHistory();

    const variants = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
    }

    return (
        <Container fluid style={{height:"100vh"}}>
            <Row style={{height:"100vh"}}>
                <Col style={{display:"flex"}} lg={5} md={5} sm={12}>
                    <motion.div 
                        className={classes.artSectionContentContainer}
                        initial="hidden"
                        animate="visible"
                        variants={variants}
                        transition={ {duration: 1} }
                    >
                        <div className={classes.artSectionTitle}>
                            <h1 className={classes.artSectionContent}>
                                An NFT marketplace fuelled by art communities from all over India
                            </h1>
                            <div id={classes.btnContainer} onClick={() => history.push("/browse")} className="glow-on-hover" type="button" style={{zIndex:100}}>
                                <div className={classes.glowBtnText} style={{marginLeft:1}}>EXPLORE MARKETPLACE</div>
                            </div>
                        </div>
                        <div className={classes.artworkGradientOverlay}/>
                    </motion.div>
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
