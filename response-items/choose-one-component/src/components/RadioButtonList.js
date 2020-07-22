import React, { useState, useEffect } from "react";
import styled from "styled-components";
import RadioListItem from "./RadioListItem"

const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const RadioButtonList = ({ options, onSelection, ...props }) => {
    
    // Generate identifier to group radios
    const name = Date.now();

    return (
        <ListContainer>
        {
            options.map(option =>
                <RadioListItem name={name} option={option} onSelection={onSelection} {...props}/>    
            )
        }
        </ListContainer>
    )
}

export default RadioButtonList;