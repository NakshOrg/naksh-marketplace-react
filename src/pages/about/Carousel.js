import { useState, useRef } from "react";
import Slider from "react-slick";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

import classes from '../../pages/about/about.module.css';
import { Spinner } from "react-bootstrap";
import "../../App.css";

function CarouselBtns({leftBtn, rightBtn}) {
    return <div className="carousel-btns">
        <span onClick={leftBtn} id="prev" style={{marginRight:25, cursor:"pointer"}}>
        <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24.5" cy="24.5" r="23.5" stroke="url(#paint0_linear_2:778)" stroke-width="2"/>
            <path d="M26 31L20 25L26 19" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
            <linearGradient id="paint0_linear_2:778" x1="-1.59089e-06" y1="-5.10415" x2="56.9024" y2="-0.29122" gradientUnits="userSpaceOnUse">
            <stop stop-color="#0085FF"/>
            <stop offset="1" stop-color="#FF5963"/>
            </linearGradient>
            </defs>
        </svg> 
        </span>
        <span onClick={rightBtn} style={{cursor:"pointer"}} id="next">
        <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle r="23.5" transform="matrix(-1 0 0 1 24.5 24.5)" stroke="url(#paint0_linear_2:775)" stroke-width="2"/>
            <path d="M22 31L28 25L22 19" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
            <linearGradient id="paint0_linear_2:775" x1="-1.59089e-06" y1="-5.10415" x2="56.9024" y2="-0.29122" gradientUnits="userSpaceOnUse">
            <stop stop-color="#0085FF"/>
            <stop offset="1" stop-color="#FF5963"/>
            </linearGradient>
            </defs>
        </svg> 
        </span>
    </div>
}

function CarouselItem({stats, content, loading}) {
    return <div className="carousel-slide-item-wrapper">
        <div className="carousel-slide-item-wrapper-black"></div>
        <div className="carousel-slide-item">
            <div className="carousel-slide-item-content">
                <div className="carousel-slide-item-content-stats">
                    {loading ? <Spinner style={{borderWidth:5}} animation="border" size={20}/> : stats}
                </div>
                <div className="carousel-slide-item-content-caption">{content}</div>
            </div>
        </div>
    </div>  
  }

export default function Carousel({ loading, slideData }) {

  const slick = useRef(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselData = [
    {stats:`${slideData?.dailyActiveAccounts}+`, content:"People Are Already On NEAR"},
    {stats:`${slideData?.dailyTransactionsCount}+`, content:"Transactions Were Powered By NEAR Token Today"},
    {stats:"4B+", content:"Daily Gas Used"},
    {stats:`${slideData?.dailyNewAccountsCount}+`, content:"Users Have Joined NEAR Today"}
  ];
 
  const settings = {
    infinite: true,
    lazyLoad: true,
    speed: 1000,
    slidesToShow: 3,
    centerMode: true,
    centerPadding: 0,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    responsive: [
        {
          breakpoint: 801,
          settings: {
            swipe: true
          }
        }
    ],
    swipe: false,
    beforeChange: (_, next) => setCarouselIndex(next)
  };

  return (
    <div className={classes.carouselContainer}>
        <Slider ref={slick} {...settings}>
        {carouselData.map((item, i) => (
            <div key={i} className={i === carouselIndex ? "slide activeSlide" : "slide"}>
            <CarouselItem
                loading={loading} 
                stats={item.stats} 
                content={item.content}
            />
            </div>
        ))}
        </Slider>
        <CarouselBtns
            leftBtn={() => slick?.current?.slickPrev()}
            rightBtn={() => slick?.current?.slickNext()}
        />
    </div>
  );
}
