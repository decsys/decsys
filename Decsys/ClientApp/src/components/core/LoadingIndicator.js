import React from "react";
import PropTypes from "prop-types";
import { Flex, Spinner, Text } from "@chakra-ui/core";
// import FlexBox from "./FlexBox";
// import { Typography, Box } from "@smooth-ui/core-sc";
// import RotatingSpinner from "./RotatingSpinner";

const LoadingIndicator = ({ verb, noun }) => (
  <Flex justify="center">
    <Flex justify="space-evenly" p={5}>
      <Flex mr={2}>
        <Spinner />
      </Flex>
      <Text as="i">
        {verb} {noun || null} ...
      </Text>
    </Flex>
  </Flex>
);

LoadingIndicator.propTypes = {
  verb: PropTypes.string,
  noun: PropTypes.string
};

LoadingIndicator.defaultProps = {
  verb: "Loading"
};

export default LoadingIndicator;
