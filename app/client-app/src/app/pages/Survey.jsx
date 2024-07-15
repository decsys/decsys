import { useState, useCallback, useEffect } from "react";
import { BusyPage, Page } from "components/core";
import SurveyPage from "components/shared/SurveyPage";
import { navigate } from "@reach/router";
import { decode, encode } from "services/instance-id";
import {
  requestParticipantProgress,
  useParticipantProgress,
} from "api/participant-event-logs";
import { Error } from "./Error";
import { useLocalInstances } from "app/contexts/LocalInstances";
import { logParticipantEvent } from "api/participant-event-logs";
import ParticipantIdEntry from "./ParticipantIdEntry";
import { ErrorBoundary } from "components/ErrorBoundary";
import SurveyNotFoundError, { errorCallToAction } from "./SurveyNotFoundError";
import { useQueryString } from "hooks/useQueryString";
import Preview from "./Preview";
import useSWR from "swr";
import { getExternalSurveyDetails } from "api/survey-instances";

const useExternalLookup = (friendlyId, params, isPreview) => {
  const { instances, storeInstanceParticipantId } = useLocalInstances();

  const result = {
    friendlyId,
    participantId: instances[friendlyId],
  };

  return useSWR(
    JSON.stringify({
      friendlyId,
      params,
      isPreview,
    }),
    async () => {
      if (isPreview) return result;

      const [surveyId, instanceId] = decode(friendlyId);
      if (instanceId != null) return result;

      // if we've got here, our friendlyId contains survey ID only,
      // so we need to do an external lookup
      const { instanceId: lookupInstanceId, participantId } =
        await getExternalSurveyDetails(params, surveyId);

      result.friendlyId = encode(surveyId, lookupInstanceId);

      // TODO: if we ever allow repeatable surveys by external params
      // we'll need to validate id here, like we do with manual entry
      if (participantId) {
        storeInstanceParticipantId(friendlyId, participantId);
        result.participantId = participantId;
      }

      return result;
    },
    {
      suspense: true,
    }
  );
};

// Do all the data fetching and validation ahead of rendering the survey
const SurveyBootstrapper = ({ id: urlFriendlyId }) => {
  // we can lookup in progress participant Id's
  // to resume without prompting user for id
  const { instances, storeInstanceParticipantId } = useLocalInstances();

  // can opt into preview mode from query string
  const { preview: isPreview, ...params } = useQueryString();

  // depending what our friendlyId looks like,
  // we might need to do an external survey lookup
  const {
    data: { friendlyId: accessFriendlyId, participantId },
  } = useExternalLookup(urlFriendlyId, params, isPreview);

  // now we are sure we have a complete friendly id and participant id
  // we can check participant progress
  const { data: progress, mutate } = useParticipantProgress(
    !isPreview && accessFriendlyId, // preview skips progress fetching
    instances[accessFriendlyId] ?? participantId
  );

  if (isPreview) {
    const [accessSurveyId] = decode(accessFriendlyId);
    return <Preview id={accessSurveyId} />;
  }

  // this might differ from the access ID, e.g. for children of Studies
  const surveyFriendlyId = encode(progress.surveyId, progress.instanceId);

  // behave differently based on progress state
  /* Valid Progress matrix
   *
   *   Page | Known ID | New ID | Output
   *   ---------------------------------
   *     Y  |    Y     |    N   | (Update ID) and Load Page
   *     N  |    Y     |    N   | Survey complete and not repeatable
   *     N  |    N     |    N   | Interactive ID entry required
   *     Y  |    N     |    Y   | Update ID and Refetch Progress - autogenerated ID
   *     Y  |    Y     |    Y   | Update ID and Refetch Progress - Survey complete and repeatable
   */

  // Empty Survey
  if (!progress.pageCount)
    return (
      <Error
        message={"That Survey contains no pages."}
        callToAction={errorCallToAction}
      />
    );

  // Interactively get Participant Id
  if (!progress.participantId && !progress.newParticipantId)
    return <ParticipantIdEntry friendlyId={accessFriendlyId} />;

  storeInstanceParticipantId(
    accessFriendlyId,
    progress.newParticipantId ?? progress.participantId
  );

  if (!progress.newParticipantId && progress.participantId) {
    // Valid Survey Progress
    if (progress.page) {
      return (
        <Survey
          friendlyId={surveyFriendlyId} // use the actual target ids
          accessFriendlyId={accessFriendlyId} // pass the access id for completion usage
          participantId={progress.participantId}
          progress={progress}
          mutateProgress={mutate}
        />
      );
    } else {
      // Survey Complete
      navigate(`/survey/${accessFriendlyId}/complete`);
      return null;
    }
  }

  // Any reason we're still here?
  // e.g. handling a new participant id replacement
  return <BusyPage />;
};

const Survey = ({
  friendlyId,
  accessFriendlyId,
  participantId,
  progress,
  mutateProgress,
}) => {
  const { clearInstanceParticipantId } = useLocalInstances();
  const [isBusy, setIsBusy] = useState();

  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);

  const [surveyId, instanceId] = decode(friendlyId);

  const logEvent = useCallback(
    async (source, type, payload) => {
      await logParticipantEvent(
        instanceId,
        participantId,
        source,
        type,
        payload
      );
    },
    [instanceId, participantId]
  );

  const handleClick = async () => {
    if (!isMounted) return;

    // TODO confirm modal? if (progress.isLastPage)
    setIsBusy(true);
    try {
      // 1. POST navigation request
      const { data: progress } = await requestParticipantProgress(
        friendlyId,
        participantId,
        "next"
      );
      // 2. Handle response
      if (!progress.page) {
        // no next page provided; triggers survey completion
        // server already logged the completion event
        // so we should empty stored participant ids if necessary
        // and navigate to the correct completion url

        // the decsys completion page also does this, for safety
        // but we should do it here too for surveys with custom completion URLs
        if (progress.useParticipantIdentifiers)
          clearInstanceParticipantId(accessFriendlyId);

        await navigate(
          progress.settings?.CompletionUrl ??
            `/survey/${accessFriendlyId}/complete`
        );

        // go ahead and mutate progress anyway
        // so future stale states are more accurate
        mutateProgress(progress);
      } else {
        // progress; just mutate our local progress and proceed
        await mutateProgress(progress, true);
      }
    } catch (e) {
      console.error(e);
    }
    if (!isMounted) return;
    setIsBusy(false);
  };

  if (!progress?.page) return <BusyPage />;

  return (
    <Page layout="survey">
      <SurveyPage
        surveyId={surveyId}
        page={progress.page}
        lastPage={progress.isLastPage}
        handleNextClick={handleClick}
        logEvent={logEvent}
        isBusy={isBusy}
      />
    </Page>
  );
};

// Wrap everything in an error boundary,
// to catch errors from getting the instance via SWR (404, 400...)
const SurveyWrapper = ({ id }) => (
  <ErrorBoundary fallback={<SurveyNotFoundError />}>
    <SurveyBootstrapper id={id} />
  </ErrorBoundary>
);

export default SurveyWrapper;
