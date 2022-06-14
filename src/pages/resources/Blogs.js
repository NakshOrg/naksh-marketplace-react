import React, { Component, Fragment } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { FiExternalLink, FiFacebook, FiGlobe, FiSearch } from 'react-icons/fi';
import { BsInstagram } from 'react-icons/bs';
import { helpers } from '../../constants';

import { _getLandingPageData } from '../../services/axios/api';
import BlogCard from '../../components/blogs/BlogCard';
import globalStyles from '../../globalStyles';
import classes from './resources.module.css';
import Spinner from '../../components/uiComponents/Spinner';
import configs from '../../configs';
import Footer from '../../components/uiComponents/Footer';

export default class Blogs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            blogs: [
                {
                    author: "Naksh",
                    category: (5) ['artist', 'tradition', 'art', 'nftartist', 'nft-marketplace'],
                    created: 1643800916000,
                    image: "https://cdn-images-1.medium.com/max/1024/1*9RLPJVvFspOpKTXz8ohiMw.jpeg",
                    link: "https://medium.com/@naksh.org/pattachitra-the-evolution-of-an-artform-b4d25fff8ff1?source=rss-511451884ca9------2",
                    published: 1643800916000,
                    title: "Pattachitra — the evolution of an artform",
                    description: "Pattachitra, coming from Patta meaning cloth and Chitra meaning picture is an Indian traditional artform which originally involved narrative drawings around Hindu mythology, primarily Lord Jagannath"
                },
                {
                    author: "Naksh",
                    category: (5) ['indian-art', 'artist', 'nft-marketplace', 'nft', 'nftartist'],
                    created: 1643361223000,
                    image: "https://cdn-images-1.medium.com/max/1024/1*T43sIM984hx6XpvM9edEwA.jpeg",
                    link: "https://medium.com/@naksh.org/the-artists-of-naksh-chetan-gangavne-6ab0f8bded70?source=rss-511451884ca9------2",
                    published: 1643361223000,
                    title: "The artists of Naksh — Chetan Gangavne",
                    description: "‘The artists of Naksh’ is a series of interviews which aims at establishing a relationship between the artist and the buyer of the art. All traditional artworks on Naksh are crafted manually by the artists and their teams, and in this series we will try to get a closer look at the lives and stories of the pallbearers of traditional Indian art in modern times."
                },
                {
                    author: "Naksh",
                    category: (5) ['nftart', 'nft-marketplace', 'art', 'indian-art', 'nft-collectibles'],
                    created: 1642002157000,
                    image: "https://cdn-images-1.medium.com/max/1024/1*OFgrLpDRfO6H5YNsJnZaKg.jpeg",
                    link: "https://medium.com/@naksh.org/godna-an-unrecognized-gem-96d9dc29d2bc?source=rss-511451884ca9------2",
                    published: 1642002157000,
                    title: "Godna — an unrecognized gem",
                    description: "In the current Indian art scenario, some of the most popular art forms that have found popularity amongst art collectors and buyers have been Mithila, Madhubani etc. While it is extremely desirable that these artforms have created their unshakeable niches in the buyers market, there hav"
                },
                {
                    author: "Naksh",
                    category: (5) ['nft', 'abstract', 'artist', 'nft-marketplace', 'nftartist'],
                    created: 1641656379000,
                    image: "https://cdn-images-1.medium.com/max/1024/1*Edbi07wpY-DG_JgB1dZUYw.jpeg",
                    link: "https://medium.com/@naksh.org/abstract-art-a-liberation-of-style-5f39f501437e?source=rss-511451884ca9------2",
                    published: 1641656379000,
                    title: "Abstract art — a liberation of style",
                    description: "Abstract art is a way of looking at the world — a different perspective. Just like artists from most traditional mediums and artforms have found their ways of depicting stories and creating narratives — abstract artists have done the same, but the characteristic that primarily differentiates abstract art from traditional artforms is the independence it claims — going slightly beyond the visual"
                },
                {
                    author: "Naksh",
                    category: (5) ['nftart', 'nft-marketplace', 'art', 'indian-art', 'nft-collectibles'],
                    created: 1642002157000,
                    image: "https://cdn-images-1.medium.com/max/1024/1*wSolYy0QsF8dLyM9SX95MA.jpeg",
                    link: "https://medium.com/@naksh.org/chitrakathi-a-fading-culture-2a964b36bfd4?source=rss-511451884ca9------2",
                    published: 1642002157000,
                    title: "Chitrakathi — a fading culture",
                    description: "Chitrakathi art derives its name from two commonly used Hindi words — ‘Chitra’ meaning picture or drawing and ‘Katha’ meaning a story or narration, which makes it easy to understand that this artform is about narratives and depictions. It is believed that Chitrakathi art originated in the Maharashtra and Karnataka regions of India when people started creating narrat"
                },
                {
                    author: "Naksh",
                    category: (5) ['nft', 'abstract', 'artist', 'nft-marketplace', 'nftartist'],
                    created: 1641656379000,
                    image: "https://cdn-images-1.medium.com/max/1024/1*9G3vj_QXB_WS0O7cOw8blw.jpeg",
                    link: "https://medium.com/@naksh.org/warli-art-an-overview-db14cfbba349?source=rss-511451884ca9------2",
                    published: 1641656379000,
                    title: "Warli art — an overview",
                    description: "Warli art is one of the oldest forms of Indian art, and one of the most popular ones too. The artform derives its name from the Warli tribe which has been practising it for centuries now — in districts in and around the city of Mumbai such as Dahanu and Palghar where the artform originated. Like many traditional artforms, Warli artists take inspiration fr"
                }
            ]
        }
    }

    componentDidMount() {

        _getLandingPageData()
        .then(res => res.json())
        .then(res => {
            console.log(res, "rrr");
            // this.setState({blogs: res.mediumData})
            this.setState({loading: false});
        })
        .catch(err => {
            console.log(err);
            this.setState({loading: false});
        });
    }

    render() { 

        const { loading, blogs } = this.state;

        if(loading) {
            return <Spinner/>;
        }

        return (
            <Container fluid className={classes.container}>
                <div className={classes.blogGradientOverlay}/>
                <div style={{...globalStyles.flexRowSpace, marginBottom:22}}>
                    <div className={classes.sectionTitle}>Naksh Blogs</div>
                    {/* <div style={{position:'relative', width:'40%'}}>
                        <input
                            style={{width:'100%'}}
                            className="search-bar" 
                            placeholder="Search for a blog here" 
                        />
                        <FiSearch style={{opacity:0.8, position:'absolute', top:'22%', left:15}} size={22}/>
                    </div> */}
                    <div onClick={() => helpers.openInNewTab(configs.nakshMedium)} style={{...globalStyles.flexRow, cursor:"pointer"}}>
                        <div style={{marginRight:10, fontSize:"1rem"}}>View all</div>
                        <FiExternalLink size={20} color='#fff'/>
                    </div>
                </div>
                <Row>
                    {blogs.map((blog, i) => {
                        return <Col key={i} lg={4} md={6} sm={12}>
                            <BlogCard
                                coverImage={blog.image}
                                title={blog.title}
                                description={blog.description}
                                onClick={() => helpers.openInNewTab(blog.link)}
                            />
                        </Col>
                    })}
                </Row>
                <Footer/>
            </Container>
        )
    }
}
