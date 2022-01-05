import React from 'react';

export default function BlogCard({ onClick, coverImage, title, description }) {

    const containerStyle = {
        background: 'linear-gradient(92.18deg, rgba(38, 37, 52, 0.5) 0%, rgba(49, 48, 65, 0.305) 100%)',
        backdropFilter: 'blur(100px)',
        borderRadius: '5px',
        marginBottom: 20,
        cursor: 'pointer'
    }

    return (
        <div onClick={onClick} style={containerStyle}>
            <div>
                <img 
                    style={{width:'100%', height:'200px', objectFit:'cover', borderRadius:5}} 
                    src={coverImage} 
                    alt='blog-cover'
                />
            </div>
            <div style={{padding:'15px'}}>
                <div style={{fontFamily:'Athelas-Bold', fontSize:26, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {title}
                </div>
                <div style={{fontWeight:100, letterSpacing:1, fontSize:16}}>
                    {description}
                </div>
            </div>
        </div>
    )
};
