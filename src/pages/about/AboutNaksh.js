import React, { Fragment } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { motion } from 'framer-motion';

import founder1 from '../../assets/images/founder1.jpg';
import founder2 from '../../assets/images/founder2.jpg';
import AboutCard from '../../components/about/AboutCard';
import classes from './about.module.css';
import Footer from '../../components/uiComponents/Footer';

export default function AboutNaksh() {
    return (
        <Container fluid className={classes.container}>
            {/* overlay gradient  */}
            <div className={classes.detailsGradientOverlay}/>
            {/* overlay gradient  */}
            <div className={classes.detailsGradientOverlayPink}/>
            <motion.div 
                initial={{ x:-1000 }}
                animate={{ x: 0 }}
                transition={{ duration: 1 }}
            >
                <div className={classes.sectionCaption}>
                    Naksh is constantly pushing the boundaries of what NFTs can do
                </div>
                <div className={classes.sectionSubHeading}>
                    The past and the future of art and art exchanges needed a bridge, and this is where we came up with the idea of an NFT marketplace catering to regional artists and traditional mediums.
                </div>
            </motion.div>
            <div className={classes.sectionTitle}>
                With Naksh, you can
            </div>
            <Row>
                <Col lg={4} md={6}>
                    <motion.div 
                        initial={{ y:-2000 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1.2, delay:0.5 }}
                    >
                        <AboutCard
                            title={"Original Artworks"}
                            content={"Paid works by some of the finest creators of India"}
                        />
                    </motion.div>
                </Col>
                <Col lg={4} md={6}>
                    <motion.div 
                        initial={{ y:-2000 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1.2, delay:0.9 }}
                    >
                        <AboutCard
                            title={"Community"}
                            content={"A place to find new creators, build a community that lasts for a long time"}
                        />
                    </motion.div>
                </Col>
                <Col lg={4}>
                    <motion.div 
                        initial={{ y:-2000 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1.2, delay:1.3 }}
                    >
                        <AboutCard
                            title={"NFT Collectibles"}
                            content={"Create a collection of your favorite artworks minted by our creators"}
                        />
                    </motion.div>
                </Col>
                <Footer/>
            </Row>
            {/* <Row style={{margin:"75px 0"}}>
                <Col style={{padding:0, paddingBottom:20}} lg={4} md={12}>
                    <div className={classes.foundersCaption}>The women behind Naksh</div>
                    <div style={{fontSize: "16px", opacity: 0.7, marginTop: "12px", lineHeight: "25px"}}>Our co-founders envisioned Naksh at a NEAR Hackathon in May 2020. We have come a long way since then.</div>
                </Col>
                <Col className={classes.founderImg} lg={4} md={6}>
                    <div>
                        <img style={{height:400, width:"100%", borderRadius:5, objectFit:"cover"}} src={founder1} alt='co-founder'/>
                    </div>
                    <div style={{marginTop:15, fontFamily:'Athelas-Bold', fontSize:24, letterSpacing:0.4}}>Sri Lakshmi</div>
                    <div style={{fontSize:16, opacity:0.7, lineHeight:"20px", letterSpacing:0.5, fontWeight:100}}>
                        Sri Lakshmi pursued her Master's in the field of Fashion Retail Management in London and has since acquired various management positions across different companies. She currently oversees the financial planning and execution at Naksh and aims to expand Naksh's domain of operations to other verticals soon.
                    </div>
                </Col>
                <Col className={classes.founderImg} style={{paddingRight:0}} lg={4} md={6}>
                    <div>
                        <img style={{height:400, width:"100%", borderRadius:5, objectFit:"cover"}} src={founder2} alt='co-founder'/>
                    </div>
                    <div style={{marginTop:15, fontFamily:'Athelas-Bold', fontSize:24, letterSpacing:0.4}}>Nivedita</div>
                    <div style={{fontSize:16, opacity:0.7, lineHeight:"20px", letterSpacing:0.5, fontWeight:100}}>
                    Nivedita Vivek pursued her Master's from the same institution as her co-founder Lakshmi, where the duo first met. Post this, she took up various Social Media Marketing roles and has now directed her focus towards handling operations and future collaborations at Naksh. She aims to enter the tech ecosystem soon.                    </div>
                </Col>
            </Row> */}
        </Container>
    )
}
