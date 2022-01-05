import React, { Component, Fragment } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import AboutCard from '../../components/about/AboutCard';

import classes from './about.module.css';

export default class About extends Component {
    render() {
        return (
            <Container style={{marginTop:110}}>
                <div style={{fontFamily:'Athelas-Bold', fontSize:55, lineHeight:'55px', width:'60%' }}>
                    Lorem ipsum dolor sit amet, aliquam consectetur adipiscing elit. 
                </div>
                <div style={{opacity:0.7, fontSize:18, width:'67%', marginTop:20}}>
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a gallery
                </div>
                <div>
                    <div className={classes.sectionTitle}>
                        With Naksh, you can
                    </div>
                    <Row>
                        <Col lg={4}>
                            <AboutCard/>
                        </Col>
                        <Col lg={4}>
                            <AboutCard/>
                        </Col>
                        <Col lg={4}>
                            <AboutCard/>
                        </Col>
                    </Row>
                </div>
            </Container>
        )
    }
}
