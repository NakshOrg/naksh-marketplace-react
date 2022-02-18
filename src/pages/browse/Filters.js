import React, { useState } from 'react';
// import { Dropdown } from 'react-bootstrap';
import { FiChevronDown } from 'react-icons/fi';

import Dropdown from '../../components/uiComponents/Dropdown';

const sortFilter = ["Newest first", "Oldest first", "Price - High to low", "Price - Low to high"];


function Filters({ title }) {

    const [currentSort, setCurrentSort] = useState(sortFilter[0]);


    return (
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', width:190}}>
            <div style={{marginLeft:13}}/>
            <Dropdown 
                title={currentSort}
                content={sortFilter}
                onChange={(val) => setCurrentSort(val)}
            />
        </div>
    )
}

export default Filters;
