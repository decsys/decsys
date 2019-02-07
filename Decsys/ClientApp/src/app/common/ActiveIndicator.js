import React from "react";
import PropTypes from "prop-types";
import { Box } from "@smooth-ui/core-sc";
import { Check, Times } from "styled-icons/fa-solid";

const ActiveIndicator = props => {
  const { isActive, ...rest } = props;
  return (
    <Box
      display="flex"
      alignItems="center"
      p=".5em"
      mr="1em"
      backgroundColor={isActive ? "success" : "gray700"}
      title={isActive ? "Active" : "Inactive"}
      {...rest}
    >
      {isActive ? (
        <Check size="1em" color="white" />
      ) : (
        <Times size="1em" color="white" />
      )}
    </Box>
  );
};

ActiveIndicator.propTypes = {
  isActive: PropTypes.bool
};

export default ActiveIndicator;
