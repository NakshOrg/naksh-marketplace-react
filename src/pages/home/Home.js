import React, { useEffect } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import NearHelperFunctions from '../../services/nearHelperFunctions';
import * as actionTypes from '../../redux/actions/actionTypes';
import SwipingCarousel from '../../components/uiComponents/SwipingCarousel';
import DesktopCarousel from '../../components/uiComponents/DesktopCarousel';
import classes from './home.module.css';
import Footer from '../../components/uiComponents/Footer';


export default function Home() {

    const walletInfo = useSelector(state => state.nearReducer.walletInfo);
    const dispatch = useDispatch();
    const history = useHistory();

    const variants = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
    }

    useEffect(() => {

        if(walletInfo) {
            getAllNfts();
        }

    }, [walletInfo]);

    function getAllNfts() {
        const functions = new NearHelperFunctions(walletInfo); 

        functions.getAllNfts()
        .then(res => {
            console.log(res, "res");
            dispatch({type:actionTypes.ALL_NFTS, payload:res});
        })
        .catch(err => {
            console.log(err);
        });
    }

    return (
        // <div style={{marginTop:100}}>
        //     <DesktopCarousel/>
        // </div>
        <Container fluid style={{height:"100vh"}}>
            <Row>
                <Col style={{display:"flex"}} lg={5} md={5} sm={12}>
                    <div className={classes.artSectionContentContainer}>
                        <div className={classes.artSectionTitle}>
                            <h1 className={classes.artSectionContent}>
                                An NFT marketplace fuelled by art communities from all over India
                            </h1>
                            <div id={classes.btnContainer} onClick={() => history.push("/browse")} className="glow-on-hover" style={{zIndex:100}}>
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
                    <div style={{marginTop:60}} className={classes.artSectionCarouselMobile}> 
                        <SwipingCarousel/>
                    </div>
                </Col>
            </Row>
            <Row style={{padding:"0 6%"}}>
                <Col>
                    <Footer/>
                </Col>
            </Row>
        </Container>
    )
}
