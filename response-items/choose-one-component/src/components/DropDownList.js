import React, { useState, useEffect } from "react";

const DropDownList = ({ logOption, options }) => {
    
    const logSelection = e => {
        logOption(options[e.target.value])
    }

    return (
        <select onChange={logSelection}>
            <option hidden disabled selected>-- Select an option --</option>
            {
                options.map(x => 
                    <option value={x.value}>{x.option}</option>
                )
            }
        </select>
    )
}

export default DropDownList;