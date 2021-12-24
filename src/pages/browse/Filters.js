import React from 'react';

import Dropdown from '../../components/uiComponents/Dropdown';

function Filters({ title }) {
    return (
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', width:"40%"}}>
            <Dropdown 
                title="Artform"
                content={
                    <React.Fragment>
                        <div>Artform</div>
                        <div>Artform</div>
                    </React.Fragment>
                }
            />
            <div style={{marginLeft:13}}/>
            <Dropdown 
                title="Price range"
                content={
                    <React.Fragment>
                        <div>Artform</div>
                        <div>Artform</div>
                    </React.Fragment>
                }
            />
            <div style={{marginLeft:13}}/>
            <Dropdown 
                title="Newest first"
                content={
                    <React.Fragment>
                        <div style={{color:"#fff", marginBottom:10}}>Newest first</div>
                        <div style={{color:"#fff", marginBottom:10}}>Oldest first</div>
                        <div style={{color:"#fff", marginBottom:10}}>Price - High to low</div>
                        <div style={{color:"#fff"}}>Price - Low to high</div>
                    </React.Fragment>
                }
            />
        </div>
    )
}

export default Filters;
