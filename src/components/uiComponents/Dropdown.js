import React from 'react';
import { Dropdown as DropDown, Form } from 'react-bootstrap';
import { FiChevronDown } from 'react-icons/fi'
import uuid from 'react-uuid';

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
            <DropDown.Menu style={{padding:15, fontSize:15, height:200, minWidth:'12rem', overflowY:"scroll"}} id="dropdown-basic-content">
                {content.map((item, i) => 
                <DropDown.Item 
                    onClick={() => onChange(item)} 
                    key={i} 
                    style={{
                        marginTop: i > 0 && 15,
                        whiteSpace: "nowrap", 
                        overflow: "hidden", 
                        textOverflow: "ellipsis"
                    }}
                >
                    {item.name ?? item.label}
                </DropDown.Item>)}
            </DropDown.Menu>
        </DropDown>
    )
}

export function PriceDropdown({ title, content, onChange, priceRanges }) {

    const selectedPriceRanges = priceRanges.filter(item => item.checked);

    return (
        <DropDown style={{width:'100%'}}>
            <DropDown.Toggle style={{width:'100%'}} variant="success" id="dropdown-basic">
                <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                    <div style={{fontWeight:500, fontSize:15, width:130}}>
                        { selectedPriceRanges.length === 0 ? 
                        <div style={{marginLeft:-40}}>{title}</div> :
                        <div style={{marginLeft:-15}}>{`${title} (${selectedPriceRanges.length})`}</div> }
                    </div>
                    <FiChevronDown size={20} />
                </div>
            </DropDown.Toggle>
            <DropDown.Menu style={{padding:15, fontSize:15, height:200, width:'15rem', overflowY:"scroll"}} id="dropdown-basic-content">
                {priceRanges.map((item, index) => {
                    return <div key={uuid()} style={{display:"flex", justifyContent:"space-between", color:"#fff"}}>
                        <Form.Group onChange={() => onChange(index)} className="mb-3" controlId={item.label}>
                            <Form.Check checked={item.checked} type="checkbox" label={item.label} />
                        </Form.Group>
                        <div>{`(${item.noOfNfts})`}</div>
                    </div>
                })}
                {/* {content.map((item, i) => 
                <DropDown.Item 
                    onClick={() => onChange(item)} 
                    key={i} 
                    style={{
                        marginTop: i > 0 && 15,
                        whiteSpace: "nowrap", 
                        overflow: "hidden", 
                        textOverflow: "ellipsis"
                    }}
                >
                    {item.name ?? item.label}
                </DropDown.Item>)} */}
            </DropDown.Menu>
        </DropDown>
    )
}

export default Dropdown;
