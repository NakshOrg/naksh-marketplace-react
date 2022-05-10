import React, { Fragment, useEffect, useState } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { motion } from "framer-motion";
import uuid from 'react-uuid';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

import NftCard from '../../components/explore/NftCard';
import ArtistCard from '../../components/explore/ArtistCard';
import classes from './search.module.css';
import globalStyles from '../../globalStyles';
import { MobileSearchInput, Search } from '../../components/uiComponents/Search';
import * as actionTypes from '../../redux/actions/actionTypes';
import { _getAllArtists } from '../../services/axios/api';

export default function SearchResults() {

    const params = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const userData = useSelector(state => state.nearReducer.userData);
    const searchResultsArtists = useSelector(state => state.dataReducer.searchResultsArtists);
    const searchResultsNfts = useSelector(state => state.dataReducer.searchResultsNfts);
    const loading = useSelector(state => state.dataReducer.headerSearchLoading);
    const searchKeyword = useSelector(state => state.dataReducer.searchKeyword);

    const [isNftActive, setIsNftActive] = useState(true);
    const [keyword, setkeyword] = useState("");

    useEffect(() => {
        if(params.keyword === "artists") {
            setIsNftActive(false);
        }
    }, []);

    useEffect(() => {
      
        if(keyword) {
            dispatch({type: actionTypes.HEADER_SEARCH_LOADING, payload: true});
            _getAllArtists({search: keyword, sortBy: 'createdAt', sort: -1, createdBy: 0})
            .then(({ data }) => {
                dispatch({type: actionTypes.SEARCH_RESULTS, payload: {artists: data.artists, searchKeyword:keyword}});
                dispatch({type: actionTypes.HEADER_SEARCH_LOADING, payload: false});
            })
            .catch(err => {
                dispatch({type: actionTypes.HEADER_SEARCH_LOADING, payload: false});
            })
        }

    }, [keyword]);

    function resetSearch() {
        setkeyword("");
        dispatch({type: actionTypes.SEARCH_RESULTS, payload: {artists: [], searchKeyword: ""}});
    }

    const renderTabs = () => {
        if(isNftActive) {
            if(searchResultsNfts.length === 0) {
                return <div style={{fontFamily:"Athes-Bold", fontSize:25, textAlign:"center", marginTop:55}}>
                    {`Sorry! No results found for ${searchKeyword}!`}
                </div>
            }
            return searchResultsNfts.map(item => {
                return <Fragment key={uuid()}>
                    <Col style={{marginBottom:20}} lg={3} md={4} sm={6} xs={12}>
                        <NftCard
                            onClick={() => history.push(`/nftdetails/${item.token_id}`)}
                            image={item.metadata.media}
                            title={item.metadata.title}
                            name={item?.artist?.name}
                            artistImage={item?.artist?.image}
                            type="nft"
                            nearFee={item?.price}
                        />
                    </Col>
                </Fragment> 
            });
        } else {
            if(searchResultsArtists.length === 0) {
                return <div style={{fontFamily:"Athes-Bold", fontSize:25, textAlign:"center"}}>
                    {`Sorry! No results found for ${searchKeyword}!`}
                </div>
            }
            return searchResultsArtists.map(artist => {
                return <Col key={uuid()} style={{marginBottom:70}} lg={3} md={4} sm={6} xs={12}>
                    <ArtistCard
                        onClick={() => history.push(`/ourartists/${artist._id}`)}
                        image={artist.image}
                        name={artist.name}
                        artform={artist?.artform?.name}
                        place={artist.state}
                    />
                </Col>
            });
        }
    }

    return (
        <Container fluid className={classes.container}>
            {/* overlay gradient  */}
            <div className={classes.searchGradientOverlay}/>
            <div className={classes.searchResultsTitle} style={{fontSize:36}}>
                <span style={{fontFamily:"Athelas-Regular", opacity:0.6}}>Search results for</span> 
                <span style={{fontFamily:"Athelas-Bold"}}>{" "} {searchKeyword}</span>
            </div>
            <div className={classes.mobileSearchInput}>
                <MobileSearchInput
                    keyword={keyword}
                    onChange={(e) => setkeyword(e.target.value)}
                    loading={loading}
                    resetSearch={resetSearch}
                    searchResultsArtists={searchResultsArtists}
                />
            </div>
            <div>
                <div style={{...globalStyles.flexRow, marginTop:20}}>
                    <div onClick={() => setIsNftActive(true)} style={{fontWeight: !isNftActive ? "400" : "bold", fontSize:12, cursor:'pointer', letterSpacing:1.5, marginRight:20}}>
                        NFTS
                    </div>
                    <div className={classes.artistsTab} onClick={() => setIsNftActive(false)} style={{fontWeight: isNftActive ? "400" : "bold", fontSize:12, marginLeft:0, cursor:'pointer', letterSpacing:1.5}}>
                        ARTISTS
                    </div>
                </div>
                {/* bottom indicator */}
                <motion.div 
                    animate={{ x: isNftActive ? 10 : 80 }}
                    transition={{ duration: 0.5 }}
                    style={{height:4, background:"#fff", width:11, borderRadius:100}}
                /> 
            </div>
            <Row style={{marginTop: isNftActive ? 25 : 80}}>
                {renderTabs()}
            </Row>
        </Container>
    )
}
