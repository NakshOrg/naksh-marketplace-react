import React from 'react';

import "./uiComponents.css";

function Spinner() {

  const center = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center'
  }
  return (
    <div style={center}>
      <div className="lds-dual-ring"></div>
    </div>
  );
}

export default Spinner;
