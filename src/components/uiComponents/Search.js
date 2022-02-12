import React, { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { BsArrowRight } from 'react-icons/bs';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import uuid from 'react-uuid';

import globalStyles from '../../globalStyles';
import './uiComponents.css';


function List({type, image, title, icon, name, onClick}) {
    return <div onClick={onClick} style={{...globalStyles.flexRow, marginTop:12}}>
        <img style={{borderRadius: type == "artist" ? 100 : 10}} className='search-list-image' src={image} alt="search nft"/>
        <div style={{marginLeft:15}}>
            <div style={{fontFamily:"Athelas-regular", fontSize:18, opacity:0.98}}>{title}</div>
            <div>
                <span>{icon}</span>
                <span style={{fontFamily:"Athelas-regular", fontSize:14, marginLeft:5, opacity:0.7}}>{name}</span>
            </div>
        </div>
    </div>
}

export function MobileSearchInput({ value, onChange }) {
    return <div style={{position:'relative', width:"100%"}}>
        <input
            style={{width:"100%"}}
            onChange={onChange}
            value={value}
            className="search-bar" 
            placeholder="Search for artists" 
        />
        <FiSearch style={{opacity:0.8, position:'absolute', top:'24%', left:15}} size={20}/>
    </div>
}

export function Search({ keyword, onChange, loading, resetSearch, searchResults }) {

    const history = useHistory();
    const [show, setShow] = useState(false);

    return (
        <>
        {show && <div onClick={() => setShow(false)} style={{background:"black", opacity:0, height:"100vh", width:"100vw", position:"absolute", top:0, left:0, zIndex:0}}/>}
        <div style={{position:'relative', width:'100%'}}>
            <div>
                <input
                    style={{paddingRight:45}}
                    onFocus={() => setShow(true)} 
                    // onBlur={show}
                    onChange={onChange}
                    value={keyword}
                    className="search-bar search-bar-desktop" 
                    placeholder="Search for artists" 
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
                    style={{opacity: keyword ? 0.8 : 0, position:'absolute', top:'24%', right:55, cursor:"pointer"}} 
                    size={20}
                />}                
            </div>
            { show ?
            <div className="search-dropdown">
                {
                    keyword && searchResults.length === 0 && !loading 
                    ?
                    <div style={{fontFamily:"Athelas-bold", fontSize:20, textAlign:'center'}}>
                        {`Sorry! No results found for ${keyword}!`}
                    </div> :
                    searchResults.length !== 0 &&
                    <div style={{marginTop:20}}>
                        <div style={globalStyles.flexRowSpace}>
                            <div style={{fontFamily:"Athelas-bold", fontSize:22}}>Artists</div>
                            <div 
                            onClick={() => {
                                history.push('/searchresults/artists');
                                setShow(false);
                            }} 
                            style={{fontSize:11, letterSpacing:1.5, cursor:"pointer", zIndex:3}}>
                                VIEW ALL ({searchResults.length}) <span><BsArrowRight size={18} color="#fff"/></span>
                            </div>
                        </div>
                        {searchResults.slice(0,3).map(item => {
                            return <List
                                key={uuid()}
                                onClick={() => {
                                    setShow(false);
                                    history.push(`/ourartists/${item._id}`);
                                }}
                                image={item.image}
                                title={item.name}
                                icon={<HiOutlineLocationMarker size={17} color='#FFFFFF' style={{opacity:0.7}}/>}
                                name={item?.city}
                                type="artist"
                            />
                        })}
                </div>}
            </div> :
            null }
        </div>
        </>
    )
}
