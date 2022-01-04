import React from 'react';

export default function MaterialInput({ label, value, onChange }) {
    return (
        <label class="pure-material-textfield-outlined">
            <input value={value} onChange={onChange} placeholder=" "/>
            <span>{label}</span>
        </label>
    )
}
