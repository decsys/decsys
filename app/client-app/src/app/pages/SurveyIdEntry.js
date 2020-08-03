import React, { useState } from "react";
import { navigate } from "@reach/router";
import { Page } from "components/core";
import { Flex, Icon, Input, Button } from "@chakra-ui/core";
import { FaList } from "react-icons/fa";
import LightHeading from "components/core/LightHeading";

const SurveyIdEntry = () => {
  const [id, setId] = useState();

  const handleChange = ({ target: { value } }) => setId(value);

  const handleClick = () => navigate(`/survey/${id}`);

  return (
    <Page brandLink="">
      <Flex
        direction="column"
        w="100%"
        align="center"
        justify="center"
        pt={100}
      >
        <Flex w="250px">
          <Icon as={FaList} boxSize="100%" />
        </Flex>

        <LightHeading as="h2" size="lg" mb={3}>
          Please enter a Survey ID to participate
        </LightHeading>
        <Flex>
          <Input
            size="lg"
            placeholder="Survey ID"
            onChange={handleChange}
            mr={2}
          />
          <Button colorScheme="blue" size="lg" onClick={handleClick}>
            Submit
          </Button>
        </Flex>
      </Flex>
    </Page>
  );
};

export default SurveyIdEntry;
