import React, { useState, StyleSheet } from 'react';
import AwesomeSlider from 'react-awesome-slider';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import 'react-awesome-slider/dist/styles.css';
import 'react-awesome-slider/dist/custom-animations/fold-out-animation.css';
import 'react-awesome-slider/dist/custom-animations/open-animation.css';
import 'react-awesome-slider/dist/custom-animations/cube-animation.css';
import 'react-awesome-slider/dist/custom-animations/fall-animation.css';
import { StackedCarousel } from 'react-stacked-carousel'
import 'react-stacked-carousel/dist/index.css';

import art1 from "../../assets/images/art1.jpg";
// import art2 from "../../assets/images/art2.jpg";
import art3 from "../../assets/images/art3.jpg";
import art4 from "../../assets/images/art4.jpg";
import art5 from "../../assets/images/art5.jpg";
import art6 from "../../assets/images/art6.jpg";
import "./uiComponents.css";

const AutoplaySlider = withAutoplay(AwesomeSlider);

export default function DesktopCarousel() {
  return <AutoplaySlider
    play={true}
    cancelOnInteraction={false} // should stop playing on user interaction
    interval={3500}
    organicArrows={false}
    animation="openAnimation"
    // fillParent={true}
    bullets={false}
    className="desktop-carousel"
  >
    <div style={{background:"#000513"}}>
      <img style={{marginLeft:70}} src={art1} alt="art1"/>
    </div>
    {/* <div style={{background:"#000513"}}>
      <img style={{marginLeft:70}} src={art2} alt="art2"/>
    </div> */}
    <div style={{background:"#000513"}}>
      <img style={{objectFit:"contain"}} src={art3} alt="art3"/>
    </div>
    <div style={{background:"#000513"}}>
      <img style={{objectFit:"contain"}} src={art4} alt="art4"/>
    </div>
    <div style={{background:"#000513"}}>
      <img style={{marginLeft:70}} src={art5} alt="art5"/>
    </div>
    <div style={{background:"#000513"}}>
      <img style={{marginLeft:70}} src={art6} alt="art6"/>
    </div>
  </AutoplaySlider>
};

// const DesktopCarousel = () => {
//   const [card, setCard] = useState(null);
//   const onCardChange = (event) => {
//     console.log("Card", event);
//   }
  
//   return (
//     <div className="main">
//       <StackedCarousel
//         autoRotate={false}
//         onCardChange={onCardChange}
//         containerClassName={"container"}
//         cardClassName="card"
//         leftButton={<button>{"<"}</button>}
//         rightButton={<button>{">"}</button>}
//       >
//         <div style={{background:"blue"}} key={'child1'}>
//           <h2>1 Card</h2>
//         </div>
//         <div style={{background:"yellow"}} key={'child2'}>
//           <h2>2 Card</h2>
//         </div>
//         <div style={{background:"green"}} key={'child3'}>
//           <h2>3 Card</h2>
//         </div>
//         <div style={{background:"red"}} key={'child4'}>
//           <h2>4 Card</h2>
//         </div>
//       </StackedCarousel>
//     </div>
//   )
// }

// export default DesktopCarousel;