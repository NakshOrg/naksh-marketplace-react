import React, { useEffect, useState } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { connect, useSelector } from 'react-redux';
import uuid from 'react-uuid';
import { BottomSheet } from 'react-spring-bottom-sheet';
import crossBtn from "../../assets/svgs/header-cross.svg";
import 'react-spring-bottom-sheet/dist/style.css';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router-dom';

import Footer from '../../components/uiComponents/Footer';
import NftCard from '../../components/explore/NftCard';
import ArtistCard from '../../components/explore/ArtistCard';
import Spinner from '../../components/uiComponents/Spinner';
import classes from './browse.module.css';
import Dropdown from '../../components/uiComponents/Dropdown';
import { staticValues } from '../../constants';
import NearHelperFunctions from '../../services/nearHelperFunctions';
import globalStyles from '../../globalStyles';


export default function Browse() {

    const walletInfo = useSelector(state => state.nearReducer.walletInfo);
    const history = useHistory();

    const [loading, setLoading] = useState(true);
    const [allNfts, setAllNfts] = useState([]);
    const [totalNfts, setTotalNfts] = useState([]);
    const [page, setPage] = useState(8);
    const [currentSort, setCurrentSort] = useState(staticValues.sortFilter[0].name);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if(walletInfo) {
            fetchNfts();
        }
    }, [walletInfo]);

    useEffect(() => {
        applyFilters();
    }, [currentSort]);

    useEffect(() => {
        const copiedArr = [...allNfts];
        const nextSetOfData = totalNfts.slice(page - 8, page);
        nextSetOfData.map(item => copiedArr.push(item));
        setAllNfts(copiedArr);
    }, [page]);

    const fetchNfts = () => {

        const functions = new NearHelperFunctions(walletInfo); 
        
        functions.getAllNfts()
        .then(res => {
            const result = res.sort(function(a, b) {
                return new Date(b.metadata.issued_at) - new Date(a.metadata.issued_at);
            });
            const totalNfts = result;
            const firstSetOfData = totalNfts.slice(0, page);
            setAllNfts(firstSetOfData);
            setTotalNfts(totalNfts);
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            alert("something went wrong!");
            setLoading(false);
        });

    }

    const applyFilters = (isMobile) => {
        
        const copiedFilterArr = [...totalNfts];
        let result, filteredNfts;

        if(currentSort === "Newest first") {
            copiedFilterArr.sort(function(a, b) {
                return new Date(b.metadata.issued_at) - new Date(a.metadata.issued_at);
            });
            filteredNfts = copiedFilterArr;
        } else if(currentSort === "Oldest first") {
            copiedFilterArr.sort(function(a, b) {
                return new Date(a.metadata.issued_at) - new Date(b.metadata.issued_at);
            });
            filteredNfts = copiedFilterArr;
        } else if(currentSort === "Price - High to low") {
            filteredNfts = copiedFilterArr.sort(function(a, b) {
                return b.price - a.price;
            });
        } else {
            filteredNfts = copiedFilterArr.sort(function(a, b) {
                return a.price - b.price;
            });
        }

        result = filteredNfts.slice(0, 8);

        if(isMobile) {
            setAllNfts(result);
            setOpen(false);
        } else {
            setAllNfts(result);
            setTotalNfts(filteredNfts);
        }
    }

    const resetFilters = () => {
        setCurrentSort(staticValues.sortFilter[0].name);
    }

    const handleMoreData = () => {

        setPage(page => page + 8);

    }

    const renderNfts = () => {

        return allNfts.map(nft => {
            return <Col key={uuid()} style={{marginBottom:25}} lg={3} md={4} sm={6} xs={12}>
                <NftCard
                    onClick={() => history.push(`/nftdetails/${nft.token_id}`)}
                    image={nft.metadata.media}
                    title={nft.metadata.title}
                    nearFee={nft.price}
                    artistName={nft?.artist?.name} 
                    artistImage={nft?.artist?.image}
                />
            </Col>
        });

    }

    if(loading) return <Spinner/>;

    return (
        <Container fluid className={classes.container}>
            <div className={classes.exploreGradientBlue}/>
            <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
                <div className={classes.sectionTitle}>Explore NFTs</div>
                <div className={classes.desktopHeaderSection} style={{display:'flex', justifyContent:'space-between', alignItems:'center', width:190}}>
                    <div style={{marginLeft:13}}/>
                    <Dropdown 
                        title={currentSort}
                        content={staticValues.sortFilter}
                        onChange={(val) => setCurrentSort(val.name)}
                    />
                </div>
            </div>
            <div className={classes.desktopHeaderSection} style={{background:"rgba(255,255,255,0.27)", height:1, marginBottom:10, marginTop:13}}/>
            <div className={classes.nftContainer}>
                <Row>
                    {renderNfts()}
                </Row>   
                <div style={{marginBottom:50}}/>
                <div className={classes.exploreGradientPink}/>
            </div>
            {allNfts.length !== totalNfts.length && 
            <div className={classes.viewMore} onClick={handleMoreData}>
                VIEW MORE
            </div>}
            <div onClick={() => setOpen(true)} className={classes.mobileFixedBtn}>
                FILTER
            </div>  
            <BottomSheet
                open={open}
                onDismiss={() => setOpen(false)}
                header={false}
                snapPoints={({ minHeight, maxHeight }) => [minHeight*1.8, maxHeight]}
            >
                <img 
                    onClick={() => setOpen(false)}
                    style={{height:30, width:30, position: "absolute", right: "20px", top: "15px"}} 
                    src={crossBtn} 
                    alt="cross"
                />
                <div style={{marginTop:35}}>
                    <div style={{fontFamily:"Athelas-Bold", fontSize:18}}>Sort by</div>
                    <div style={{background:"rgba(255,255,255,0.27)", height:1, marginBottom:10, marginTop:8}}/>
                    <div className={classes.pillsContainer}>
                        {staticValues.sortFilter.map(item => {
                            return <div
                                key={uuid()} 
                                onClick={() => setCurrentSort(item.name)}
                                className={`${classes.pill} ${currentSort === item.name ? classes.pillActive : ""}`}
                            >
                                {item.name}
                            </div>})
                        }
                    </div>
                </div>
                <div style={{...globalStyles.flexRowSpace, position: "absolute", width: "87%", bottom: "20px"}}>
                    <div className={classes.clearBtn} onClick={resetFilters}>
                        CLEAR FILTER
                    </div>  
                    <div className={classes.applyBtn} onClick={() => applyFilters(true)}>
                        APPLY FILTER
                    </div> 
                </div>
            </BottomSheet>   
            <Footer/>           
        </Container>
    )

}
