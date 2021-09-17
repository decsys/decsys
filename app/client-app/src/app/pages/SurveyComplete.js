import { useEffect } from "react";
import { Page, EmptyState } from "components/core";
import { Alert, AlertIcon, Stack } from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";
import { useParticipantProgress } from "api/participant-event-logs";
import ErrorBoundary from "components/ErrorBoundary";
import SurveyNotFoundError from "./SurveyNotFoundError";
import { useLocalInstances } from "app/contexts/LocalInstances";
import { navigate } from "@reach/router";

const SurveyComplete = ({ id }) => {
  // if Participants enter Identifiers,
  // then clear the stored ID now
  // so they are asked to enter again next time

  // We don't clear auto-generated ID's, to ensure we can track non-repeatable completion.

  // TODO: what the hell do we do about studies here? check parent?
  const { instances, clearInstanceParticipantId } = useLocalInstances();
  const { data: progress } = useParticipantProgress(id, instances[id]);

  useEffect(() => {
    if (progress.useParticipantIdentifiers) clearInstanceParticipantId(id);
  }, [id, progress, clearInstanceParticipantId]);

  const externalCompletionUrl = progress.settings?.CompletionUrl;

  return (
    <Page>
      <Stack mt={5}>
        {externalCompletionUrl && (
          <Alert status="info" flexDirection="column">
            <AlertIcon />
            <p>
              This Survey is accessed via an external service. You should have
              been redirected there upon completion.
            </p>

            <p>
              If something went wrong, you can follow the completion link again
              below.
            </p>
          </Alert>
        )}
        <EmptyState
          message="Survey Complete!"
          splash={FaCheck}
          callToAction={
            externalCompletionUrl && {
              label: "Return to External Survey Provider",
              onClick: () => navigate(externalCompletionUrl),
            }
          }
        />
      </Stack>
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
