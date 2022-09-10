import React from 'react';
import { motion } from 'framer-motion';

import nearLogo from '../../assets/svgs/near-logo.svg';
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
        <div
            style={{zIndex:2}} onClick={onClick} className={classes.cardContainer}
            // whileHover={{ scale: 1.1 }}
            // whileTap={{ scale: 0.9 }}
        >
            {/* <LazyLoadImage
                alt={"image"}
                src={image}
                // height={image.height}
                // width={image.width} 
            /> */}
            <img src={image} alt="nft"/>
            <div className={classes.cardTag}>
                <div style={globalStyles.flexRowSpace}>
                    <div style={{fontFamily:"Athelas-Bold", fontSize:14, textTransform:"capitalize", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{title}</div>
                    <div style={{fontSize:12, fontWeight:"bold", overflow: "hidden", textOverflow: "ellipsis", width: "50px"}}>
                        {nearFee} <img src={nearLogo} alt="nearlogo"/>
                    </div>
                </div>
                <div style={{...globalStyles.flexRowSpace, marginTop:5}}>
                    <div style={globalStyles.flexRowSpace}>
                        <img style={{height:20, width:20, borderRadius:20, objectFit:"cover"}} src={artistImage} alt='artist'/>
                        <div style={{fontSize:11, opacity:0.67, marginLeft:5, textTransform:"capitalize", color:"#fff"}}>{artistName}</div>
                    </div>
                    {/* <div style={{fontSize:11, opacity:0.67}}>{price}</div> */}
                </div>
            </div>
        </div>
    )
}

export default NftCard;
