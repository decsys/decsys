import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, Button } from "@smooth-ui/core-sc";
import { Question } from "styled-icons/fa-solid";
import FlexBox from "./FlexBox";

const EmptyState = ({ splash, message, callToAction, ...p }) => (
  <FlexBox
    flexDirection="column"
    width={1}
    alignItems="center"
    justifyContent="center"
  >
    <Box width="20%" color="info" border={2} borderRadius={15} p={5}>
      {splash}
    </Box>
    <Typography variant="h3" m={3}>
      {message}
    </Typography>
    {callToAction && (
      <Button size="lg" onClick={callToAction.onClick}>
        {callToAction.label}
      </Button>
    )}
  </FlexBox>
);

EmptyState.propTypes = {
  splash: PropTypes.node,
  message: PropTypes.string,
  callToAction: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  })
};

EmptyState.defaultProps = {
  splash: <Question />,
  message: "Looks like there's nothing here!"
};

export default EmptyState;
