import React, { Component, Fragment } from 'react';
import { Col, Row, Container } from 'react-bootstrap';

import ArtistCard from '../../components/explore/ArtistCard';
import Filters from '../../pages/browse/Filters';
import globalStyles from '../../globalStyles';
import classes from './about.module.css';
import { OutlineBtn } from '../../components/uiComponents/Buttons';
import { Link } from 'react-router-dom';

export default function OurArtists() {
    return (
        <Container>
            <div className={classes.sectionCaption}>
                Explore our lineup of sensational artists from all across India
            </div>
            <div className={classes.sectionSubHeading}>
                Naksh has artists from different mediums, styles, age-groups and backgrounds - everybody is welcome.
            </div>
            <div style={{...globalStyles.flexRowSpace, marginTop:100}}>
                <div style={{margin:0}} className={classes.sectionTitle}>Our artists</div>
                <Filters/>
            </div>
            <div style={{background:"rgba(255,255,255,0.27)", height:1, marginBottom:80, marginTop:5}}/>
            <Row>
                <Col lg={3} md={3} sm={2} xs={1}>
                    <Link style={{color:"#fff"}} to="/artistDetails/dummy">
                        <ArtistCard
                            image={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
                            name={"Krithi K Mughal"}
                            about={"Mughal Painting"}
                            place={"Chennai"}
                        />
                    </Link>
                </Col>
                <Col lg={3} md={3} sm={2} xs={1}>
                    <ArtistCard
                        image={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
                        name={"Krithi K Mughal"}
                        about={"Mughal Painting"}
                        place={"Chennai"}
                    />
                </Col>
                <Col lg={3} md={3} sm={2} xs={1}>
                    <ArtistCard
                        image={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
                        name={"Krithi K Mughal"}
                        about={"Mughal Painting"}
                        place={"Chennai"}
                    />
                </Col>
                <Col lg={3} md={3} sm={2} xs={1}>
                    <ArtistCard
                        image={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
                        name={"Krithi K Mughal"}
                        about={"Mughal Painting"}
                        place={"Chennai"}
                    />
                </Col>
            </Row>  
            <OutlineBtn
                text="VIEW MORE"
                style={{margin:"20px auto", fontFamily:"Athelas-Regular", borderRadius:2, fontSize:12, letterSpacing:"1px", textAlign:'center'}}
            />
        </Container>
    )
}
