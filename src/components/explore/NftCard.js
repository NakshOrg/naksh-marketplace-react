import React from 'react';

import nft from '../../assets/images/krishna.png';
import classes from './explore.module.css';
import globalStyles from '../../globalStyles';

function NftCard({ }) {

    return (
        <div className={classes.cardContainer}>
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80" alt="nft"/>
            <div className={classes.cardTag}>
                <div style={globalStyles.flexRowSpace}>
                    <div style={{fontFamily:"Athelas-Bold", fontSize:14}}>Tanjore Painting</div>
                    <div style={{fontSize:12, fontWeight:"bold"}}>31000Ⓝ</div>
                </div>
                <div style={{...globalStyles.flexRowSpace, marginTop:5}}>
                    <div style={globalStyles.flexRowSpace}>
                        <img style={{height:20, width:20, borderRadius:20}} src={nft} alt='artist'/>
                        <div style={{fontSize:11, opacity:0.67, marginLeft:5}}>Sharmila S</div>
                    </div>
                    <div style={{fontSize:11, opacity:0.67}}>$121,000,000</div>
                </div>
            </div>
        </div>
    )
}

export default NftCard;
