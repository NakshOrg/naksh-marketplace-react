import React, { Component, Fragment } from 'react';
import { Col, Row, Container } from 'react-bootstrap';

import AboutNaksh from './AboutNaksh';
import OurArtists from './OurArtists';
import NearProtocol from './NearProtocol';
import classes from './about.module.css';

export default class About extends Component {
    render() {
        return (
            <div style={{marginTop:160}}>
                <AboutNaksh/>
            </div>
        )
    }
}
