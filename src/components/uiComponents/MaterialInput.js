import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

export default function MaterialInput({ readOnly, label, value, onChange, isTextArea, handleDelete, showIcon, type }) {
    return (
        <label className="pure-material-textfield-outlined">
            {isTextArea ?
            <textarea rows="4" value={value} onChange={onChange} placeholder=" "/> :
            <input readOnly={readOnly} type={type} value={value} onChange={onChange} placeholder=" "/>}
            <span>{label}</span>
            { showIcon ?
            <FiTrash2 onClick={handleDelete} style={{position:"absolute", right:15, top: 20, zIndex:10, cursor:"pointer"}} size={20} color='red'/> :
            null}
        </label>
    )
}

MaterialInput.defaultProps = {
    isTextArea: false,
    showIcon: false,
    type: "text",
    readOnly: false
}