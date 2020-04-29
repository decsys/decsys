import React from "react";
import { Heading, Flex, Button } from "@chakra-ui/core";
import { FaPlusCircle } from "react-icons/fa";

const PageHeader = ({ buttonAction }) => (
  <Flex my={3} align="center" justify="space-between">
    <Heading as="h1" size="xl">
      My Surveys
    </Heading>
    <Button variantColor="green" leftIcon={FaPlusCircle} onClick={buttonAction}>
      Add a Survey
    </Button>
  </Flex>
);

export default PageHeader;
