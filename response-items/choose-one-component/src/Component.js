import React, { useState, useEffect } from "react";
import * as props from "./Component.props";
import DropDownList from "./components/DropDownList";
import RadioButtonList from "./components/RadioButtonList"
import { filterOptions } from "./utils/option-params";

// Build a Response Component as a React Functional Component
const Component = ({
  logResults, 
  setNextEnabled,
  dropDown,
  ...p
}) => {

  const options = filterOptions(p);

  const logOption = option => {
    setNextEnabled(true);
    logResults(option);
  }

  return (
    <div>
      {
        dropDown  ? <DropDownList logOption={logOption} options={options} />
                  : <RadioButtonList logOption={logOption} options={options} />
      }
    </div>
  );
};

// Props metadata - Edit these in `./Component.props.js`
Component.params = props.params;
Component.propTypes = props.propTypes;
Component.defaultProps = props.defaultProps;

export default Component;
