import React, { useState } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { motion } from "framer-motion";

import NftCard from '../../components/explore/NftCard';
import ArtistCard from '../../components/explore/ArtistCard';
import classes from './search.module.css';
import globalStyles from '../../globalStyles';

export default function SearchResults() {

    const [isNftActive, setIsNftActive] = useState(true);

    const renderTabs = () => {
        if(isNftActive) {
            return <>
                <Col lg={4} md={3} sm={2} xs={1}>
                    <NftCard
                        image={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
                        title={"Tanjore Painting"}
                        nearFee={"31000Ⓝ"}
                        price={"$121,000,000"}
                        artistName={"Sharmila S"}
                        artistImage={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
                    />
                </Col>
            </> 
        } else {
            return <>
                <Col lg={4} md={3} sm={2} xs={1}>
                    <ArtistCard
                        image={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
                        name={"Krithi K Mughal"}
                        about={"Mughal Painting"}
                        place={"Chennai"}
                    />
                </Col>
            </>  
        }
    }

    return (
        <Container>
            {/* overlay gradient  */}
            <div className={classes.searchGradientOverlay}/>
            <div style={{fontSize:36}}>
                <span style={{fontFamily:"Athelas-Regular", opacity:0.6}}>Search results for</span> 
                <span style={{fontFamily:"Athelas-Bold"}}>{" "} Mughal</span>
            </div>
            <div>
                <div style={{...globalStyles.flexRow, marginTop:20}}>
                    <div onClick={() => setIsNftActive(true)} style={{fontWeight: !isNftActive ? "400" : "bold", fontSize:12, cursor:'pointer', letterSpacing:1.5}}>
                        NFTS
                    </div>
                    <div onClick={() => setIsNftActive(false)} style={{fontWeight: isNftActive ? "400" : "bold", fontSize:12, marginLeft:30, cursor:'pointer', letterSpacing:1.5}}>
                        ARTISTS
                    </div>
                </div>
                {/* bottom indicator */}
                <motion.div 
                    animate={{ x: isNftActive ? 10 : 90 }}
                    transition={{ duration: 0.5 }}
                    style={{height:4, background:"#fff", width:11, borderRadius:100}}
                /> 
            </div>
            <Row style={{marginTop: isNftActive ? 25 : 65}}>
                {renderTabs()}
            </Row>
        </Container>
    )
}
