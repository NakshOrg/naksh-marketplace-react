import { motion } from 'framer-motion';
import React, { Component, Fragment } from 'react';
import { Container } from 'react-bootstrap';
import { FiArrowLeft } from 'react-icons/fi';
import globalStyles from '../../globalStyles';


import classes from './profile.module.css';

export default class EditProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: "owned"
        }
    }

    render() {

        return (
            <Container style={{marginTop:100, padding:'0 220px'}} fluid>
                <div style={{...globalStyles.flexRowSpace}}>
                    <div>
                        <span><FiArrowLeft style={{marginTop:-14, marginRight:10}} size={25} color='#fff'/></span>
                        <span className={classes.sectionTitle}>Edit Profile</span>
                    </div>
                    <div class="glow-on-hover" type="button" style={{zIndex:100, width:200, padding:'0 37px', height:45, marginTop:0}}>
                        <div>SAVE CHANGES</div>
                    </div>
                </div>
            </Container>
        )
    }
}
