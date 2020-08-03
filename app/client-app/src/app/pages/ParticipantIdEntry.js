import React, { useState } from "react";
import { Page } from "components/core";
import { Flex, Icon, Input, Button, Alert, AlertIcon } from "@chakra-ui/core";
import { FaList } from "react-icons/fa";
import LightHeading from "components/core/LightHeading";
import { useUsers } from "contexts/UsersContext";

const ParticipantIdEntry = ({ setUserId, combinedId, validIdentifiers }) => {
  const [id, setId] = useState();
  const [validationError, setValidationError] = useState("");
  const { users } = useUsers();

  const handleChange = ({ target: { value } }) => setId(value);

  const handleClick = () => {
    if (validIdentifiers.length > 0 && !validIdentifiers.includes(id)) {
      setValidationError(
        "The Participant ID entered was not accepted for accessing this Survey."
      );
      return;
    }
    users.storeInstanceParticipantId(combinedId, id);
  };

  return (
    <Page brandLink="">
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

export default ParticipantIdEntry;
