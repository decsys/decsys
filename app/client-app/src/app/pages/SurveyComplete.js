import React, { useEffect } from "react";
import { Page, EmptyState } from "components/core";
import { Flex } from "@chakra-ui/core";
import { FaCheck } from "react-icons/fa";
import { useSurveyInstance } from "api/survey-instances";
import { decode } from "services/instance-id";
import ErrorBoundary from "components/ErrorBoundary";
import SurveyNotFoundError from "./SurveyNotFoundError";
import { useLocalInstances } from "app/contexts/LocalInstances";

const SurveyComplete = ({ id }) => {
  // if Participants enter Identifiers,
  // then clear the stored ID now
  // so they are asked to enter again next time

  // We don't clear auto-generated ID's, to ensure we can track non-repeatable completion.

  const { data: instance } = useSurveyInstance(...decode(id));
  const { clearInstanceParticipantId } = useLocalInstances();

  useEffect(() => {
    if (instance.useParticipantIdentifiers) clearInstanceParticipantId(id);
  }, [id, instance, clearInstanceParticipantId]);

  return (
    <Page brandLink="">
      <Flex mt={5}>
        <EmptyState message="Survey Complete!" splash={FaCheck} />
      </Flex>
    </Page>
  );
};

// Wrap everything in an error boundary,
// to catch errors from getting the instance via SWR (404, 400...)
const SurveyCompleteWrapper = ({ id }) => (
  <ErrorBoundary fallback={<SurveyNotFoundError />}>
    <SurveyComplete id={id} />
  </ErrorBoundary>
);

export default SurveyCompleteWrapper;
