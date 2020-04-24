import React from "react";
import PropTypes from "prop-types";
import FlexBox from "./FlexBox";
import { Typography, Box } from "@smooth-ui/core-sc";
import RotatingSpinner from "./RotatingSpinner";

const LoadingIndicator = ({ verb, noun }) => (
  <FlexBox justifyContent="center">
    <Typography
      display="flex"
      justifyContent="space-evenly"
      alignItems="center"
      p={3}
      backgroundColor="cardBg"
    >
      <Box px={1}>
        <RotatingSpinner size="1em" />
      </Box>
      {verb} {noun || null} ...
    </Typography>
  </FlexBox>
);

LoadingIndicator.propTypes = {
  verb: PropTypes.string,
  noun: PropTypes.string
};

LoadingIndicator.defaultProps = {
  verb: "Loading"
};

export default LoadingIndicator;
