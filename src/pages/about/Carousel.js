import { useState } from "react";
import Slider from "react-slick";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

import "../../App.css";

function CarouselBtns() {
    return <div style={{marginTop:10, marginLeft:50}} class="carousel-btns">
        <span id="prev" style={{marginRight:25}}>
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
        <span id="next">
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

function CarouselItem({stats, content}) {
    return <div className="carousel-slide-item-wrapper">
        <div className="carousel-slide-item-wrapper-black"></div>
        <div className="carousel-slide-item">
            <div className="carousel-slide-item-content">
                <div className="carousel-slide-item-content-stats">{stats}</div>
                <div className="carousel-slide-item-content-caption">{content}</div>
            </div>
        </div>
    </div>  
  }

export default function Carousel() {

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselData, setCarouselData] = useState([
    {stats:"1000+", content:"People Are Already On NEAR"},
    {stats:"1000+", content:"Transactions Were Powered By NEAR Token Today"},
    {stats:"1000+", content:"Daily Gas Used"},
    {stats:"1000+", content:"Users Have Joined NEAR Today"}
  ]);
 
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
    beforeChange: (_, next) => setCarouselIndex(next)
  };

  return (
    <div className="App">
        <Slider {...settings}>
        {carouselData.map((item, i) => (
            <div key={i} className={i === carouselIndex ? "slide activeSlide" : "slide"}>
            <CarouselItem 
                stats={item.stats} 
                content={item.content}
            />
            </div>
        ))}
        </Slider>
        <CarouselBtns/>
    </div>
  );
}
