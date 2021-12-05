import React from 'react';
import { FiSearch } from 'react-icons/fi';

import './uiComponents.css';

function Search() {
    return (
        <div style={{position:'relative', width:'100%'}}>
            <input 
                className="search-bar" 
                placeholder="Search for NFTs and artists" 
            />
            <FiSearch style={{opacity:0.8, position:'absolute', top:'25%', left:15}} size={19}/>
        </div>
    )
}

export default Search;
