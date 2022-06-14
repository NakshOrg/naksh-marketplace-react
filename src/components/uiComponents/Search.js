import React, { useEffect, useState } from 'react';
import { FiSearch, FiUser, FiX } from 'react-icons/fi';
import { BsArrowRight } from 'react-icons/bs';
import { HiOutlineLocationMarker, HiUser } from 'react-icons/hi';
import { Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import uuid from 'react-uuid';

import globalStyles from '../../globalStyles';
import './uiComponents.css';
import { useSelector } from 'react-redux';


function List({type, image, title, icon, name, onClick}) {
    return <div onClick={onClick} style={{...globalStyles.flexRow, marginTop:12, cursor:"pointer"}}>
        <img style={{borderRadius: type == "artist" ? 100 : 10}} className='search-list-image' src={image} alt="search nft"/>
        <div style={{marginLeft:15}}>
            <div className="search-title" style={{fontFamily:"Athelas-regular", fontSize:18, opacity:0.98}}>{title}</div>
            <div>
                <span>{icon}</span>
                <span className="search-name" style={{fontFamily:"Athelas-regular", fontSize:14, marginLeft:5, opacity:0.7}}>{name}</span>
            </div>
        </div>
    </div>
}

function SearchHeader({ onClick, noOfItems, title }) {
    return <div style={globalStyles.flexRowSpace}>
        <div style={{fontFamily:"Athelas-bold", fontSize:22}}>{title}</div>
        <div 
            onClick={onClick} 
            style={{fontSize:11, letterSpacing:1.5, cursor:"pointer", zIndex:3}}
        >
            VIEW ALL ({noOfItems}) <span><BsArrowRight size={18} color="#fff"/></span>
        </div>
    </div>
}

export function MobileSearchInput({ keyword, onChange, loading, resetSearch, searchResultsArtists, searchResultsNfts, closeHeader }) {

    const history = useHistory();
    const nfts = useSelector(state => state.dataReducer.allNfts);

    const [show, setShow] = useState(false);

    return (
        <>
        {show && <div onClick={() => setShow(false)} style={{background:"black", opacity:0, height:"100%", width:"100%", position:"absolute", top:0, left:0, zIndex:1}}/>}
        <div>
            <div style={{position:"relative"}}>
                <input
                    onFocus={() => setShow(true)} 
                    // onBlur={show}
                    onChange={onChange}
                    value={keyword}
                    className="search-bar" 
                    style={{width:"100%"}}
                    placeholder="Search for NFTs and artists" 
                />
                <FiSearch className='search-icon-desktop' style={{opacity:0.8, position:'absolute', top:"24%", left:15}} size={20}/>
                {loading ?
                <Spinner 
                    animation="border" 
                    color="#fff" 
                    style={{
                        opacity:0.8, 
                        position:'absolute', 
                        top:'24%', 
                        right:20, 
                        cursor:"pointer",
                        height:20,
                        width:20,
                        borderWidth:2
                    }}
                /> :
                <FiX 
                    onClick={() => {
                        resetSearch();
                        setShow(false);
                    }} 
                    style={{opacity: keyword ? 0.8 : 0, position:'absolute', top:'24%', right:20, cursor:"pointer"}} 
                    size={20}
                />}                
            </div>
            { show ?
            <div className="search-dropdown">
                {
                    keyword && searchResultsArtists.length === 0 && searchResultsNfts.length === 0 && !loading 
                    ?
                    <div style={{fontFamily:"Athelas-bold", fontSize:20, textAlign:'center'}}>
                        {`Sorry! No results found for ${keyword}!`}
                    </div> :
                    <div>
                        <>
                            {searchResultsNfts.length !== 0 &&
                            <div style={{marginTop:20}}>
                                <SearchHeader
                                    onClick={() => {
                                        history.push('/searchresults/nfts');
                                        setShow(false);
                                        closeHeader();
                                    }}
                                    title="NFTs"
                                    noOfItems={searchResultsNfts.length}
                                />
                                {searchResultsNfts.slice(0,3).map(item => {
                                    return <List
                                        key={uuid()}
                                        onClick={() => {
                                            setShow(false);
                                            closeHeader();
                                            history.push(`/nftdetails/${item.token_id}`);
                                        }}
                                        image={item.metadata.media}
                                        title={item.metadata.title}
                                        icon={<FiUser size={17} color='#FFFFFF' style={{opacity:0.7}}/>}
                                        name={item?.artist?.name}
                                        type="nft"
                                    />
                                })}
                            </div>}
                        </>
                        <>
                            {searchResultsArtists.length !== 0 &&
                                <div style={{marginTop:20}}>
                                    <SearchHeader
                                        onClick={() => {
                                            history.push('/searchresults/artists');
                                            setShow(false);
                                            closeHeader();
                                        }}
                                        title="Artists"
                                        noOfItems={searchResultsArtists.length}
                                    />
                                    {searchResultsArtists.slice(0,3).map(item => {
                                        return <List
                                            key={uuid()}
                                            onClick={() => {
                                                setShow(false);
                                                closeHeader();
                                                history.push(`/ourartists/${item._id}`);
                                            }}
                                            image={item.image}
                                            title={item.name}
                                            icon={<HiOutlineLocationMarker size={17} color='#FFFFFF' style={{opacity:0.7}}/>}
                                            name={item?.state}
                                            type="artist"
                                        />
                                    })}
                                </div>
                            }
                        </>
                    </div>
                }
            </div> : null}
        </div>
        </>
    )
}

export function Search({ keyword, onChange, loading, resetSearch, searchResultsArtists, searchResultsNfts }) {

    const history = useHistory();

    const [show, setShow] = useState(false);

    return (
        <>
        {show && <div onClick={() => setShow(false)} style={{background:"black", opacity:0, height:"100vh", width:"100vw", position:"absolute", top:0, left:0, zIndex:1}}/>}
        <div style={{position:'relative', width:'100%'}}>
            <div>
                <input
                    style={{paddingRight:45}}
                    onFocus={() => setShow(true)} 
                    onChange={onChange}
                    value={keyword}
                    className="search-bar search-bar-desktop" 
                    placeholder="Search for NFTs and artists" 
                />
                <FiSearch className='search-icon-desktop' style={{opacity:0.8, position:'absolute', top:"24%", left:15}} size={20}/>
                {loading ?
                <Spinner 
                    animation="border" 
                    color="#fff" 
                    style={{
                        opacity:0.8, 
                        position:'absolute', 
                        top:'24%', 
                        right:55, 
                        cursor:"pointer",
                        height:20,
                        width:20,
                        borderWidth:2
                    }}
                /> :
                <FiX 
                    onClick={() => {
                        resetSearch();
                        setShow(false);
                    }} 
                    style={{opacity: keyword ? 0.8 : 0, position:'absolute', top:'24%', right: '13%', cursor:"pointer"}} 
                    size={20}
                />}                
            </div>
            { show ?
            <div className="search-dropdown">
                {
                    keyword && searchResultsArtists.length === 0 && searchResultsNfts.length === 0 && !loading 
                    ?
                    <div style={{fontFamily:"Athelas-bold", fontSize:20, textAlign:'center'}}>
                        {`Sorry! No results found for ${keyword}!`}
                    </div> :
                    <div>
                        <>
                            {searchResultsNfts.length !== 0 &&
                            <div style={{marginTop:20}}>
                                <SearchHeader
                                    onClick={() => {
                                        history.push('/searchresults/nfts');
                                        setShow(false);
                                    }}
                                    title="NFTs"
                                    noOfItems={searchResultsNfts.length}
                                />
                                {searchResultsNfts.slice(0,3).map(item => {
                                    return <List
                                        key={uuid()}
                                        onClick={() => {
                                            setShow(false);
                                            history.push(`/nftdetails/${item.token_id}`);
                                        }}
                                        image={item.metadata.media}
                                        title={item.metadata.title}
                                        icon={<FiUser size={17} color='#FFFFFF' style={{opacity:0.7}}/>}
                                        name={item?.artist?.name}
                                        type="nft"
                                    />
                                })}
                            </div>}
                        </>
                        <>
                            {searchResultsArtists.length !== 0 &&
                                <div style={{marginTop:20}}>
                                    <SearchHeader
                                        onClick={() => {
                                            history.push('/searchresults/artists');
                                            setShow(false);
                                        }}
                                        title="Artists"
                                        noOfItems={searchResultsArtists.length}
                                    />
                                    {searchResultsArtists.slice(0,3).map(item => {
                                        return <List
                                            key={uuid()}
                                            onClick={() => {
                                                setShow(false);
                                                history.push(`/ourartists/${item._id}`);
                                            }}
                                            image={item.image}
                                            title={item.name}
                                            icon={<HiOutlineLocationMarker size={17} color='#FFFFFF' style={{opacity:0.7}}/>}
                                            name={item?.state}
                                            type="artist"
                                        />
                                    })}
                                </div>
                            }
                        </>
                    </div>
                }
                </div> :
                null }
            </div>
        </>
    )
}
