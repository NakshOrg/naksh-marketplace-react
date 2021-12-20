import React from 'react';

import classes from './explore.module.css';
import globalStyles from '../../globalStyles';

function NftCard(props) {

    const {
        image,
        title,
        nearFee,
        price,
        artistName,
        artistImage,
        onClick
    } = props;

    return (
        <div onClick={onClick} className={classes.cardContainer}>
            <img src={image} alt="nft"/>
            <div className={classes.cardTag}>
                <div style={globalStyles.flexRowSpace}>
                    <div style={{fontFamily:"Athelas-Bold", fontSize:14}}>{title}</div>
                    <div style={{fontSize:12, fontWeight:"bold"}}>{nearFee}</div>
                </div>
                <div style={{...globalStyles.flexRowSpace, marginTop:5}}>
                    <div style={globalStyles.flexRowSpace}>
                        <img style={{height:20, width:20, borderRadius:20}} src={artistImage} alt='artist'/>
                        <div style={{fontSize:11, opacity:0.67, marginLeft:5}}>{artistName}</div>
                    </div>
                    <div style={{fontSize:11, opacity:0.67}}>{price}</div>
                </div>
            </div>
        </div>
    )
}

export default NftCard;
