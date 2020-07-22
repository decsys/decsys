import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FlexBox from './FlexBox'
import RadioListItem from "./RadioListItem"

const styles = {
    color: "black",
    scale: "1em",
    fontsize: "1em",
    fontfamily: "Arial"
}

const RadioButtonList = ({ logOption, options }) => {
    
    // Generate identifier to group radios
    const name = Date.now();

    return (
        <div>
        {
            options.map(option =>
                <RadioListItem name={name} option={option} styles={styles} onSelection={logOption} />    
            )
        }
        </div>
    )
}

export default RadioButtonList;