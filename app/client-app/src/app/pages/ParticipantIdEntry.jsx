import { useState } from "react";
import { Page } from "components/core";
import { Flex, Icon, Input, Button, Alert, AlertIcon } from "@chakra-ui/react";
import { FaList } from "react-icons/fa";
import LightHeading from "components/core/LightHeading";
import { useLocalInstances } from "app/contexts/LocalInstances";
import { decode } from "services/instance-id";
import { useSurveyInstance } from "api/survey-instances";
import { validateParticipantId } from "api/identity";

const ParticipantIdEntry = ({ friendlyId }) => {
  const { data: instance } = useSurveyInstance(...decode(friendlyId));

  const [id, setId] = useState();
  const [isBusy, setIsBusy] = useState();
  const [validationError, setValidationError] = useState("");
  const { storeInstanceParticipantId } = useLocalInstances();

  const handleChange = ({ target: { value } }) => setId(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    // get server to validate
    try {
      var { data: nextValidId } = await validateParticipantId(friendlyId, id);
      storeInstanceParticipantId(friendlyId, nextValidId);
    } catch {
      setValidationError(
        "The Participant ID entered was not accepted for accessing this Survey."
      );
    }

    setIsBusy(false);
  };

  // currently no specific type surveys (e.g. prolific)
  // allow manual pid entry
  if (instance.survey.type != null)
    return (
      <Page>
        <Flex
          direction="column"
          w="100%"
          align="center"
          justify="center"
          pt={100}
        >
          <Alert status="error" flexDirection="column">
            <AlertIcon />
            <p>This survey expects to be accessed via an external service.</p>
            <p>It looks like you may have used an invalid link to get here.</p>
            <p>Please return to the external service and try again.</p>
          </Alert>
        </Flex>
      </Page>
    );

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
              disabled={isBusy}
              size="lg"
              placeholder="Participant ID"
              onChange={handleChange}
              mr={2}
            />
            <Button
              disabled={isBusy}
              isLoading={isBusy}
              colorScheme="blue"
              size="lg"
              type="submit"
            >
              Submit
            </Button>
          </Flex>
        </form>
      </Flex>
    </Page>
  );
};

export default ParticipantIdEntry;
