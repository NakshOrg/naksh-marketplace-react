import React, { Component } from "react";
import Carousel from "react-spring-3d-carousel-2";
import uuid from "react-uuid";
import { config } from "react-spring";

import art1 from "../../assets/images/art1.jpg";
import art2 from "../../assets/images/art5.jpg";
import art3 from "../../assets/images/art3.jpg";
import art4 from "../../assets/images/art4.jpg";
import art5 from "../../assets/images/art5.jpg";
import art6 from "../../assets/images/art6.jpg";

export default class DesktopCarousel extends Component {

  slides = [
    {
      key: uuid(),
      content: <img className="desktop-carousel" src={art1} alt="1" />
    },
    {
      key: uuid(),
      content: <img className="desktop-carousel" src={art3} alt="2" />
    },
    {
      key: uuid(),
      content: <img className="desktop-carousel" src={art5} alt="3" />
    },
    {
      key: uuid(),
      content: <img className="desktop-carousel" src={art6} alt="3" />
    },
    {
      key: uuid(),
      content: <img className="desktop-carousel" src={art2} alt="3" />
    }
  ]

  render() {
    return (
      <div style={{ width: "80%", height: "500px", margin: "100px auto" }}>
        <Carousel
          slides={this.slides}
          offsetRadius={2}
          showNavigation={false}
          animationConfig={config.slow}
          autoPlay={true}
          interval={5}
        />
      </div>
    );
  }
}
