import React, { useState } from 'react';
import { FiUser, FiSearch } from 'react-icons/fi';
import { BsArrowRight } from 'react-icons/bs';
import { HiOutlineLocationMarker } from 'react-icons/hi';

import globalStyles from '../../globalStyles';
import './uiComponents.css';

function List({type, image, title, icon, name}) {
    return <div style={{...globalStyles.flexRow, marginTop:12}}>
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

export function MobileSearchInput() {
    return <div style={{position:'relative', width:'100%'}}>
        <input
            style={{width:"100%"}}
            className="search-bar" 
            placeholder="Search for NFTs and artists" 
        />
        <FiSearch style={{opacity:0.8, position:'absolute', top:'24%', left:15}} size={20}/>
    </div>
}

export function Search() {

    const [show, setShow] = useState(false);

    return (
        <div style={{position:'relative', width:'100%'}}>
            <input
                onFocus={() => setShow(true)} 
                onBlur={() => setShow(false)}
                className="search-bar" 
                placeholder="Search for NFTs and artists" 
            />
            <FiSearch style={{opacity:0.8, position:'absolute', top:'24%', left:15}} size={20}/>
            { show ?
            <div className="search-dropdown">
                <div>
                    <div style={globalStyles.flexRowSpace}>
                        <div style={{fontFamily:"Athelas-bold", fontSize:22}}>NFTs</div>
                        <div style={{fontSize:11, letterSpacing:1.5}}>VIEW ALL (12) <span><BsArrowRight size={18} color="#fff"/></span></div>
                    </div>
                    <List
                        image="https://worlduniversityofdesign.ac.in/assets/images/bgs/school-of-visual-arts-banner.jpg"
                        title="Mughal Emperor"
                        icon={<FiUser size={17} color='#FFFFFF' style={{opacity:0.7}}/>}
                        name="Shrishti Saha"
                        type="nft"
                    />
                    <List
                        image="https://worlduniversityofdesign.ac.in/assets/images/bgs/school-of-visual-arts-banner.jpg"
                        title="Mughal Emperor"
                        icon={<FiUser size={17} color='#FFFFFF' style={{opacity:0.7}}/>}
                        name="Shrishti Saha"
                        type="nft"
                    />
                </div>
                <div style={{marginTop:20}}>
                    <div style={globalStyles.flexRowSpace}>
                        <div style={{fontFamily:"Athelas-bold", fontSize:22}}>Artists</div>
                        <div style={{fontSize:11, letterSpacing:1.5}}>VIEW ALL (12) <span><BsArrowRight size={18} color="#fff"/></span></div>
                    </div>
                    <List
                        image="https://www.worldatlas.com/r/w960-q80/upload/c1/dc/8b/babur.jpg"
                        title="Mughal Khan"
                        icon={<HiOutlineLocationMarker size={17} color='#FFFFFF' style={{opacity:0.7}}/>}
                        name="Bangalore, India"
                        type="artist"
                    />
                    <List
                        image="https://www.worldatlas.com/r/w960-q80/upload/c1/dc/8b/babur.jpg"
                        title="Mughal Khan"
                        icon={<HiOutlineLocationMarker size={17} color='#FFFFFF' style={{opacity:0.7}}/>}
                        name="Bangalore, India"
                        type="artist"
                    />
                </div>
            </div> :
            null }
        </div>
    )
}
