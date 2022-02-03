import React from 'react';
import { Dropdown as DropDown } from 'react-bootstrap';
import { FiChevronDown } from 'react-icons/fi'

function Dropdown({ title, content, onChange }) {
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
            <DropDown.Menu style={{padding:15, fontSize:15, minWidth:'12rem'}} id="dropdown-basic-content">
                {content.map((item, i) => <DropDown.Item onClick={() => onChange(item)} key={i} style={{marginTop: i > 0 && 15}}>{item}</DropDown.Item>)}
            </DropDown.Menu>
        </DropDown>
    )
}

export default Dropdown;
