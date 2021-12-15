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
                        <div>Artform</div>
                        <div>Artform</div>
                    </React.Fragment>
                }
            />
        </div>
    )
}

export default Filters;
