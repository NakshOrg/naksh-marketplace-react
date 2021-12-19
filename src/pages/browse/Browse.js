import React, { Component, Fragment } from 'react';
import { Col, Row, Container } from 'react-bootstrap';

import NftCard from '../../components/explore/NftCard';
import classes from './browse.module.css';
import Filters from './Filters';

export default class Browse extends Component {
    render() {
        return (
            <Container>
                <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
                    <div className={classes.sectionTitle}>Explore NFTs </div>
                    <Filters/>
                </div>
                <div style={{background:"rgba(255,255,255,0.27)", height:1, marginBottom:10, marginTop:13}}/>
                <div style={{marginTop:55}}>
                    <Row>
                        <Col><NftCard/></Col>
                        <Col><NftCard/></Col>
                        <Col><NftCard/></Col>
                        <Col><NftCard/></Col>
                    </Row>
                    
                </div>
                {/* <Row>
                    <Col lg={5} md={5} sm={12}>, marginTop:13
                        <NftCard/>
                    </Col>
                </Row> */}
            </Container>
        )
    }
}
