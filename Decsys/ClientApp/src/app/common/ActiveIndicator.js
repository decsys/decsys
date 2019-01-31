import React from "react";
import PropTypes from "prop-types";
import { Box } from "@smooth-ui/core-sc";
import { Check, Times } from "styled-icons/fa-solid";

const ActiveIndicator = props => (
  <Box
    display="flex"
    alignItems="center"
    p=".5em"
    mr="1em"
    backgroundColor={props.active ? "success" : "gray700"}
    title={props.active ? "Active" : "Inactive"}
    {...props}
  >
    {props.active ? (
      <Check size="1em" color="white" />
    ) : (
      <Times size="1em" color="white" />
    )}
  </Box>
);

ActiveIndicator.propTypes = {
  active: PropTypes.bool
};

export default ActiveIndicator;
