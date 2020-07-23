import React from "react";
import styled from "styled-components";
import RadioListItem from "./RadioListItem"

const FlexBox = styled.div`
    display: flex;
    flex-direction: column;
`;

const RadioButtonList = ({ options, onSelection, ...props }) => {
    
    // Generate identifier to group radios
    const name = Date.now();

    return (
        <FlexBox>
        {
            options.map(option =>
                <RadioListItem name={name} option={option} onSelection={onSelection} {...props}/>    
            )
        }
        </FlexBox>
    )
}

export default RadioButtonList;