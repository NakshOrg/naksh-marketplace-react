import React, { useState } from 'react';
import { MdOutlineBrokenImage } from 'react-icons/md';
import { HiOutlineLocationMarker } from 'react-icons/hi';

import classes from './explore.module.css';
import globalStyles from '../../globalStyles';


function ArtistCard(props) {

    const {
        place,
        name,
        image,
        artform,
        onClick
    } = props;

    const [isHovered, setIsHovered] = useState(false);

    return (
        <div onClick={onClick} onMouseOver={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className={classes.cardContainer}>
          <img 
            style={{border:"2px solid", borderColor: isHovered ? "#C56386" : "transparent"}} 
            className={classes.artistImage} 
            src={image} 
            alt='artist'
          />
          <div style={{marginTop:11, marginLeft:5}}>
                <div style={{fontFamily:"Athelas-Regular", fontSize:18}}>
                    {name}
                </div>
                <div style={{...globalStyles.flexRow, opacity:0.7, marginTop:6}}>
                    <HiOutlineLocationMarker size={22} color="#fff"/>
                    <div style={{fontSize:14, marginLeft:5}}>{place}</div>
                </div>
                <div style={{...globalStyles.flexRow, opacity:0.7, marginTop:6, marginBottom:5}}>
                    <MdOutlineBrokenImage size={22} color='#fff'/>
                    <div style={{fontSize:14, marginLeft:5}}>{artform}</div>
                </div>
          </div>
        </div>
    )
}

export default ArtistCard;
