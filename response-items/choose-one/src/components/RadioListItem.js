import React from "react";

const StyledLabel = ({
  textColor = "black",
  fontSize = "1em",
  fontFamily = "Times New Roman",
  ...p
}) => (
  <label
    css={{
      width: "fit-content",
      color: textColor,
      fontSize,
      fontFamily,
    }}
    {...p}
  />
);

const StyledRadio = (p) => (
  <input
    type="radio"
    css={{
      verticalAlign: "middle",
      padding: 0,
      margin: "0 .5em .25em 0",
      width: "1em",
      height: "1em",
    }}
    {...p}
  />
);

const RadioListItem = ({ name, option, onSelection, ...props }) => (
  <StyledLabel {...props}>
    <StyledRadio name={name} onChange={() => onSelection(option)} {...props} />
    <>{option.label}</>
  </StyledLabel>
);

export default RadioListItem;
