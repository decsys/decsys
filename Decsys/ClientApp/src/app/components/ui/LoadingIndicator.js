import React from "react";
import styled, { keyframes } from "styled-components";
import FlexBox from "./FlexBox";
import { Spinner } from "styled-icons/fa-solid";
import { Typography } from "@smooth-ui/core-sc";

// Create the keyframes
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
    <FlexBox
      width="10em"
      justifyContent="space-between"
      alignItems="center"
      p={3}
      borderColor="cardBorder"
      border={1}
      borderRadius={10}
    >
      <Typography>Loading...</Typography>
      <RotatingSpinner size="1em" />
    </FlexBox>
  </FlexBox>
);

export default LoadingIndicator;
