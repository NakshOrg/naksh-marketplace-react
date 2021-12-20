import React, { Component, Fragment } from 'react';
import { Col, Row, Container } from 'react-bootstrap';

import NftCard from '../../components/explore/NftCard';
import ArtistCard from '../../components/explore/ArtistCard';
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
                        <Col lg={4} md={3} sm={2} xs={1}>
                            <NftCard
                                onClick={() => this.props.navigate("/nftdetails/:id")}
                                image={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
                                title={"Tanjore Painting"}
                                nearFee={"31000Ⓝ"}
                                price={"$121,000,000"}
                                artistName={"Sharmila S"}
                                artistImage={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
                            />
                            {/* <ArtistCard
                                onClick={}
                                image={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
                                name={"Krithi K Mughal"}
                                about={"Mughal Painting"}
                                place={"Chennai"}
                            /> */}
                        </Col>
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
