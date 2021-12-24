import React, { Component, Fragment } from 'react';
import { Col, Row, Container } from 'react-bootstrap';

import classes from './home.module.css';

export default class Home extends Component {
    render() {
        return (
            <Container style={{marginTop:110}}>
                <Row>
                    <Col lg={5} md={5} sm={12}>
                        <div>
                            <div className={classes.artSectionTitle}>
                                <h1 className={classes.artSectionContent}>
                                    An NFT marketplace fuelled by art communities from all over India
                                </h1>
                                <div class="glow-on-hover" type="button" style={{zIndex:100}}>
                                    <div style={{marginLeft:1}}>EXPLORE MARKETPLACE</div>
                                </div>
                            </div>
                        </div>
                        {/* overlay gradient  */}
                        <div className={classes.artworkGradientOverlay}/>
                    </Col>
                    <Col lg={7} md={7} sm={12}>
                    
                    </Col>
                </Row>
            </Container>
        )
    }
}
