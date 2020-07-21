import React, { useState, useEffect } from "react";
import { filterOptions } from "./utils/option-params";
import * as props from "./Component.props";

// Build a Response Component as a React Functional Component
const Component = ({
  logResults, 
  setNextEnabled,
  dropDown,
  ...p
}) => {

  const options = filterOptions(p);

  useEffect(() => setNextEnabled(true), [setNextEnabled]);

  console.log(dropDown);

  return (
    <div>
      <div>DropDown: {dropDown ? "True" : "False"}</div>
      <div>Options: {options.length}</div>
      {
        options.map(x => <p>{x.option}</p>)
      }
    </div>
  );
};

// Props metadata - Edit these in `./Component.props.js`
Component.params = props.params;
Component.propTypes = props.propTypes;
Component.defaultProps = props.defaultProps;

export default Component;
