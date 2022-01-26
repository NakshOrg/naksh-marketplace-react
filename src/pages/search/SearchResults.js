import React, { Fragment, useState } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { motion } from "framer-motion";
import { FiSearch } from 'react-icons/fi';
import uuid from 'react-uuid';

import NftCard from '../../components/explore/NftCard';
import ArtistCard from '../../components/explore/ArtistCard';
import classes from './search.module.css';
import globalStyles from '../../globalStyles';
import Search, { MobileSearchInput } from '../../components/uiComponents/Search';

export default function SearchResults() {

    const [isNftActive, setIsNftActive] = useState(true);
    const dummyArr = new Array(5).fill("");

    const renderTabs = () => {
        if(isNftActive) {
            return dummyArr.map(item => {
                return <Fragment key={uuid()}>
                    <Col style={{marginBottom:20}} lg={3} md={4} sm={6} xs={12}>
                        <NftCard
                            image={"https://watcher.guru/news/wp-content/uploads/2021/08/Alien-1002.png.webp"}
                            title={"Tanjore Painting"}
                            nearFee={"31000Ⓝ"}
                            price={"$121,000,000"}
                            artistName={"Sharmila S"}
                            artistImage={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
                        />
                    </Col>
                </Fragment> 
            });
        } else {
            return dummyArr.map(item => {
                return <Fragment key={uuid()}>
                    <Col style={{marginBottom:20}} lg={3} md={4} sm={6} xs={12}>
                        <ArtistCard
                            image={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
                            name={"Krithi K Mughal"}
                            about={"Mughal Painting"}
                            place={"Chennai"}
                        />
                    </Col>
                </Fragment> 
            });
        }
    }

    return (
        <Container style={{marginTop:110}}>
            {/* overlay gradient  */}
            <div className={classes.searchGradientOverlay}/>
            <div className={classes.searchResultsTitle} style={{fontSize:36}}>
                <span style={{fontFamily:"Athelas-Regular", opacity:0.6}}>Search results for</span> 
                <span style={{fontFamily:"Athelas-Bold"}}>{" "} Mughal</span>
            </div>
            <div className={classes.mobileSearchInput}>
                <MobileSearchInput/>
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
