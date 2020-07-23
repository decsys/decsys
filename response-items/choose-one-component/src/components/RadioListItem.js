import React from "react";
import styled from "styled-components";

const StyledLabel = styled.label`
    width: fit-content;
    color: ${x => x.textColor || "black"};
    font-size: ${x => x.fontSize || "1em"};
    font-family: ${x => x.fontFamily || "Times New Roman"};
`;

const StyledRadio = styled.input.attrs({ type: 'radio' })`
    vertical-align: middle;
    padding: 0;
    margin: 0 .5em .25em 0;
    width: "1em",
    height: "1em"
`;

const RadioListItem = ({ name, option, onSelection, ...props }) => (
    <StyledLabel {...props}>
        <StyledRadio key={name} name={name} onChange={() => onSelection(option)} {...props} />
        <>{ option.label }</>
    </StyledLabel>
)

export default RadioListItem;