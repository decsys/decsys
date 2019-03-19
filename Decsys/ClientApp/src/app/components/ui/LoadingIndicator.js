import React from "react";
import styled, { keyframes } from "styled-components";
import FlexBox from "./FlexBox";
import { Spinner } from "styled-icons/fa-solid";
import { Typography } from "@smooth-ui/core-sc";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const RotatingSpinner = styled(Spinner)`
  animation: ${rotate} 2s linear infinite;
`;

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
