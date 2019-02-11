import React from "react";
import PropTypes from "prop-types";
import { Check, Times } from "styled-icons/fa-solid";
import FlexBox from "./FlexBox";

const ActiveIndicator = props => {
  const { isActive, ...rest } = props;
  return (
    <FlexBox
      alignItems="center"
      p=".5em"
      backgroundColor={isActive ? "success" : "gray700"}
      title={isActive ? "Active" : "Inactive"}
      {...rest}
    >
      {isActive ? (
        <Check size="1em" color="white" />
      ) : (
        <Times size="1em" color="white" />
      )}
    </FlexBox>
  );
};

ActiveIndicator.propTypes = {
  isActive: PropTypes.bool
};

export default ActiveIndicator;
