import { useState, useEffect } from "react";
import { navigate } from "@reach/router";
import { Page } from "components/core";
import { Flex, Icon, Input, Button } from "@chakra-ui/react";
import { FaList } from "react-icons/fa";
import LightHeading from "components/core/LightHeading";
import { useQueryString } from "hooks/useQueryString";
import { useAsync } from "react-async";
import { getExternalSurveyDetails } from "api/survey-instances";
import { encode } from "services/instance-id";
import { useLocalInstances } from "app/contexts/LocalInstances";

const buildSurveyUrl = (id, preview) =>
  `/survey/${id}${preview ? `?preview=${preview}` : ""}`;

export const GatherSurveyId = () => {
  const { preview, ...params } = useQueryString();
  const { storeInstanceParticipantId } = useLocalInstances();

  const [id, setId] = useState();

  // if there are any query string params (besides `preview`)
  // we want to lookup an external survey
  // rather than ask the user for an id
  const externalLookup = useAsync({
    deferFn: () => getExternalSurveyDetails(params),
    onResolve: ({ surveyId, instanceId, participantId }) => {
      // No valid instance looked up;
      // we can't proceed from params
      if (!surveyId || !instanceId) return;

      const friendlyId = encode(surveyId, instanceId);

      if (participantId) storeInstanceParticipantId(friendlyId, participantId);

      console.log(preview);
      navigate(buildSurveyUrl(friendlyId, preview));
    },
    suspense: true,
  });

  useEffect(() => {
    if (Object.keys(params).length) externalLookup.run();
  }, []); // eslint-disable-line

  const handleChange = ({ target: { value } }) => setId(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(buildSurveyUrl(id, preview));
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
        <Flex w="250px">
          <Icon as={FaList} boxSize="100%" />
        </Flex>

        <LightHeading as="h2" size="lg" mb={3}>
          Please enter a Survey ID to participate
        </LightHeading>
        <form onSubmit={handleSubmit}>
          <Flex>
            <Input
              size="lg"
              placeholder="Survey ID"
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
