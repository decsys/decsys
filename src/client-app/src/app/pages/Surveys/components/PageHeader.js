import React from "react";
import { Flex, Button } from "@chakra-ui/core";
import { FaPlusCircle } from "react-icons/fa";
import LightHeading from "components/core/LightHeading";

const PageHeader = ({ buttonAction }) => (
  <Flex my={8} align="center" justify="space-between">
    <LightHeading as="h1" size="xl">
      My Surveys
    </LightHeading>
    <Button variantColor="green" leftIcon={FaPlusCircle} onClick={buttonAction}>
      Add a Survey
    </Button>
  </Flex>
);

export default PageHeader;
