import React from "react"; 
import { Modal } from "react-bootstrap";
import { FiX } from "react-icons/fi";
import { useSelector } from "react-redux";

import connectNear from '../../assets/svgs/connect-near-gradient.svg';
import configs from "../../configs";
import './uiComponents.css';


export default function MyVerticallyCenteredModal(props) {

  const walletInfo = useSelector(state => state.nearReducer.walletInfo);

  function walletSignIn() {
    if(walletInfo) {
      walletInfo.requestSignIn({
        successUrl: configs.appUrl,
        failureUrl: `${configs.appUrl}/404`
      });
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body style={{textAlign:"center"}}>
        <FiX onClick={props.onHide} style={{position:"absolute", right:15, top:15, cursor:"pointer"}} size={18} color="#fff"/>
      <div className="near-heading">Connect to NEAR</div>
      <div className="near-description">Connect to your Near Wallet to complete this purchase</div>
        <div 
          onClick={walletSignIn}
          style={{    
            background: "white",
            width: "215px",
            height: "45px",
            borderRadius: "4px",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
            margin: "0 auto",
            marginTop:20
          }}
        >
          <img src={connectNear} alt="near"/>
        </div>
      </Modal.Body>
    </Modal>
  );
}