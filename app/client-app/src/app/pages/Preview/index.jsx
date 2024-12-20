import { useState, useEffect, useRef } from "react";
import { Page, StandardModal } from "components/core";
import SurveyPage from "components/shared/SurveyPage";
import { useChildList, useSurvey } from "api/surveys";
import { navigate } from "@reach/router";
import {
  Alert,
  AlertIcon,
  Button,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { pickRandomItem } from "services/randomizer";
import { getPageResponseItem } from "services/page-items";
import { isBuiltIn } from "services/page-items";
import { encode } from "services/instance-id";
import { previewWebhook } from "api/webhooks";
import { PAGE_NAVIGATION } from "constants/event-types";
import {
  ExportPayloadButton,
  WebhookPreviewBody,
} from "./components/Webhook/WebhookPreviewModal";

const navigateBack = (location) =>
  navigate(location?.state?.backRedirect ?? `/admin/surveys`);

const pickRandomChildOrDefault = (parentId, childIds = []) =>
  childIds.length ? pickRandomItem(childIds) : parentId;

const usePreviewSurvey = (surveyId) => {
  // first try and get children in case the surveyId is for a Study
  const { data: children } = useChildList(surveyId);

  const targetId = useRef(
    pickRandomChildOrDefault(
      surveyId,
      children.map((x) => x.id)
    ),
    [surveyId]
  );

  // then get the survey for either a randomly picked child,
  // or the survey itself if it has no children
  const {
    data: { parent, pages, settings },
  } = useSurvey(targetId.current);

  // finally, use parent settings if we have a parent
  return {
    pages,
    settings: parent?.settings ?? settings,
    targetId: targetId.current,
  };
};

const Preview = ({ id, location }) => {
  // Preview uses a Survey's Page List directly
  // it can't use progress as there is no participant
  const { targetId, pages, settings } = usePreviewSurvey(id);

  // It therefore has to maintain its own progress state
  // with regards to page order, and position
  // TODO: consider adding randomisation
  const [page, setPage] = useState(0);
  const [isBusy, setIsBusy] = useState();
  const [lastPage, setLastPage] = useState(false);
  const [webhookCount, setWebhookCount] = useState(0);
  useEffect(() => setLastPage(page === pages.length - 1), [page, pages.length]);
  const surveyCompleteModal = useDisclosure();

  const [participantSummary, setParticipantSummary] = useState({
    id: "PreviewParticipant",
    surveyStarted: new Date(),
    responses: [],
  });
  const [triggeredHooks, setTriggeredHooks] = useState([]);
  const [unread, setUnread] = useState(false);

  const logEvent = (source, type, payload) => {
    const pageResponseItem = getPageResponseItem(pages[page].components);

    if (type === "decsys.platform.PAGE_LOAD") {
      // Check if a response item exists for the current page
      if (pageResponseItem) {
        // Find the item marked as IsQuestionItem
        let questionItem = pages[page].components.find((x) => x.isQuestionItem);
        let questionContent = null;

        // If there's a question item, try to get content from it
        if (questionItem) {
          questionContent = questionItem.params.text;
        }
        // If no question item was found, then check for a built-in content item
        else {
          questionItem = pages[page].components.find((x) => isBuiltIn(x.type));
          if (questionItem) {
            questionContent = questionItem.params.text;
          }
        }

        setParticipantSummary((prevState) => ({
          ...prevState,
          responses: [
            ...prevState.responses,
            {
              page: pages[page].order,
              pageName: pages[page].name,
              question: questionContent,
              responseType: pageResponseItem.type,
              order: pages[page].order,
              pageLoad: new Date(),
              isOptional: pageResponseItem.isOptional,
            },
          ],
        }));
      }
    } else if (type == "decsys.platform.COMPONENT_RESULTS") {
      const relavantPage = pages.find((p) =>
        p.components.some((c) => c.id === source)
      );
      const pageIndex = relavantPage?.order - 1;
      if (pageIndex > -1) {
        setParticipantSummary((prevState) => {
          let updatedResponses = [...prevState.responses];
          updatedResponses[pageIndex] = {
            ...updatedResponses[pageIndex],
            response: payload,
            responseRecorded: new Date(),
          };
          return {
            ...prevState,
            responses: updatedResponses,
          };
        });
      }
    }
  };

  const handleClick = async () => {
    // you'd think busy state in preview wouldn't be worth it

    setIsBusy(true);

    // but in practice it resets scrolling between different page content ;)
    // as long as it takes a non "zero" amount of time
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Encode the surveyId
    const encodedSurveyId = encode(targetId) + "zb";

    // Compute ResolvedSuccess
    const resolvedSuccess = page >= 0 && page < pages.length;

    const webhookData = {
      participantId: "PreviewParticipant",
      surveyId: encodedSurveyId,
      timestamp: new Date().toISOString(),
      eventType: {
        SourcePage: page + 1,
        TargetPage: page,
        ResolvedPage: page + 2,
        ResolvedSuccess: !resolvedSuccess,
        Name: PAGE_NAVIGATION,
      },
      payload: participantSummary,
    };

    try {
      // Call the API with the webhook model
      const { status, data } = await previewWebhook(webhookData);
      switch (status) {
        case 200:
          setWebhookCount((prevCount) => prevCount + 1);
          setUnread(true);
          setTriggeredHooks((prev) => [...prev, data]);
          break;
        case 204:
          console.error("Webhook would not be triggered.");
          break;
        case 400:
          console.error("Invalid request payload.");
          break;
        default:
          console.error(`Unexpected status code: ${status}`);
      }
    } catch (e) {
      console.error(e);
    }

    if (lastPage) {
      if (settings?.CompletionUrl || webhookCount !== null)
        surveyCompleteModal.onOpen();
      else return navigateBack(location);
    } else {
      setPage(page + 1);
    }

    setIsBusy(false);
  };

  return (
    <Page layout="preview">
      <SurveyPage
        surveyId={targetId}
        page={pages[page]}
        lastPage={lastPage}
        handleNextClick={handleClick}
        isBusy={isBusy}
        logEvent={logEvent}
        webhookCount={webhookCount}
        unread={unread}
        setUnread={setUnread}
        setWebhookCount={setWebhookCount}
        triggeredHooks={triggeredHooks}
      />
      <SurveyCompleteModal
        modalState={surveyCompleteModal}
        completionUrl={settings?.CompletionUrl}
        location={location}
        triggeredHooks={triggeredHooks}
      />
    </Page>
  );
};

const CompletionRedirectAlert = () => (
  <Alert status="info">
    <AlertIcon />
    <Stack>
      <Text>This Survey has a Completion Redirect URL configured.</Text>
      <Text>You may want to follow it to test it works as expected.</Text>
    </Stack>
  </Alert>
);

const FollowUrlButton = ({ completionUrl }) => (
  <Button colorScheme="green" mb={1} onClick={() => navigate(completionUrl)}>
    Follow the configured URL
  </Button>
);

const ReturnToAdminButton = ({ navigateBack }) => (
  <Button colorScheme="blue" mb={1} onClick={navigateBack}>
    Return to Survey Admin
  </Button>
);

const ConfirmRedirectModalBody = ({
  completionUrl,
  navigateBack,
  triggeredHooks,
}) => (
  <Stack spacing={2} display="flex" width="92%">
    {completionUrl && <CompletionRedirectAlert />}
    <Text fontWeight="bold">What would you like to do?</Text>
    {triggeredHooks.length > 0 && (
      <ExportPayloadButton triggeredHooks={triggeredHooks} />
    )}
    {completionUrl && <FollowUrlButton completionUrl={completionUrl} />}
    <ReturnToAdminButton navigateBack={navigateBack} />
  </Stack>
);

const SurveyCompleteModal = ({
  modalState,
  completionUrl,
  location,
  triggeredHooks,
}) => {
  return (
    <StandardModal
      {...modalState}
      header="Survey Completion"
      cancelButton={false}
      showCloseButton={false}
      size="xl"
    >
      <VStack width="100%">
        {triggeredHooks && triggeredHooks.length > 0 && (
          <WebhookPreviewBody triggeredHooks={triggeredHooks} />
        )}
        <ConfirmRedirectModalBody
          completionUrl={completionUrl}
          navigateBack={navigateBack}
          location={location}
          triggeredHooks={triggeredHooks}
        />
      </VStack>
    </StandardModal>
  );
};

export default Preview;
