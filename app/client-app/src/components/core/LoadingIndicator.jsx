import { Flex, Text, Spinner } from "@chakra-ui/react";

const LoadingIndicator = ({
  verb = "Loading",
  noun,
  layoutProps,
  textProps,
}) => {
  return (
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
};

export default LoadingIndicator;
