import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import { EffectCards } from "swiper";
import 'swiper/swiper-bundle.min.css';

import art1 from "../../assets/images/art1.jpg";
// import art2 from "../../assets/images/art2.jpg";
import art3 from "../../assets/images/art3.jpg";
import art4 from "../../assets/images/art4.jpg";
import art5 from "../../assets/images/art5.jpg";
import art6 from "../../assets/images/art6.jpg";
import './uiComponents.css';

export default function SwipingCarousel() {
    return <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards]}
        style={{marginTop:40}}
    >
        <SwiperSlide>
            <div className="swiper-slide">
                <img className="carousel-img" src={art1} alt="art1"/>
            </div>
        </SwiperSlide>
        {/* <SwiperSlide>
            <div className="swiper-slide">
                <img className="carousel-img" src={art2} alt="art2"/>
            </div>
        </SwiperSlide> */}
        <SwiperSlide>
            <div className="swiper-slide">
                <img className="carousel-img" src={art3} alt="art3"/>
            </div>
        </SwiperSlide>
        <SwiperSlide>
            <div className="swiper-slide">
                <img className="carousel-img" src={art4} alt="art4"/>
            </div>
        </SwiperSlide>
        <SwiperSlide>
            <div className="swiper-slide">
                <img className="carousel-img" src={art5} alt="art5"/>
            </div>
        </SwiperSlide>
        <SwiperSlide>
            <div className="swiper-slide">
                <img className="carousel-img" src={art6} alt="art6"/>
            </div>
        </SwiperSlide>
    </Swiper>
}