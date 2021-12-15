import React from 'react';
import { Dropdown as DropDown } from 'react-bootstrap';
import { FiChevronDown } from 'react-icons/fi'

function Dropdown({ title, content }) {
    return (
        <DropDown style={{width:'100%'}}>
            <DropDown.Toggle style={{width:'100%'}} variant="success" id="dropdown-basic">
                <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                    <div style={{fontWeight:500, fontSize:15}}>
                        {title}
                    </div>
                    <FiChevronDown size={20} />
                </div>
            </DropDown.Toggle>
            <DropDown.Menu id="dropdown-basic-content">
                {content}
            </DropDown.Menu>
        </DropDown>
    )
}

export default Dropdown;
