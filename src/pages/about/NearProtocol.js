import React, { Component, Fragment, useEffect, useState } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { useSelector } from "react-redux";
import { _getLandingPageData } from '../../services/axios/api';

import Carousel from './Carousel';
import AboutCard from '../../components/about/AboutCard';
import connectNear from '../../assets/svgs/connect-near-gradient.svg';
import classes from './about.module.css';
import configs from '../../configs';


export default function NearProtocol() {

    const walletInfo = useSelector(state => state.nearReducer.walletInfo);
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
        <Container style={{marginTop:160}} fluid>
            <Row>
                <Col style={{paddingLeft:120}} lg={5}>
                    <div style={{fontFamily:'Athelas-Bold', fontSize:42}}>Why NEAR?</div>
                    <div style={{fontSize:16, letterSpacing:0.5}}>At Naksh, we believe in not only talking the talk but also walking the walk. Our effort in creating a conscious marketplace led to the decision of working with the NEAR ecosystem.</div>
                    <div 
                        onClick={walletSignIn}
                        className={classes.nearBtn}
                    >
                        <img src={connectNear} alt="near"/>
                    </div>
                </Col>
                <Col lg={7}>
                    <Carousel slideData={slideData} loading={loading}/>    
                </Col>
            </Row>
        </Container>
    )
}
