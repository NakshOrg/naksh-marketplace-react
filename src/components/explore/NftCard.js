import React from 'react';

import nft from '../../assets/images/krishna.png';
import classes from './explore.module.css';

function NftCard({ }) {
    return (
        <div className={classes.cardContainer}>
            <div>
                <img src={nft} alt="nft"/>
            </div>
        </div>
    )
}

export default NftCard;
