import React from "react";
import styled from "styled-components";

const StyledLabel = styled.label`
    color: ${x => x.color || "black"};
    font-size: ${x => x.fontsize || "1em"};
    font-family: ${x => x.fontfamily || "Times New Roman"};
`;

const StyledRadio = styled.input.attrs({ type: 'radio' })`
    vertical-align: middle;
    padding: 0;
    margin: 0 .5em .25em 0;
    width: ${x => x.scale || "1em"};
    height: ${x => x.scale || "1em"};
`;

const RadioListItem = ({ name, option, onSelection, ...props }) => (
    <StyledLabel {...props}>
        <StyledRadio name={name} onChange={() => onSelection(option)} {...props} />
        <>{ option.option }</>
    </StyledLabel>
)

export default RadioListItem;