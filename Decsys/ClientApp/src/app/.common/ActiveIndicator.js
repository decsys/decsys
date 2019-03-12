import React from "react";
import PropTypes from "prop-types";
import { Check, Times } from "styled-icons/fa-solid";
import FlexBox from "./FlexBox";

/**
 * A simple color and icon based indicator for showing
 * whether something is active.
 *
 * All props other than `isActive` are passed on
 * to the underlying `FlexBox` which composes the layout of this component.
 */
const ActiveIndicator = props => {
  const { isActive, ...rest } = props;
  return (
    <FlexBox
      alignItems="center"
      p={1}
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
ActiveIndicator.defaultProps = {
  isActive: false
};

export default ActiveIndicator;
