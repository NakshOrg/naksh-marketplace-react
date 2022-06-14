import React, { useEffect, useState } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { useSelector } from "react-redux";
import { _getLandingPageData } from '../../services/axios/api';

import Carousel from './Carousel';
import connectNear from '../../assets/svgs/connect-near-gradient.svg';
import visitNear from '../../assets/svgs/visitNear.svg';
import classes from './about.module.css';
import configs from '../../configs';
import { helpers } from '../../constants';
import Footer from '../../components/uiComponents/Footer';


export default function NearProtocol() {

    const walletInfo = useSelector(state => state.nearReducer.walletInfo);
    const isWalletSignedIn = useSelector(state => state.nearReducer.isWalletSignedIn);

    const [loading, setLoading] = useState(true);
    const [slideData, setSlideData] = useState(null);

    useEffect(() => {
        _getLandingPageData()
        .then(res => res.json())
        .then(res => {
            console.log(res);
            setSlideData(res);
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
        });
    }, [])

    function walletSignIn() {
        if(walletInfo) {
            walletInfo.requestSignIn({
                successUrl: configs.appUrl,
                failureUrl: `${configs.appUrl}/404`
            });
        }
    };

    return (
        <Container fluid className={classes.nearContainer}>
            <div className={classes.nearGradientOverlay}/>
            <div className={classes.nearGradientOverlayPink}/>
            <Row>
                <Col className={classes.nearCol1} lg={4}>
                    <div className={classes.nearCol1Title} style={{fontFamily:'Athelas-Bold', fontSize:42}}>Why NEAR?</div>
                    <div className={classes.nearCol1Desc} style={{fontSize:18, letterSpacing:0.5}}>At Naksh, we believe in not only talking the talk but also walking the walk. Our effort in creating a conscious marketplace led to the decision of working with the NEAR ecosystem.</div>
                    <div 
                        onClick={() => isWalletSignedIn ? helpers.openInNewTab(configs.nearWebsite) : walletSignIn()}
                        className={classes.nearBtn}
                    >
                        <img src={isWalletSignedIn ? visitNear : connectNear} alt="near"/>
                    </div>
                </Col>
                <Col lg={8}>
                    <Carousel slideData={slideData} loading={loading}/>    
                </Col>
            </Row>
            {/* <Footer/> */}
        </Container>
    )
}
