import React from 'react';

export default function MaterialInput({ label, value, onChange, isTextArea }) {
    return (
        <label className="pure-material-textfield-outlined">
            {isTextArea ?
            <textarea rows="4" value={value} onChange={onChange} placeholder=" "/> :
            <input value={value} onChange={onChange} placeholder=" "/>}
            <span>{label}</span>
        </label>
    )
}

MaterialInput.defaultProps = {
    isTextArea: false
}