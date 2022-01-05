import React from 'react';

import classes from './about.module.css';

export default function AboutCard() {
    return (
        // <div className={classes.weOfferCardContainer}>
            <div className={classes.weOfferCardWrapper}>
            {/* <div className={classes.weOfferCardWrapperBlack}></div> */}
                <div className={classes.weOfferCardItem}>
                    <div className={classes.weOfferCardHoverItemContent}>
                        <div className={classes.weOfferCardTitle}>Support</div>
                        <div className={classes.weOfferCardDescription}>Purchase artworks created by vernacular and digital artists across India</div>
                    </div>
                </div>
            </div>
        // </div>
    )
}
