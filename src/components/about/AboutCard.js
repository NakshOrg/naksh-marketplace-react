import React from 'react';

import classes from './about.module.css';

export default function AboutCard({ title, content }) {
    return (
        // <div className={classes.weOfferCardContainer}>
            <div className={classes.weOfferCardWrapper}>
            {/* <div className={classes.weOfferCardWrapperBlack}></div> */}
                {/* <div className={classes.weOfferCardItem}> */}
                    <div className={classes.weOfferCardHoverItemContent}>
                        <div className={classes.weOfferCardTitle}>{title}</div>
                        <div className={classes.weOfferCardDescription}>{content}</div>
                    </div>
                {/* </div> */}
            </div>
        // </div>
    )
}
