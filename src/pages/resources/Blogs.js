import React, { Component, Fragment } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { FiExternalLink, FiFacebook, FiGlobe, FiSearch } from 'react-icons/fi';
import { BsInstagram } from 'react-icons/bs';

import { _getLandingPageData } from '../../services/axios/api';
import BlogCard from '../../components/blogs/BlogCard';
import globalStyles from '../../globalStyles';
import classes from './resources.module.css';
import Spinner from '../../components/uiComponents/Spinner';
import configs from '../../configs';
import Footer from '../../components/uiComponents/Footer';
import { helpers } from '../../constants';

export default class Blogs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            blogs: []
        }
    }

    componentDidMount() {

        _getLandingPageData()
        .then(res => res.json())
        .then(res => {
            console.log(res);
            this.setState({blogs: res.mediumData})
            this.setState({loading: false});
        })
        .catch(err => {
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
