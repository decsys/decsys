import React from "react";
import FlexBox from "./FlexBox";
import { Typography } from "@smooth-ui/core-sc";
import RotatingSpinner from "./RotatingSpinner";

const LoadingIndicator = () => (
  <FlexBox justifyContent="center">
    <Typography
      display="flex"
      justifyContent="space-evenly"
      alignItems="center"
      width="10em"
      p={3}
      backgroundColor="cardBg"
    >
      <RotatingSpinner size="1em" />
      Loading...
    </Typography>
  </FlexBox>
);

export default LoadingIndicator;
