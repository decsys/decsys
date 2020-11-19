import React, { useState } from "react";
import { Page } from "components/core";
import { Flex, Icon, Input, Button, Alert, AlertIcon } from "@chakra-ui/react";
import { FaList } from "react-icons/fa";
import LightHeading from "components/core/LightHeading";
import { useLocalInstances } from "app/contexts/LocalInstances";

const ParticipantIdEntry = ({ combinedId, validIdentifiers }) => {
  const [id, setId] = useState();
  const [validationError, setValidationError] = useState("");
  const { storeInstanceParticipantId } = useLocalInstances();

  const handleChange = ({ target: { value } }) => setId(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validIdentifiers.length > 0 && !validIdentifiers.includes(id)) {
      setValidationError(
        "The Participant ID entered was not accepted for accessing this Survey."
      );
      return;
    }
    storeInstanceParticipantId(combinedId, id);
  };

  return (
    <Page>
      <Flex
        direction="column"
        w="100%"
        align="center"
        justify="center"
        pt={100}
      >
        {validationError && (
          <Alert status="error">
            <AlertIcon />
            {validationError}
          </Alert>
        )}

        <Flex w="250px">
          <Icon as={FaList} boxSize="100%" />
        </Flex>

        <LightHeading as="h2" size="lg" mb={3}>
          Please enter a Participant ID to participate
        </LightHeading>
        <form onSubmit={handleSubmit}>
          <Flex>
            <Input
              size="lg"
              placeholder="Participant ID"
              onChange={handleChange}
              mr={2}
            />
            <Button colorScheme="blue" size="lg" type="submit">
              Submit
            </Button>
          </Flex>
        </form>
      </Flex>
    </Page>
  );
};

export default ParticipantIdEntry;
