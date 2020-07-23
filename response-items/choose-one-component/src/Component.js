import React, { useState, useEffect } from "react";
import * as props from "./Component.props";
import DropDownList from "./components/DropDownList";
import RadioButtonList from "./components/RadioButtonList"
import { filterOptions } from "./utils/option-params";
import styled from "styled-components";

// Container to sort out component alignment and size
const Alignment = styled.div`
  width: ${x => x.dropDown ? (x.width || "100%") : "fit-content"};
  float: ${x => (x.alignment == "center") ? "" : x.alignment};
  margin: auto;
`;

// Main Component
const Component = ({
  logResults, 
  setNextEnabled,
  dropDown,
  width,
  alignment,
  textColor,
  fontSize,
  fontFamily,
  ...props
}) => {

  const options = filterOptions(props);

  const styles = {
    textColor,
    fontSize,
    fontFamily,
  }

  const logOption = option => {
    setNextEnabled(true);
    logResults(option);
  }

  return (
    // Parent <div> required for alignment in Decsys
    <div>
      <Alignment {...{dropDown, width, alignment}}>
        {
          dropDown  ? <DropDownList options={options} logOption={logOption} {...styles} />
                    : <RadioButtonList options={options} onSelection={logOption} {...styles} />
        }
      </Alignment>
    </div>
  );
};

// Props metadata - Edit these in `./Component.props.js`
Component.params = props.params;
Component.propTypes = props.propTypes;
Component.defaultProps = props.defaultProps;

export default Component;
