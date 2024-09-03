import React from 'react';
import '../assets/styles/DropDown.css';

export const DropDown = ({ heading, Options, setValue }) => {
    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <div className="dropdown-container">
            <label htmlFor="dropdown" className="dropdown-label">{heading}</label>
            <div className="dropdown">
                <select id="dropdown" onChange={handleChange} className="dropdown-select">
                    {Options?.map((elem) => (
                        <option key={elem} value={elem}>{elem}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};
