import React, { Component, Fragment } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { FiFacebook, FiGlobe, FiSearch } from 'react-icons/fi';
import { BsInstagram } from 'react-icons/bs';
import axios from 'axios';

import BlogCard from '../../components/blogs/BlogCard';
import globalStyles from '../../globalStyles';
import classes from './blogs.module.css';
import Search from '../../components/uiComponents/Search';

export default class Blogs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            blogs: []
        }
    }

    componentDidMount() {
        axios.get(process.env.REACT_APP_BASE_URL+'/client/landing/data')
        .then(({ data }) => {
            this.setState({blogs: data.mediumData})
        })
        .catch(err => {
            console.log(err);
        })
    }

    render() { 

        const { blogs } = this.state;

        return (
            <Container style={{marginTop:95}}>
                <div style={{...globalStyles.flexRowSpace, marginBottom:22}}>
                    <div className={classes.sectionTitle}>Naksh Blogs</div>
                    <div style={{position:'relative', width:'40%'}}>
                        <input
                            style={{width:'100%'}}
                            className="search-bar" 
                            placeholder="Search for a blog here" 
                        />
                        <FiSearch style={{opacity:0.8, position:'absolute', top:'22%', left:15}} size={22}/>
                    </div>
                </div>
                <Row>
                    {blogs.map((blog, i) => {
                        return <Col key={i} lg={4}>
                            <BlogCard
                                coverImage={blog.image}
                                title={blog.title}
                                description={"Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint..."}
                                // onClick={blog.link}
                            />
                        </Col>
                    })}
                </Row>
            </Container>
        )
    }
}
