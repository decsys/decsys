import React, { useState, useEffect } from "react";
import styled from "styled-components";
import RadioListItem from "./RadioListItem"

const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const RadioButtonList = ({ options, styles, onSelection }) => {
    
    // Generate identifier to group radios
    const name = Date.now();

    return (
        <ListContainer>
        {
            options.map(option =>
                <RadioListItem name={name} option={option} styles={styles} onSelection={onSelection} />    
            )
        }
        </ListContainer>
    )
}

export default RadioButtonList;