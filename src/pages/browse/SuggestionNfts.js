import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import Slider from "react-slick";
import uuid from 'react-uuid';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import Tabs from '../../components/uiComponents/Tabs';
import classes from './browse.module.css';
import nearLogo from '../../assets/svgs/near-logo.svg';
import globalStyles from '../../globalStyles';


const arrowStyle = {
    top: "130px",
    right: 20,
    position: "absolute",
    zIndex: 1,
    background:"rgba(0, 5, 19, 0.7)",
    padding: "10px",
    borderRadius: "30px",
    width: "45px",
    cursor: "pointer"
}

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
};

function NextArrow({ onClick }) {
    return <div style={arrowStyle} onClick={onClick}>
        <FiChevronRight color='#fff' size={25}/>
    </div>
}

function PrevArrow({ onClick }) {
    return <div style={{...arrowStyle, left:20}} onClick={onClick}>
        <FiChevronLeft color='#fff' size={25}/>
    </div>
}

function SuggestionNfts({ allNfts }) {

    const history = useHistory();
    const tabContents = [
        {tabName: "RECENTLY ADDED", x:100, }, // x is a hard coded value for animating bottom bar
        {tabName: "TRENDING NftS", x:240, },
        {tabName: "TOP-SELLING ARTISTS", x:400, }
    ];

    function NftCard(props) {

        const { image, title, nearFee, price, artistName, artistImage, onClick } = props;

        return <div style={{zIndex:2, height:300}} onClick={onClick} className={classes.cardContainer}>
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
                </div>
            </div>
        </div>
    }

    return (
        <div style={{marginTop:70}}>
            <Tabs 
                tabContents={tabContents} 
            />
            {
                allNfts.length !== 0 &&
                <div style={{marginTop:20}}>
                    <Slider {...settings}>
                        {
                            allNfts.map(item => {
                                return <div key={uuid()}>
                                    <NftCard
                                        onClick={() => history.push(`/nftdetails/${item.token_id}`)}
                                        image={item?.metadata?.extra?.nftThumbnailUrl ?? item.metadata.media}
                                        title={item.metadata.title}
                                        nearFee={item.price}
                                        artistName={item?.artist?.name} 
                                        artistImage={item?.artist?.image}
                                    />
                                </div>
                            })
                        }
                    </Slider>
                </div>
            }
       </div>
    );
}

export default SuggestionNfts;