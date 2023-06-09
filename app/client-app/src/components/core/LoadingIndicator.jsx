import PropTypes from "prop-types";
import { Flex, Text } from "@chakra-ui/react";
import Spinner from "./Spinner";

export const LoadingIndicator = ({ verb, noun, layoutProps, textProps }) => (
  <Flex justify="center" {...layoutProps}>
    <Flex justify="space-evenly" p={5} {...textProps}>
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
  noun: PropTypes.string,
};

LoadingIndicator.defaultProps = {
  verb: "Loading",
};
