import React from 'react';
import { Modal as BModal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import globalClasses from '../../constants/globalStyles.module.css';
import './uiComponents.css';

export default function ListModal(props) {

    const {
        showBorder,
        title,
        body,
        btnLeft,
        btnRight,
        valid,
        onSubmit,
        onHide
    } = props;

    return (
        <BModal dialogClassName="small-modal" {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" backdrop="static">
            <BModal.Header style={{border:'none', paddingLeft:27, borderRadius:100}}>
                <BModal.Title style={{fontSize:22}} id="contained-modal-title-vcenter">
                    {title}
                </BModal.Title>
            </BModal.Header>
            {showBorder &&
            <div style={{height:1.3, background:'black', alignSelf:'center', display:'flex', width:'93%', opacity:0.15, borderRadius:25, marginTop:-5}}/>}
            <BModal.Body style={{border:'none', padding:'10px 27px', marginTop:5}}>
                {body}
            </BModal.Body>
            <div style={{paddingBottom:20, paddingRight:27, textAlign:'right'}}>
                <Button onClick={onHide} variant="outline-primary" style={{width:125}} className={globalClasses.outlinePrimaryBtn}>
                    {btnLeft}
                </Button>
                <Button onClick={valid ? onSubmit : null} style={{width:125, height:40, marginLeft:10, opacity: valid ? 1 : 0.5}} className={globalClasses.primaryBtn}>
                    {btnRight}
                </Button>
            </div>
        </BModal>
    )
}

ListModal.defaultProps = {
    btnLeft: 'Cancel',
    btnRight: 'Done',
    title: 'Custom title here',
    valid: false,
    showBorder: true
}; 

ListModal.propTypes = {
    btnLeft: PropTypes.string,
    btnRight: PropTypes.string,
    onClick: PropTypes.func,
    valid: PropTypes.bool
}; 
 
