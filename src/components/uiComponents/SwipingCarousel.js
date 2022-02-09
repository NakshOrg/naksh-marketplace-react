import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import { EffectCards } from "swiper";
import 'swiper/swiper-bundle.min.css';

import art1 from "../../assets/images/arts1.png";
import art2 from "../../assets/images/arts2.png";
import art3 from "../../assets/images/arts3.png";
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
        <SwiperSlide>
            <div className="swiper-slide">
                <img className="carousel-img" src={art2} alt="art2"/>
            </div>
        </SwiperSlide>
        <SwiperSlide>
            <div className="swiper-slide">
                <img className="carousel-img" src={art3} alt="art3"/>
            </div>
        </SwiperSlide>
    </Swiper>
}