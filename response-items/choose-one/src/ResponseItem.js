import React from "react";
import * as props from "./ResponseItem.props";
import FlexBox from "./components/FlexBox";
import DropDownList from "./components/DropDownList";
import RadioList from "./components/RadioList";
import { filterOptions } from "./utils/option-params";

// Main Component
const ResponseItem = ({
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
    width,
    textColor,
    fontSize,
    fontFamily,
  };

  const logOption = (option) => {
    setNextEnabled(true);
    logResults(option);
  };

  return (
    <FlexBox alignment={alignment}>
      {dropDown ? (
        <DropDownList options={options} onSelection={logOption} {...styles} />
      ) : (
        <RadioList options={options} onSelection={logOption} {...styles} />
      )}
    </FlexBox>
  );
};

// Props metadata - Edit these in `./Component.props.js`
ResponseItem.params = props.params;
ResponseItem.propTypes = props.propTypes;
ResponseItem.defaultProps = props.defaultProps;

export default ResponseItem;
