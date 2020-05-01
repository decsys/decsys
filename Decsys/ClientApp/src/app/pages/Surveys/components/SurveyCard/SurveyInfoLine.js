import React from "react";
import { Badge, Flex } from "@chakra-ui/core";
import LightHeading from "components/core/LightHeading";

const SurveyInfoLine = ({ id, name, runCount }) => (
  <>
    <Flex align="center" justifyContent="center">
      <Badge
        w="100%"
        textAlign="center"
        variantColor="cyan"
        variant="solid"
        py={1}
      >
        {runCount} runs
      </Badge>
    </Flex>

    <Flex align="center">
      <LightHeading as="h2" size="md" title={name}>
        {name}
      </LightHeading>
    </Flex>
  </>
);

export default SurveyInfoLine;
