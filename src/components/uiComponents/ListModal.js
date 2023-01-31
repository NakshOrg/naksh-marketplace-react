import React from 'react';
import { Modal as BModal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import MaterialInput from './MaterialInput';
import { Pricing, Clock } from '../svgComponents';
import globalClasses from '../../constants/globalStyles.module.css';
import './uiComponents.css';

export default function ListModal(props) {

    const {
        title,
        btnLeft,
        btnRight,
        valid,
        onSubmit,
        onHide,
        minimumBid,
        setMinimumBid,
        price,
        setPrice,
        pricingType,
        setPricingType
    } = props;

    const inActive = {
        "border": "2px solid #868686",
        "background": "#12192B",
        "display": "flex",
        "flex-direction": "column",
        "align-items": "center",
        "padding": "25px 35px",
        "border-radius": "8px",
        "cursor": "pointer"
    }

    const active = {
        "border": "2px solid  rgba(219, 95, 121) ",
        "background": "linear-gradient(47.03deg, rgba(9, 131, 250, 0.2) 0%, rgba(219, 95, 121, 0.2) 48.09%, rgba(9, 131, 250, 0.2) 98.23%)",
        "backdrop-filter": "blur(38.981px)",
        "display": "flex",
        "flex-direction": "column",
        "align-items": "center",
        "padding": "25px 35px",
        "border-radius": "8px",
        "cursor": "pointer"
    }

    return (
        <BModal style={{zIndex:200000}} dialogClassName="small-modal" {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" backdrop="static">
            <div style={{padding:"0 30px"}}>
                <div style={{fontSize:30, fontFamily: 'Athelas-Bold', textAlign:"center", margin:"20px 0"}}>{title}</div>
                <div className='d-flex justify-content-between'>
                    <div style={{fontWeight:600, fontSize:16}}>PRICING <br/> TYPE</div>
                    <div style={{width:"72%"}} className='d-flex justify-content-between'>
                        <div onClick={() => setPricingType("fixed")} style={pricingType === "fixed" ? active : inActive}>
                            <Pricing/>
                            <div>Fixed price</div>
                        </div>
                        <div onClick={() => setPricingType("auction")} style={pricingType === "auction" ? active : inActive}>
                            <Clock/>
                            <div>Timed auction</div>
                        </div>
                    </div>
                </div>
                { pricingType === "auction" ?
                    <>
                        <div style={{marginTop:20}}>
                            <label className="pure-material-textfield-outlined">
                                <input style={{background:"#24293C", height:55}} type="text" value={minimumBid} onChange={(e) => setMinimumBid(e.target.value)} placeholder=" "/>
                                <span>Enter minimum bid</span>
                            </label>
                        </div>
                        <div style={{marginTop:10}}>
                            <label className="pure-material-textfield-outlined">
                                <input readOnly style={{background:"#24293C", height:55}} type="text" value={"1 day"} placeholder=" "/>
                                <span>Expiration date</span>
                            </label>
                        </div>
                    </> :
                    <div style={{marginTop:20}}>
                        <label className="pure-material-textfield-outlined">
                            <input style={{background:"#24293C", height:55}} type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder=" "/>
                            <span>Price</span>
                        </label>
                    </div>
                }
                <div style={{paddingBottom:20, marginTop:20, textAlign:'right', display:"flex"}}>
                    <Button onClick={onHide} variant="outline-primary" style={{width:"45%", borderColor:"#fff", color:"#fff", height:50}} className={globalClasses.outlinePrimaryBtn}>
                        {btnLeft}
                    </Button>
                    <Button onClick={valid ? onSubmit : null} style={{width:"55%", marginLeft:30, height:50, opacity: valid ? 1 : 0.5, borderColor:"#fff", background:"#fff", color:"#000"}} className={globalClasses.primaryBtn}>
                        {btnRight}
                    </Button>
                </div>
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