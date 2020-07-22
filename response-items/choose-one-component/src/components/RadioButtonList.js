import React, { useState, useEffect } from "react";

const RadioButtonList = ({ logOption, options }) => {
    
    // Generate identifier to group radios
    const name = Date.now();

    const logSelection = e => {
        logOption(options[e.target.value])
    }

    return (
        <div>
        {
            options.map(x => 
                <label>
                    <input  type="radio" name={name} value={x.value} onChange={logSelection}/>
                    { x.option }
                </label>    
            )
        }
        </div>
    )
}

export default RadioButtonList;