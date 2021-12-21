import React from 'react';

import './uiComponents.css';

export const PrimaryBtn = ({ onClick, style, content }) => {
    return (
        <div 
            onClick={onClick}
            style={{
                background: "linear-gradient(94.83deg, rgb(0, 133, 255) -0.81%, rgb(255, 89, 99) 107.02%)",
                borderRadius: "4px",
                textAlign: "center",
                fontSize: "12px",
                height: "53px",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                cursor: "pointer",
                letterSpacing: "1.5px",
                fontWeight: "bold",
                ...style
            }}
        >
            {content}
        </div>
    )
}

